import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const sphereTexture = textureLoader.load('Designer (44).jpeg'); // Replace with your sphere image path
const panoramaTextures = [
  textureLoader.load('Designer (7).jpeg'),
  textureLoader.load(' Screenshot 2024-09-15 020915.png'),
  textureLoader.load(' Screenshot 2024-09-15 020626.png'),
  textureLoader.load(' Screenshot 2024-09-15 021117.png'),
  textureLoader.load(' Screenshot 2024-09-15 020953.png'),
  textureLoader.load(' Screenshot 2024-09-15 020712.png')
]; // Add your 6 panorama textures

// Background texture
const backgroundTexture = textureLoader.load('Designer (25).jpeg'); // Replace with your background image path
scene.background = backgroundTexture;

/**
 * Sphere
 */
const geometry = new THREE.SphereGeometry(1, 32, 32); // Main sphere geometry
const material = new THREE.MeshBasicMaterial({ map: sphereTexture });
const sphereMesh = new THREE.Mesh(geometry, material);
scene.add(sphereMesh);

/**
 * Points and Lines
 */
const points = [
  new THREE.Vector3(0.7, 0.7, 0.7),
  new THREE.Vector3(-0.7, 0.7, 0.7),
  new THREE.Vector3(0.7, -0.7, 0.7),
  new THREE.Vector3(-0.7, -0.7, 0.7),
  new THREE.Vector3(0.7, 0.7, -0.7),
  new THREE.Vector3(-0.7, 0.7, -0.7)
];

points.forEach((point, index) => {
  const pointGeometry = new THREE.SphereGeometry(0.05, 16, 16); // Bigger sphere for point
  const pointMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 }); // Yellow color
  const pointMesh = new THREE.Mesh(pointGeometry, pointMaterial);
  pointMesh.position.copy(point);
  scene.add(pointMesh);

  // Line from the sphere's center to the point, longer line (10cm in world units)
  const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
  const lineGeometry = new THREE.BufferGeometry().setFromPoints([
    new THREE.Vector3(0, 0, 0),
    point.clone().multiplyScalar(1.1) // 10% longer than the point position
  ]);
  const line = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(line);

  pointMesh.userData.index = index; // Store the index to identify the point
});

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth * 0.75,  // 75% of the screen width
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth * 0.75;  // 75% of the screen width
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 2); // Move the camera back slightly
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Raycaster
 */
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

/**
 * Exit Button
 */
const exitButton = document.createElement('button');
exitButton.style.position = 'absolute';
exitButton.style.top = '10px';
exitButton.style.left = '10px'; // Changed to the left side
exitButton.style.padding = '10px 20px';
exitButton.style.backgroundColor = '#ff0000';
exitButton.style.color = '#ffffff';
exitButton.style.border = 'none';
exitButton.style.borderRadius = '5px';
exitButton.style.cursor = 'pointer';
exitButton.style.display = 'none';
exitButton.textContent = 'Exit';
document.body.appendChild(exitButton);

exitButton.addEventListener('click', () => {
  exitPanorama();
});

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Rotate the sphere
  sphereMesh.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();

/**
 * Mouse Events
 */
canvas.addEventListener('click', (event) => {
  mouse.x = (event.clientX / sizes.width) * 2 - 1;
  mouse.y = -(event.clientY / sizes.height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(scene.children.filter(obj => obj.type === 'Mesh' && obj.geometry.type === 'SphereGeometry' && obj.material.color.equals(new THREE.Color(0xffff00))));
  if (intersects.length > 0) {
    const pointIndex = intersects[0].object.userData.index;
    if (pointIndex !== undefined) {
      // Animate camera to zoom in
      const targetPosition = intersects[0].point.clone().normalize().multiplyScalar(0.7); // Adjust zoom level
      gsap.to(camera.position, {
        duration: 1,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        onComplete: () => {
          // Show the panorama for the clicked point
          showPanorama(pointIndex);
        }
      });
    }
  }
});

/**
 * Show 360-Degree Panorama
 */
function showPanorama(index) {
  // Hide the original sphere and yellow points
  sphereMesh.visible = false;
  scene.children.forEach(child => {
    if (child.material && child.material.color.equals(new THREE.Color(0xffff00))) {
      child.visible = false;
    }
  });

  // Add the panorama
  const panoramaGeometry = new THREE.SphereGeometry(5, 64, 64);
  const panoramaMaterial = new THREE.MeshBasicMaterial({
    map: panoramaTextures[index],
    side: THREE.DoubleSide
  });
  const panoramaMesh = new THREE.Mesh(panoramaGeometry, panoramaMaterial);
  scene.add(panoramaMesh);

  // Show the exit button
  exitButton.style.display = 'block';

  // Reset the camera position inside the panorama
  camera.position.set(0, 0, 0.1);
  controls.target.set(0, 0, 0);
  controls.update();
}

/**
 * Exit Panorama View
 */
function exitPanorama() {
  // Remove the panorama from the scene
  const panoramaMeshes = scene.children.filter(child => child instanceof THREE.Mesh && child.geometry.type === 'SphereGeometry' && child.material.map && child.material.map !== backgroundTexture);
  panoramaMeshes.forEach(mesh => scene.remove(mesh));

  // Reset scene background
  scene.background = backgroundTexture;

  // Show the original sphere and yellow points
  sphereMesh.visible = true;
  scene.add(sphereMesh);

  points.forEach((point, index) => {
    const pointMesh = new THREE.Mesh(
      new THREE.SphereGeometry(0.05, 16, 16),
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    pointMesh.position.copy(point);
    pointMesh.userData.index = index;
    scene.add(pointMesh);

    // Line from the sphere's center to the point
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffff00 });
    const lineGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      point.clone().multiplyScalar(1.1)
    ]);
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);
  });

  // Hide the exit button
  exitButton.style.display = 'none';

  // Reset camera position and controls
  camera.position.set(2, 2, 2);
  controls.target.set(0, 0, 0);
  controls.update();
}
