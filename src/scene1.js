import * as THREE from "three";

export function createScene1(physicsWorld, AmmoLib) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  const rigidBodies = [];

  // Floor mesh
  const geo = new THREE.PlaneGeometry(200, 200);
  const mat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Physics floor
  const shape = new AmmoLib.btBoxShape(new AmmoLib.btVector3(100, 0.1, 100));
  const transform = new AmmoLib.btTransform();
  transform.setIdentity();
  transform.setOrigin(new AmmoLib.btVector3(0, 0, 0));
  const motion = new AmmoLib.btDefaultMotionState(transform);
  const rbInfo = new AmmoLib.btRigidBodyConstructionInfo(0, motion, shape, new AmmoLib.btVector3(0, 0, 0));
  const body = new AmmoLib.btRigidBody(rbInfo);
  physicsWorld.addRigidBody(body);

  // Light
  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  // Puzzle holes
  const puzzleHoles = [];
  const startX = -3;
  for (let i = 0; i < 3; i++) {
    const x = startX + i * 3;
    const ringGeo = new THREE.RingGeometry(0.6, 1, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: 0xffff00 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.01, 0);
    scene.add(ring);

    puzzleHoles.push({
      position: new THREE.Vector3(x, 0.5, 0),
      requiredShape: "cube",
      filled: false,
    });
  }

  // Cubes
const holesX = puzzleHoles.map(h => h.position.x); // X positions of the puzzle rings

function randomOutsideGoals(start, end, holesX) {
  let x;
  do {
    x = Math.random() * (end - start) + start;
  } while (holesX.some(holeX => Math.abs(x - holeX) < 1.2)); // avoid 1.2 units around holes
  return x;
}

for (let i = 0; i < 10; i++) {
  const cubeGeo = new THREE.BoxGeometry(1, 1, 1);
  const cubeMat = new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff });
  const cube = new THREE.Mesh(cubeGeo, cubeMat);
  
  const x = randomOutsideGoals(-5, 5, holesX); // X avoids puzzle rings
  const z = Math.random() * 10 - 5;           // Z can remain random
  cube.position.set(x, 3, z);

  cube.userData.shape = "cube";
  scene.add(cube);

  // Ammo rigidbody
  const cubeShape = new AmmoLib.btBoxShape(new AmmoLib.btVector3(0.5, 0.5, 0.5));
  const cubeTransform = new AmmoLib.btTransform();
  cubeTransform.setIdentity();
  cubeTransform.setOrigin(new AmmoLib.btVector3(cube.position.x, cube.position.y, cube.position.z));
  const cubeMotion = new AmmoLib.btDefaultMotionState(cubeTransform);
  const localInertia = new AmmoLib.btVector3(0, 0, 0);
  cubeShape.calculateLocalInertia(1, localInertia);
  const rbInfoCube = new AmmoLib.btRigidBodyConstructionInfo(1, cubeMotion, cubeShape, localInertia);
  const cubeBody = new AmmoLib.btRigidBody(rbInfoCube);
  physicsWorld.addRigidBody(cubeBody);

  cube.userData.physicsBody = cubeBody;
  rigidBodies.push(cube);
}

  // Return both scene and rigid bodies
  return { scene, rigidBodies, puzzleHoles };
}
