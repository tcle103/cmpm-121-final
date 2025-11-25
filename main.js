import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// CAMERA
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 1.8;

// RENDERER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// LIGHT
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

// GROUND
const groundGeo = new THREE.PlaneGeometry(1000, 1000);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// STORE CUBES ARRAY (needed for raycasting)
const cubes = [];

// the cubes
for (let i = 0; i < 30; i++) {
  const geo = new THREE.BoxGeometry();
  const mat = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
  const cube = new THREE.Mesh(geo, mat);
  cube.position.set((Math.random() - 0.5) * 200, 0.5, (Math.random() - 0.5) * 200);
  cube.userData.pickup = true; // tag for pickup
  cubes.push(cube);
  scene.add(cube);
}

// pointer lock
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => controls.lock());

// movement keys
const keys = { w: false, a: false, s: false, d: false, space: false };

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true;
});
document.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false;
});

// jump
let velocityY = 0;
let isOnGround = true;
const gravity = -0.005;
const jumpStrength = 0.36;

document.addEventListener('keydown', (e) => {
  if (e.key === ' ' && isOnGround) {
    velocityY = jumpStrength;
    isOnGround = false;
  }
});

// raycast creation
const raycaster = new THREE.Raycaster();
let heldObject = null;

// raycast from camera to pickup object
function tryPickupObject() {
  if (heldObject) return; // already holding something

  raycaster.setFromCamera(new THREE.Vector2(0, 0), camera);
  const hits = raycaster.intersectObjects(cubes);

  if (hits.length > 0) {
    const obj = hits[0].object;
    heldObject = obj;
  }
}

function dropObject() {
  heldObject = null;
}

// Click to pick up / drop
document.addEventListener("mousedown", () => {
  if (!heldObject) tryPickupObject();
  else dropObject();
});

// MOVEMENT + UPDATE
const speed = 0.1;

function animate() {
  requestAnimationFrame(animate);

  // movement
  if (keys.w) controls.moveForward(speed);
  if (keys.s) controls.moveForward(-speed);
  if (keys.a) controls.moveRight(-speed);
  if (keys.d) controls.moveRight(speed);

  // gravity
  velocityY += gravity;
  camera.position.y += velocityY;

  if (camera.position.y <= 1.8) {
    camera.position.y = 1.8;
    velocityY = 0;
    isOnGround = true;
  }

  // move held object with player
  if (heldObject) {
    const holdDistance = 2;
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    heldObject.position.copy(camera.position).add(dir.multiplyScalar(holdDistance));
  }

  renderer.render(scene, camera);
}

animate();

// RESIZE
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
