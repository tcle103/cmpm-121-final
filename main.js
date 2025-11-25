import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

// new scnene
const scene = new THREE.Scene();

scene.background = new THREE.Color(0x87ceeb); // sky

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.y = 1.8; // eye height

//renderer settings
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
scene.add(light);

//gravity n stuff
let velocityY = 0;
let isOnGround = true;
const gravity = -0.005;   // how strong gravity is
const jumpStrength = 0.12; // how high the jump is

// Ground
const groundGeo = new THREE.PlaneGeometry(1000, 1000);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x228B22 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Random cubes to walk around
for (let i = 0; i < 30; i++) {
  const geo = new THREE.BoxGeometry();
  const mat = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
  const cube = new THREE.Mesh(geo, mat);
  cube.position.set(
    (Math.random() - 0.5) * 200,
    0.5,
    (Math.random() - 0.5) * 200
  );
  scene.add(cube);
}

// Pointer Lock Controls
const controls = new PointerLockControls(camera, document.body);
document.addEventListener('click', () => {
  controls.lock();
});

// Movement Controls
const keys = { w: false, a: false, s: false, d: false, space: false };

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key.toLowerCase() in keys) keys[e.key.toLowerCase()] = false;
});

// jump key 
document.addEventListener('keydown', (e) => {
  const key = e.key.toLowerCase();
  if (key in keys) keys[key] = true;

  if (key === ' ' && isOnGround) {
    velocityY = jumpStrength;
    isOnGround = false;
  }
});

const speed = 0.1;

function animate() {
    requestAnimationFrame(animate);

    if (keys.w) controls.moveForward(speed);
    if (keys.s) controls.moveForward(-speed);
    if (keys.a) controls.moveRight(-speed);
    if (keys.d) controls.moveRight(speed);

    // Gravity
    velocityY += gravity;
    camera.position.y += velocityY;

    // Ground collision
    if (camera.position.y <= 1.8) {
    camera.position.y = 1.8; // reset to ground height
    velocityY = 0;
    isOnGround = true;
    }

    renderer.render(scene, camera);
}

animate();

// Handle resizing
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
