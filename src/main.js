import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { Ammo } from "@fred3d/ammo";
import { createScene1 } from "./scene1.js";
import { createScene2 } from "./scene2.js";

const inventory = [];
let puzzleTimeLimit = 60; // seconds
let puzzleStartTime = 0;
let failTriggered = false;
let spawnedInventoryMeshes = [];
Ammo().then((AmmoLib) => {
  let physicsWorld;
  let camera, renderer, controls;
  let currentScene = null;
  let rigidBodies = [];
  let puzzleHoles = [];

  //win flag
  let winTriggered = false;

  // Held object variables
  let heldBody = null;
  let heldMesh = null;
  const tmpTransform = new AmmoLib.btTransform();

  const keys = { w: false, a: false, s: false, d: false };

  // -- FUNCTIONS -- //
  function startPuzzleTimer() {
    puzzleStartTime = performance.now();
    failTriggered = false;
  }

  function updatePuzzleTimer() {
    if (winTriggered || failTriggered) return;

    const elapsed = (performance.now() - puzzleStartTime) / 1000; // seconds
    if (elapsed >= puzzleTimeLimit) {
      failTriggered = true;
      triggerFailScreen();
    }
  }
  
  function triggerFailScreen() {
    const div = document.createElement("div");
    div.id = "failText";
    div.innerText = "Time's Up! You Failed!";
    div.style.position = "absolute";
    div.style.top = "40%";
    div.style.left = "50%";
    div.style.transform = "translate(-50%, -50%)";
    div.style.fontSize = "60px";
    div.style.color = "red";
    div.style.fontFamily = "Arial";
    div.style.background = "rgba(0,0,0,0.7)";
    div.style.padding = "20px 40px";
    document.body.appendChild(div);

    // Optional: Reset scene after 3 seconds
    setTimeout(() => {
      switchScene(currentSceneNumber);
    }, 3000);
  } 
  

  // Key events
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true;
  });
  document.addEventListener("keyup", (e) => {
    if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false;
  });

  // Initialize systems
  let currentSceneNumber = 1;
  initPhysics();
  initRenderer();
  initCameraAndControls();
  switchScene(1);

  // -------------------
  function initPhysics() {
    const config = new AmmoLib.btDefaultCollisionConfiguration();
    const dispatcher = new AmmoLib.btCollisionDispatcher(config);
    const broadphase = new AmmoLib.btDbvtBroadphase();
    const solver = new AmmoLib.btSequentialImpulseConstraintSolver();
    physicsWorld = new AmmoLib.btDiscreteDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      config,
    );
    physicsWorld.setGravity(new AmmoLib.btVector3(0, -9.82, 0));
  }

  function initRenderer() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
    document.body.appendChild(renderer.domElement);
  }

  function initCameraAndControls() {
    camera = new THREE.PerspectiveCamera(
      75,
      globalThis.innerWidth / globalThis.innerHeight,
      0.1,
      1000,
    );
    camera.position.set(0, 1.8, 5);

    controls = new PointerLockControls(camera, document.body);
    document.addEventListener("click", () => controls.lock());
  }

  // ------------------- Scene Switching
  function switchScene(sceneNumber) {
    startPuzzleTimer();
    currentSceneNumber = sceneNumber;
    // remove previous "YOU WIN" div if it exists
    const winDiv = document.getElementById("winText");
    if (winDiv) winDiv.remove();
    winTriggered = false;

    renderer.renderLists.dispose();

    if (currentScene) currentScene.clear();

    // remove old physics bodies
    rigidBodies.forEach((mesh) => {
      const body = mesh.userData.physicsBody;
      if (body) physicsWorld.removeRigidBody(body);
    });

    if (sceneNumber === 1) {
      const { scene, rigidBodies: rb, puzzleHoles: holes } = createScene1(
        physicsWorld,
        AmmoLib,
      );
      currentScene = scene;
      rigidBodies = rb;
      puzzleHoles = holes;
      puzzleHoles.forEach((h) => h.filled = false);
      // add camera to scene
      currentScene.add(camera);
    } else {
      const { scene, rigidBodies: rb, puzzleHoles: holes } = createScene2(
        physicsWorld,
        AmmoLib,
      );
      currentScene = scene;
      rigidBodies = rb;
      puzzleHoles = holes;
      currentScene.add(camera);
    }
    spawnInventoryItems();

  }

  function goToNextScene() {
    switchScene(currentSceneNumber + 1);
  }

  // -------------------
  function animate() {
    requestAnimationFrame(animate);

    updatePuzzleTimer(); 

    const delta = 1 / 60;
    physicsWorld.stepSimulation(delta, 10);

    // Movement
    if (keys.w) controls.moveForward(0.05);
    if (keys.s) controls.moveForward(-0.05);
    if (keys.a) controls.moveRight(-0.05);
    if (keys.d) controls.moveRight(0.05);

    // Update rigid bodies
    rigidBodies.forEach((mesh) => {
      const body = mesh.userData.physicsBody;
      if (!body || mesh === heldMesh) return;
      const motionState = body.getMotionState();
      if (motionState) {
        const transform = new AmmoLib.btTransform();
        motionState.getWorldTransform(transform);
        mesh.position.set(
          transform.getOrigin().x(),
          transform.getOrigin().y(),
          transform.getOrigin().z(),
        );
        mesh.quaternion.set(
          transform.getRotation().x(),
          transform.getRotation().y(),
          transform.getRotation().z(),
          transform.getRotation().w(),
        );
      }
    });

    updateHeldObject(delta);
    checkPuzzleSnaps();

    renderer.render(currentScene, camera);
  }

  // -------------------
  function storeHeldObject() {
      if (!heldMesh || !heldBody) return;

      // Save cube info
      inventory.push({
        shape: heldMesh.userData.shape,
        color: heldMesh.material.color.getHex(),
      });

      // Remove from physics world
      physicsWorld.removeRigidBody(heldBody);

      // Remove mesh from scene
      currentScene.remove(heldMesh);

      heldBody = null;
      heldMesh = null;

      console.log("Stored inventory:", inventory);
    }
  // PICKUP / DROP
  document.addEventListener("mousedown", () => {

    if (heldBody) dropObject();
    else attemptPickup();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "e" || e.key === "E") storeHeldObject();
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

    const floorY = 0; // adjust if your floor is higher
    const dropHeight = Math.max(heldMesh.position.y, floorY + 0.5); // at least 0.5 above floor

    // Reset physics transform
    tmpTransform.setIdentity();
    tmpTransform.setOrigin(
      new AmmoLib.btVector3(
        heldMesh.position.x,
        dropHeight,
        heldMesh.position.z,
      ),
    );
    tmpTransform.setRotation(
      new AmmoLib.btQuaternion(
        heldMesh.quaternion.x,
        heldMesh.quaternion.y,
        heldMesh.quaternion.z,
        heldMesh.quaternion.w,
      ),
    );
    heldBody.setWorldTransform(tmpTransform);

    // Reset motion state
    const motionState = heldBody.getMotionState();
    if (motionState) motionState.setWorldTransform(tmpTransform);

    // Re-enable dynamics
    heldBody.setCollisionFlags(0); // dynamic
    heldBody.setActivationState(1); // awake
    heldBody.activate();

    // Reset velocities
    heldBody.setLinearVelocity(new AmmoLib.btVector3(0, 0, 0));
    heldBody.setAngularVelocity(new AmmoLib.btVector3(0, 0, 0));

    // Clear held object
    heldBody = null;
    heldMesh = null;
  }

  function updateHeldObject(_delta) {
    if (!heldBody || !heldMesh) return;

    const targetPos = camera.position.clone().add(
      camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(2),
    );
    tmpTransform.setIdentity();
    tmpTransform.setOrigin(
      new AmmoLib.btVector3(targetPos.x, targetPos.y, targetPos.z),
    );
    heldBody.setWorldTransform(tmpTransform);
    heldBody.activate();

    heldMesh.position.copy(targetPos);
    heldMesh.quaternion.copy(camera.quaternion);
    heldMesh.updateMatrixWorld(true);
  }
  //inventory
  function spawnInventoryItems() {
    // Remove previous spawned inventory
  spawnedInventoryMeshes.forEach((mesh) => {
    currentScene.remove(mesh);
    physicsWorld.removeRigidBody(mesh.userData.physicsBody);
  });
  spawnedInventoryMeshes = [];

    inventory.forEach((item, i) => {
      // Spawn cubes in front of the player or a fixed location
      const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
      const cubeMat = new THREE.MeshStandardMaterial({ color: item.color });
      const cube = new THREE.Mesh(cubeGeo, cubeMat);

      cube.position.set(0 + i * 2, 3, 0); // spread them out
      cube.userData.shape = item.shape;

      currentScene.add(cube);

      // Physics body:
      const shape = new AmmoLib.btBoxShape(
        new AmmoLib.btVector3(0.5, 0.5, 0.5),
      );
      const transform = new AmmoLib.btTransform();
      transform.setIdentity();
      transform.setOrigin(
        new AmmoLib.btVector3(
          cube.position.x,
          cube.position.y,
          cube.position.z,
        ),
      );
      const motion = new AmmoLib.btDefaultMotionState(transform);
      const localInertia = new AmmoLib.btVector3(0, 0, 0);
      shape.calculateLocalInertia(1, localInertia);
      const rbInfo = new AmmoLib.btRigidBodyConstructionInfo(
        1,
        motion,
        shape,
        localInertia,
      );
      const body = new AmmoLib.btRigidBody(rbInfo);

      cube.userData.physicsBody = body;
      rigidBodies.push(cube);
      physicsWorld.addRigidBody(body);
    });
  }

  // -------------------
  // PUZZLE SNAP
  function checkPuzzleSnaps() {
    puzzleHoles.forEach((hole) => {
      if (hole.filled) return;

      rigidBodies.forEach((mesh) => {
        const body = mesh.userData.physicsBody;
        if (!body) return;
        if (mesh.userData.shape !== hole.requiredShape) return;
        if (mesh === heldMesh) return;

        const dist = mesh.position.distanceTo(hole.position);
        if (dist < 0.7 && mesh.position.y <= hole.position.y + 0.1) {
          snapToHole(mesh, hole);
        }
      });
    });

    // ------ win trigger ------
    if (!winTriggered && puzzleHoles.every((h) => h.filled)) {
      winTriggered = true;
      triggerWinScreen();

      setTimeout(() => {
        goToNextScene();
      }, 1000);
    }
  }

  function snapToHole(mesh, hole) {
    hole.filled = true;
    const body = mesh.userData.physicsBody;
    mesh.userData.physicsBody = null;
    physicsWorld.removeRigidBody(body);
    mesh.position.copy(hole.position);
    mesh.rotation.set(0, 0, 0);
    mesh.updateMatrixWorld(true);
    mesh.userData.snapped = true;
  }

  function triggerWinScreen() {
    const div = document.createElement("div");
    div.id = "winText";
    div.innerText = "Puzzle Complete!";
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
  animate();
});
