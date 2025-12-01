import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

import { Ammo } from "@fred3d/ammo";

console.log(PointerLockControls);

const camera = new THREE.PerspectiveCamera(
  75,
  globalThis.innerWidth / globalThis.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 1.8, 5);

// movement keys
const keys = { w: false, a: false, s: false, d: false, space: false };

// movement key logger events
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true;
});
document.addEventListener("keyup", (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false;
});

// physics runtime function
Ammo().then((Ammo) => {
  // physics world variable
  let physicsWorld;
  // array to store rigidbodies
  const rigidBodies = [];

  // ---- VARIABLES FOR HELD OBJECTS ---
  let heldBody = null;
  let heldMesh = null;
  const tmpTransform = new Ammo.btTransform();

  // ------ ALL TUNABLE VARIABLES ------
  const speed = .05;

  // initialize physics, scene, controls, and objects
  function init() {
    initPhysics();
    initScene();
    createPuzzleHoles();
    createCubes();
    animate();
  }

  // create physics function
  function initPhysics() {
    // initialize standard physics parameters.
    const config = new Ammo.btDefaultCollisionConfiguration();
    const dispatcher = new Ammo.btCollisionDispatcher(config);
    const broadphase = new Ammo.btDbvtBroadphase();
    const solver = new Ammo.btSequentialImpulseConstraintSolver();

    // create the physics world with the parameters
    physicsWorld = new Ammo.btDiscreteDynamicsWorld(
      dispatcher,
      broadphase,
      solver,
      config,
    );
    physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));
  }

  // variables for the scene and the renderer
  let scene, renderer;
  let holdPoint; // the invisible pickup point for the player

  // pointer lock
  const controls = new PointerLockControls(camera, document.body);
  document.addEventListener("click", () => controls.lock());

  // initialize scene function
  function initScene() {
    // create the scene and background
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);

    // set the hold point in comparison to the camera
    holdPoint = new THREE.Object3D();
    holdPoint.position.set(0, 0, -2);
    camera.add(holdPoint);
    scene.add(camera);

    // create the renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
    document.body.appendChild(renderer.domElement);

    // create the light
    const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    scene.add(light);

    // create the floor
    createFloor();
  }

  // floor creation function
  function createFloor() {
    // constants for the plane, mesh, and material
    const geo = new THREE.PlaneGeometry(200, 200);
    const mat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.rotation.x = -Math.PI / 2;
    scene.add(mesh);

    // create physics box and transform variables
    const shape = new Ammo.btBoxShape(new Ammo.btVector3(100, 0.1, 100));
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(new Ammo.btVector3(0, 0, 0));
    const motion = new Ammo.btDefaultMotionState(transform);
    const localInertia = new Ammo.btVector3(0, 0, 0);

    // initialize rigidbody using previous variables
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      0,
      motion,
      shape,
      localInertia,
    );
    const body = new Ammo.btRigidBody(rbInfo);
    physicsWorld.addRigidBody(body);
  }

  // create cubes function
  function createCubes() {
    const rainbow = [
        0xFF0000, // red
        0xFF7F00, // orange
        0xFFFF00, // yellow
        0x00FF00, // green
        0x0000FF, // blue
        0x8B00FF  // violet
    ];

    for (let i = 0; i < rainbow.length; i++) {
        const geo = new THREE.BoxGeometry(1, 1, 1);
        const mat = new THREE.MeshStandardMaterial({ color: rainbow[i] });
        const mesh = new THREE.Mesh(geo, mat);

        mesh.position.set(
            Math.random() * 8 - 4,
            3,
            Math.random() * 8 - 4
        );

        // store THE COLOR as the "shape" ID
        mesh.userData.shape = rainbow[i];

        scene.add(mesh);

        createRigidBody(
            mesh,
            new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5)),
            1
        );

        rigidBodies.push(mesh);
    }
  }

  // create rigidbody function for objects
  function createRigidBody(mesh, shape, mass) {
    // get transform and identities of the object
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(
      new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z),
    );

    // initialize physics of object
    const motion = new Ammo.btDefaultMotionState(transform);
    const localInertia = new Ammo.btVector3(0, 0, 0);

    if (mass > 0) shape.calculateLocalInertia(mass, localInertia);

    // take construction info and make the rigidbody with ammo's constructor
    const rbInfo = new Ammo.btRigidBodyConstructionInfo(
      mass,
      motion,
      shape,
      localInertia,
    );
    const body = new Ammo.btRigidBody(rbInfo);

    mesh.userData.physicsBody = body;
    physicsWorld.addRigidBody(body);
  }

  // puzzle holes variable
  const puzzleHoles = [];

  // create puzzle holes function
  function createPuzzleHoles() {
    const rainbow = [
        0xFF0000, // red
        0xFF7F00, // orange
        0xFFFF00, // yellow
        0x00FF00, // green
        0x0000FF, // blue
        0x8B00FF  // violet
    ];

    const startX = -9;

    for (let i = 0; i < rainbow.length; i++) {
        const x = startX + i * 3;

        // ring visual
        const ringGeo = new THREE.RingGeometry(0.6, 1, 32);
        const ringMat = new THREE.MeshStandardMaterial({ color: rainbow[i] });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = -Math.PI / 2;
        ring.position.set(x, 0.01, 0);
        scene.add(ring);

        puzzleHoles.push({
            position: new THREE.Vector3(x, 0.5, 0),
            requiredShape: rainbow[i],   // MATCH BY COLOR
            filled: false
        });
    }
  }

  // function for detecting shapes being moved into holes
  function checkPuzzleSnaps() {
    puzzleHoles.forEach((hole) => {
      if (hole.filled) return;

      rigidBodies.forEach((mesh) => {
        if (!mesh.userData.physicsBody) return;
        if (mesh.userData.shape !== hole.requiredShape) return;

        const dist = mesh.position.distanceTo(hole.position);
        if (dist < 0.7) {
          snapToHole(mesh, hole);
        }
      });
    });

    if (puzzleHoles.every((h) => h.filled)) triggerWinScreen();
  }

  function snapToHole(mesh, hole) {
    hole.filled = true;

    const body = mesh.userData.physicsBody;

    // Disable physics
    physicsWorld.removeRigidBody(body);

    mesh.position.copy(hole.position);
    mesh.rotation.set(0, 0, 0);
  }

  document.addEventListener("mousedown", () => {
    if (heldBody) {
      dropObject();
    } else {
      attemptPickup();
    }
  });

  function attemptPickup() {
    if (heldBody !== null) return; // already holding something

    // taycast from camera
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);

    // save all intersections with the raycast
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length === 0) return;

    // take first contact point
    const picked = intersects[0].object;

    // Find physics body
    const body = picked.userData.physicsBody;
    if (!body) return;

    // hold object hit
    heldMesh = picked;
    heldBody = body;

    // make object kinematic so it follows the hand
    body.setCollisionFlags(body.getCollisionFlags() | 2); // CF_KINEMATIC_OBJECT
    body.setActivationState(4); // DISABLE_DEACTIVATION

    console.log("Picked up:", picked.name);
  }

  // drop object function
  function dropObject() {
    if (!heldBody || !heldMesh) return;

    // 1. Write current mesh position/rotation into Ammo body transform
    const transform = new Ammo.btTransform();
    transform.setIdentity();
    transform.setOrigin(
      new Ammo.btVector3(
        heldMesh.position.x,
        heldMesh.position.y,
        heldMesh.position.z,
      ),
    );

    transform.setRotation(
      new Ammo.btQuaternion(
        heldMesh.quaternion.x,
        heldMesh.quaternion.y,
        heldMesh.quaternion.z,
        heldMesh.quaternion.w,
      ),
    );

    heldBody.setWorldTransform(transform);

    // also update motionState so Ammo doesn't revert
    const motionState = heldBody.getMotionState();
    if (motionState) motionState.setWorldTransform(transform);

    // 2. Restore dynamic physics
    heldBody.setCollisionFlags(0); // CF_DYNAMIC
    heldBody.setActivationState(1); // ACTIVE_TAG
    heldBody.activate();

    heldBody = null;
    heldMesh = null;

    console.log("Dropped object");
  }

  function updateHeldObject(_delta) {
    if (!heldBody || !heldMesh) return;

    // position in front of camera:
    const targetPos = camera.position.clone()
      .add(camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(2));

    // update physics transform
    tmpTransform.setIdentity();
    tmpTransform.setOrigin(
      new Ammo.btVector3(targetPos.x, targetPos.y, targetPos.z),
    );

    // activate held object
    heldBody.setWorldTransform(tmpTransform);
    heldBody.activate();

    // update mesh to match physics
    heldMesh.position.copy(targetPos);
    heldMesh.quaternion.copy(camera.quaternion); // optional – matches rotation
    heldMesh.updateMatrixWorld(true);
  }

  function animate() {
    // get animation by frame
    requestAnimationFrame(animate);

    // frame = 1/60 of a second
    const delta = 1 / 60;

    // simulate frame
    physicsWorld.stepSimulation(delta, 10);

    // movement
    if (keys.w) controls.moveForward(speed);
    if (keys.s) controls.moveForward(-speed);
    if (keys.a) controls.moveRight(-speed);
    if (keys.d) controls.moveRight(speed);

    // animate rigidbodies
    rigidBodies.forEach((mesh) => {
      // get body
      const body = mesh.userData.physicsBody;
      if (!body || mesh === heldBody) return;

      // change position by motion state
      const motionState = body.getMotionState();
      if (motionState) {
        const transform = new Ammo.btTransform();
        motionState.getWorldTransform(transform);

        mesh.position.set(
          transform.getOrigin().x(),
          transform.getOrigin().y(),
          transform.getOrigin().z(),
        );
      }

      mesh.updateMatrixWorld(true);
    });

    // update held object
    updateHeldObject(delta);

    // check win condition
    checkPuzzleSnaps();

    // render all
    renderer.render(scene, camera);
  }

  // win screen html function
  function triggerWinScreen() {
    const div = document.createElement("div");
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

  // intialize all
  init();
});
