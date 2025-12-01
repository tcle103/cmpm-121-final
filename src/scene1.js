import * as THREE from "three";

export function createScene1(physicsWorld, AmmoLib) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb);

  const rigidBodies = [];
  const puzzleHoles = [];

  const rainbow = [
    0xFF0000, 0xFF7F00, 0xFFFF00,
    0x00FF00, 0x0000FF, 0x8B00FF
  ];

  // Floor
  const geo = new THREE.PlaneGeometry(200, 200);
  const mat = new THREE.MeshStandardMaterial({ color: 0x228b22 });
  const floor = new THREE.Mesh(geo, mat);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  const shape = new AmmoLib.btBoxShape(new AmmoLib.btVector3(100, 0.1, 100));
  const transform = new AmmoLib.btTransform();
  transform.setIdentity();
  transform.setOrigin(new AmmoLib.btVector3(0, 0, 0));
  const motion = new AmmoLib.btDefaultMotionState(transform);
  const rbInfo = new AmmoLib.btRigidBodyConstructionInfo(0, motion, shape, new AmmoLib.btVector3(0,0,0));
  const body = new AmmoLib.btRigidBody(rbInfo);
  physicsWorld.addRigidBody(body);

  // Light
  const light = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
  scene.add(light);

  // Puzzle holes
  const startX = -9;
  for (let i = 0; i < rainbow.length; i++) {
    const x = startX + i * 3;
    const ringGeo = new THREE.RingGeometry(0.6, 1, 32);
    const ringMat = new THREE.MeshStandardMaterial({ color: rainbow[i] });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.set(x, 0.01, 0);
    scene.add(ring);

    puzzleHoles.push({
      position: new THREE.Vector3(x, 0.5, 0),
      requiredShape: rainbow[i],
      filled: false
    });
  }

  // Cubes
  function randomOutsideGoals(start, end, holesX) {
    let x;
    do {
      x = Math.random() * (end - start) + start;
    } while (holesX.some(holeX => Math.abs(x - holeX) < 1.2));
    return x;
  }

  const holesX = puzzleHoles.map(h => h.position.x);

  for (let i = 0; i < rainbow.length; i++) {
    const cubeGeo = new THREE.BoxGeometry(1,1,1);
    const cubeMat = new THREE.MeshStandardMaterial({ color: rainbow[i] });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);

    const x = randomOutsideGoals(-10, 10, holesX);
    const z = Math.random() * 10 - 5;
    cube.position.set(x, 3, z);

    cube.userData.shape = rainbow[i];
    scene.add(cube);

    const cubeShape = new AmmoLib.btBoxShape(new AmmoLib.btVector3(0.5, 0.5, 0.5));
    const cubeTransform = new AmmoLib.btTransform();
    cubeTransform.setIdentity();
    cubeTransform.setOrigin(new AmmoLib.btVector3(cube.position.x, cube.position.y, cube.position.z));
    const cubeMotion = new AmmoLib.btDefaultMotionState(cubeTransform);
    const localInertia = new AmmoLib.btVector3(0,0,0);
    cubeShape.calculateLocalInertia(1, localInertia);
    const rbInfoCube = new AmmoLib.btRigidBodyConstructionInfo(1, cubeMotion, cubeShape, localInertia);
    const cubeBody = new AmmoLib.btRigidBody(rbInfoCube);
    physicsWorld.addRigidBody(cubeBody);

    cube.userData.physicsBody = cubeBody;
    rigidBodies.push(cube);
  }

  return { scene, rigidBodies, puzzleHoles };
}
