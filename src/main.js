import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";

import * as Ammo from "@fred3d/ammo";

let physicsWorld;
const rigidBodies = [];
const tmpAmmoVec = new Ammo.btVector3();

async function init() {
  await Ammo(); // Wait for Ammo.js WASM to load

  initPhysics();
  initScene();
  initPlayerControls();
  createPuzzleHoles();
  createCubes();
  animate();
}

function initPhysics() {
  const config = new Ammo.btDefaultCollisionConfiguration();
  const dispatcher = new Ammo.btCollisionDispatcher(config);
  const broadphase = new Ammo.btDbvtBroadphase();
  const solver = new Ammo.btSequentialImpulseConstraintSolver();

  physicsWorld = new Ammo.btDiscreteDynamicsWorld(
    dispatcher,
    broadphase,
    solver,
    config,
  );
  physicsWorld.setGravity(new Ammo.btVector3(0, -9.82, 0));
}

let scene, camera, renderer;
let holdPoint; // The invisible pickup point
let heldBody = null;

// pointer lock
const controls = new PointerLockControls(camera, document.body);
document.addEventListener("click", () => controls.lock());

function initScene() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  camera = new THREE.PerspectiveCamera(
    75,
    globalThis.innerWidth / globalThis.innerHeight,
    0.1,
    1000,
  );
  camera.position.set(0, 1.8, 5);

  holdPoint = new THREE.Object3D();
  holdPoint.position.set(0, 0, -2);
  camera.add(holdPoint);
  scene.add(camera);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(globalThis.innerWidth, globalThis.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  createFloor();
}

function createFloor() {
  const geo = new THREE.PlaneGeometry(200, 200);
  const mat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.rotation.x = -Math.PI / 2;
  scene.add(mesh);

  // Ammo physics
  const shape = new Ammo.btBoxShape(new Ammo.btVector3(100, 0.1, 100));
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(new Ammo.btVector3(0, 0, 0));
  const motion = new Ammo.btDefaultMotionState(transform);
  const localInertia = new Ammo.btVector3(0, 0, 0);

  const rbInfo = new Ammo.btRigidBodyConstructionInfo(
    0,
    motion,
    shape,
    localInertia,
  );
  const body = new Ammo.btRigidBody(rbInfo);
  physicsWorld.addRigidBody(body);
}

function createCubes() {
  for (let i = 0; i < 10; i++) {
    const geo = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshStandardMaterial({
      color: Math.random() * 0xffffff,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(Math.random() * 10 - 5, 3, Math.random() * 10 - 5);
    scene.add(mesh);

    mesh.userData.shape = "cube";

    createRigidBody(
      mesh,
      new Ammo.btBoxShape(new Ammo.btVector3(0.5, 0.5, 0.5)),
      1,
    );
    rigidBodies.push(mesh);
  }
}

function createRigidBody(mesh, shape, mass) {
  const transform = new Ammo.btTransform();
  transform.setIdentity();
  transform.setOrigin(
    new Ammo.btVector3(mesh.position.x, mesh.position.y, mesh.position.z),
  );

  const motion = new Ammo.btDefaultMotionState(transform);
  const localInertia = new Ammo.btVector3(0, 0, 0);

  if (mass > 0) shape.calculateLocalInertia(mass, localInertia);

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

const puzzleHoles = [];

function createPuzzleHoles() {
  const startX = -3;

  for (let i = 0; i < 3; i++) {
    const x = startX + i * 3;

    // Visual ring
    const ringGeo = new THREE.RingGeometry(0.6, 1, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.01, 0);
    scene.add(ring);

    // Puzzle slot data
    puzzleHoles.push({
      position: new THREE.Vector3(x, 0.5, 0),
      requiredShape: "cube",
      filled: false,
    });
  }
}

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
  const dir = new THREE.Vector3();
  camera.getWorldDirection(dir);

  const raycaster = new THREE.Raycaster(camera.position, dir);
  const hits = raycaster.intersectObjects(rigidBodies);

  if (hits.length === 0) return;

  const mesh = hits[0].object;
  heldBody = mesh.userData.physicsBody;
  isHolding = true;
}

function dropObject() {
  heldBody = null;
}

function updateHeldObject(_delta) {
  if (!heldBody) return;

  const desired = new THREE.Vector3();
  holdPoint.getWorldPosition(desired);

  const body = heldBody;
  const motionState = body.getMotionState();

  if (!motionState) return;

  const transform = new Ammo.btTransform();
  motionState.getWorldTransform(transform);

  const origin = transform.getOrigin();
  const pos = new THREE.Vector3(origin.x(), origin.y(), origin.z());

  const force = desired.clone().sub(pos).multiplyScalar(50); // pulling strength

  tmpAmmoVec.setValue(force.x, force.y, force.z);
  body.applyCentralForce(tmpAmmoVec);
}

function animate() {
  requestAnimationFrame(animate);

  const delta = 1 / 60;

  physicsWorld.stepSimulation(delta, 10);

  rigidBodies.forEach((mesh) => {
    const body = mesh.userData.physicsBody;
    if (!body || mesh === heldBody) return;

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
  });

  updateHeldObject(delta);
  checkPuzzleSnaps();

  renderer.render(scene, camera);
}

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

init();
