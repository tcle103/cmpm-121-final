import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { Ammo } from "@fred3d/ammo";
import { createScene1 } from "./scene1.js";
import { createScene2 } from "./scene2.js";

Ammo().then((AmmoLib) => {
  let physicsWorld;
  let camera, renderer, controls;
  let currentScene = null;
  let rigidBodies = [];
  let puzzleHoles = [];

  // Held object variables
  let heldBody = null;
  let heldMesh = null;
  const tmpTransform = new AmmoLib.btTransform();

  const keys = { w: false, a: false, s: false, d: false };

  // Key events
  document.addEventListener("keydown", (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true; });
  document.addEventListener("keyup", (e) => { if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false; });

  // Initialize systems
  initPhysics();
  initRenderer();
  initCameraAndControls();
  switchScene(1);
  animate();

  // -------------------
  function initPhysics() {
    const config = new AmmoLib.btDefaultCollisionConfiguration();
    const dispatcher = new AmmoLib.btCollisionDispatcher(config);
    const broadphase = new AmmoLib.btDbvtBroadphase();
    const solver = new AmmoLib.btSequentialImpulseConstraintSolver();
    physicsWorld = new AmmoLib.btDiscreteDynamicsWorld(dispatcher, broadphase, solver, config);
    physicsWorld.setGravity(new AmmoLib.btVector3(0, -9.82, 0));
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
    document.body.appendChild(renderer.domElement);
  }

  function initCameraAndControls() {
    camera = new THREE.PerspectiveCamera(75, globalThis.innerWidth / globalThis.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.8, 5);

    controls = new PointerLockControls(camera, document.body);
    document.addEventListener("click", () => controls.lock());
  }

  // -------------------
  function switchScene(sceneNumber) {
    // remove previous "YOU WIN" div if it exists
    const winDiv = document.getElementById("winText");
    if (winDiv) winDiv.remove();

    // remove old physics bodies
    rigidBodies.forEach(mesh => {
      const body = mesh.userData.physicsBody;
      if (body) physicsWorld.removeRigidBody(body);
    });

    if (sceneNumber === 1) {
      const { scene, rigidBodies: rb, puzzleHoles: holes } = createScene1(physicsWorld, AmmoLib);
      currentScene = scene;
      rigidBodies = rb;
      puzzleHoles = holes;
      // add camera to scene
      currentScene.add(camera);
    } else {
      const { scene, rigidBodies: rb } = createScene2(physicsWorld, AmmoLib);
      currentScene = scene;
      rigidBodies = rb;
      puzzleHoles = [];
      currentScene.add(camera);
    }
  }

  // -------------------
  function animate() {
    requestAnimationFrame(animate);

    const delta = 1 / 60;
    physicsWorld.stepSimulation(delta, 10);

    // Movement
    if (keys.w) controls.moveForward(0.05);
    if (keys.s) controls.moveForward(-0.05);
    if (keys.a) controls.moveRight(-0.05);
    if (keys.d) controls.moveRight(0.05);

    // Update rigid bodies
    rigidBodies.forEach(mesh => {
      const body = mesh.userData.physicsBody;
      if (!body || mesh === heldMesh) return;
      const motionState = body.getMotionState();
      if (motionState) {
        const transform = new AmmoLib.btTransform();
        motionState.getWorldTransform(transform);
        mesh.position.set(transform.getOrigin().x(), transform.getOrigin().y(), transform.getOrigin().z());
        mesh.quaternion.set(
          transform.getRotation().x(),
          transform.getRotation().y(),
          transform.getRotation().z(),
          transform.getRotation().w()
        );
      }
    });

    updateHeldObject(delta);
    checkPuzzleSnaps();

    renderer.render(currentScene, camera);
  }

  // -------------------
  // PICKUP / DROP
  document.addEventListener("mousedown", () => {
    if (heldBody) dropObject();
    else attemptPickup();
  });

  function attemptPickup() {
    if (heldBody !== null) return;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
    const intersects = raycaster.intersectObjects(currentScene.children, true);
    if (!intersects.length) return;

    const picked = intersects[0].object;
    const body = picked.userData.physicsBody;
    if (!body) return;

    heldMesh = picked;
    heldBody = body;
    body.setCollisionFlags(body.getCollisionFlags() | 2); // kinematic
    body.setActivationState(4); // disable deactivation
  }

  function dropObject() {
    if (!heldBody || !heldMesh) return;

    tmpTransform.setIdentity();
    tmpTransform.setOrigin(new AmmoLib.btVector3(heldMesh.position.x, heldMesh.position.y, heldMesh.position.z));
    tmpTransform.setRotation(new AmmoLib.btQuaternion(
      heldMesh.quaternion.x,
      heldMesh.quaternion.y,
      heldMesh.quaternion.z,
      heldMesh.quaternion.w
    ));
    heldBody.setWorldTransform(tmpTransform);
    const motionState = heldBody.getMotionState();
    if (motionState) motionState.setWorldTransform(tmpTransform);

    heldBody.setCollisionFlags(0);
    heldBody.setActivationState(1);
    heldBody.activate();

    heldBody = null;
    heldMesh = null;
  }

  function updateHeldObject(_delta) {
    if (!heldBody || !heldMesh) return;

    const targetPos = camera.position.clone().add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(2));
    tmpTransform.setIdentity();
    tmpTransform.setOrigin(new AmmoLib.btVector3(targetPos.x, targetPos.y, targetPos.z));
    heldBody.setWorldTransform(tmpTransform);
    heldBody.activate();

    heldMesh.position.copy(targetPos);
    heldMesh.quaternion.copy(camera.quaternion);
    heldMesh.updateMatrixWorld(true);
  }

  // -------------------
  // PUZZLE SNAP
  function checkPuzzleSnaps() {
    puzzleHoles.forEach((hole) => {
      if (hole.filled) return;
      rigidBodies.forEach((mesh) => {
        if (!mesh.userData.physicsBody) return;
        if (mesh.userData.shape !== hole.requiredShape) return;
        const dist = mesh.position.distanceTo(hole.position);
        if (dist < 0.7) snapToHole(mesh, hole);
      });
    });
  }

  function snapToHole(mesh, hole) {
    hole.filled = true;
    const body = mesh.userData.physicsBody;
    physicsWorld.removeRigidBody(body);
    mesh.position.copy(hole.position);
    mesh.rotation.set(0, 0, 0);
    // check win
    if (puzzleHoles.every(h => h.filled)) triggerWinScreen();
  }

  function triggerWinScreen() {
    const div = document.createElement("div");
    div.id = "winText"; 
    div.innerText = "YOU WIN!";
    div.style.position = "absolute";
    div.style.top = "40%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.fontSize = "60px";
    div.style.color = "white";
    div.style.fontFamily = "Arial";
    div.style.background = "rgba(0,0,0,0.7)";
    div.style.padding = "20px 40px";
    document.body.appendChild(div);
  }

  // -------------------
  // Scene switching keys
  document.addEventListener("keydown", (e) => {
    if (e.key === "1") switchScene(1);
    if (e.key === "2") switchScene(2);
  });
});

