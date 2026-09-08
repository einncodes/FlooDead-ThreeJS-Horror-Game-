import * as THREE from 'three';
import TWEEN from '@tweenjs/tween.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { setupFlashlight } from './js/flashlight.js';
import { setupAudio } from './js/audio.js';
import { setupLighting } from './js/lighting.js';
import { setupEnvironment } from './js/environment.js';
import { setupCollision } from './js/collision.js';
import { setupFlood } from './js/flood.js';
import { setupZombie } from './js/zombie.js';
import { setupInteractions } from './js/interactions.js';
import { setupGameOver } from './js/gameOver.js';
import { setupPlayer } from './js/player.js';
import { setupUI } from './js/ui.js';
import { setupWorld } from './js/world.js';
// Player movement boundaries
const boundaryMinX = -50; // Minimum X boundary
const boundaryMaxX = 50;  // Maximum X boundary
const boundaryMinY = 0;   // Minimum Y boundary (ground level)
const boundaryMaxY = 10;  // Maximum Y boundary (height limit)
const boundaryMinZ = -50; // Minimum Z boundary
const boundaryMaxZ = 50;  // Maximum Z boundary




function checkPlayerBounds(playerPosition) {
  if (playerPosition.x < boundaryMinX || playerPosition.x > boundaryMaxX ||
      playerPosition.y < boundaryMinY || playerPosition.y > boundaryMaxY ||
      playerPosition.z < boundaryMinZ || playerPosition.z > boundaryMaxZ) {
    resetPlayerPosition();
  }
}

function resetPlayerPosition() {
  // Set the player's position to a safe location
  camera.position.set(39, -1,-21); // Example reset position
  console.log("You have been reset to a safe location!"); // Console message
}
//================================================================
// Scene Setup
//================================================================



const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff); // Default background color
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const audio = setupAudio(camera);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('webgl-container').appendChild(renderer.domElement);


const textureLoader = new THREE.TextureLoader();

const lightingSystem = setupLighting(scene, renderer);

//================================================================
// Sound Setup with Auto-Play Attempt
//================================================================
let audioContext;

document.addEventListener('click', function() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  // Resume the AudioContext if it's suspended
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }

  // Now you can safely start playing audio
  ui.playAudio();
});

// UI controls
const ui = setupUI();


//================================================================
// Wall Setup (Front, Back, Left, Right)
//================================================================


// Set camera position
camera.position.set(48, -26, 42);
//camera.position.set(-12, 14,41);
// Rotate camera to look downward (45 degrees downward)
camera.rotation.x = -Math.PI / 3; // Convert 45 degrees to radians (downward tilt)

// Rotate camera 30 degrees to the left (yaw rotation)
camera.rotation.y = -Math.PI / 20; // Convert 30 degrees to radians (left rotation)





const loader = new GLTFLoader();


const world = setupWorld({ scene, textureLoader });
const {
  frontWall, backWall, leftWall, rightWall,
  floor, alternateFloor, LEFT1Floor, topFloor, ceiling1,
  carpet, RWSP, LWSP, TSP, ENT1, ENT2, ENT22,
  texturedPasswordDoor, door
} = world;











// Game over system
let zombieSystem;
const gameOverSystem = setupGameOver({
  onRestart: () => {
    zombieSystem.restart();
    camera.position.set(0, 14, 24);
  }
});
const gameOver = () => gameOverSystem.trigger();

// Flood / water system
const flood = setupFlood(scene, loader, textureLoader, () => {
  gameOverSystem.trigger();
});


////////////////////////////////////////////////////////////////////////////////////////
//OBJECTS/TREASURES



// Load the texture


































//================================================================
// Character (Zombie) Setup
//================================================================

//================================================================
// Candle Setup and Interactions
//================================================================

let lightObject;

let pointLight; // For candle-like light

let candleMixer;
// Load the .glb model for the candle
loader.load(
  './images/models/flashlight_electricity_lamp_the_light.glb',
  function (gltf) {
    lightObject = gltf.scene;

    // ── Wrap in a group so camera's bounding box stays clean ──
    const flashlightHolder = new THREE.Group();
    camera.add(flashlightHolder);

    lightObject.position.set(0, 0, 9.5);
    lightObject.scale.set(0.01, 0.01, 0.01);
    lightObject.rotation.x = Math.PI / -2;

    // ── Put every mesh on layer 1 so it renders on top ──
    lightObject.traverse((child) => {
      if (child.isMesh) {
  child.material = child.material.clone();

    child.material.map = null;
    child.material.emissiveMap = null;

    
    child.material.emissive.set(0x32CD32);
    child.material.emissiveIntensity = 0.3;

    child.material.needsUpdate = true;
        child.layers.set(1);           // separate layer
        child.renderOrder = 999;       // always draw last (on top)
        child.material = child.material.clone();
        child.material.depthTest = false;   // never hidden behind walls
        child.material.depthWrite = false;
        child.raycast = () => {};      // disable collision raycasting
      }
    });

    flashlightHolder.add(lightObject);

    // ── Point light stays on default layer ──
    pointLight = new THREE.PointLight(0xff0000, 1, 10);
    pointLight.position.set(0, 0, -1);
    // NO scale.set() on lights — it does nothing and inflates bounding box
    flashlightHolder.add(pointLight);

    // ── Tell camera to also render layer 1 ──
    camera.layers.enable(1);

    // ── Start hidden ──
    lightObject.visible = false;
    pointLight.visible = false;

    // ── Flashlight controls ──
    setupFlashlight(lightObject, pointLight);

if (gltf.animations && gltf.animations.length) {
      candleMixer = new THREE.AnimationMixer(lightObject);
      gltf.animations.forEach((clip) => {
        candleMixer.clipAction(clip).play();
      });
    }
  },
  undefined,
  function (error) {
    console.error('An error occurred while loading the model:', error);
  }
);




















// Array to hold model bounding boxes
const modelBoundingBoxes = [];
const models = [];  // List to hold models once they are loaded


setupEnvironment({ scene, camera, loader, models, modelBoundingBoxes });



const wallBoundingBoxes = [];


const walls = [frontWall, backWall, leftWall, rightWall, 
    floor , alternateFloor, LEFT1Floor , topFloor , ceiling1
    , carpet , RWSP , LWSP , TSP , ENT1 , ENT2 , texturedPasswordDoor
    , door , ENT22
];

walls.forEach(wall => {
    const box = new THREE.Box3().setFromObject(wall);
    wallBoundingBoxes.push(box);
});

// ✅ Zombie only collides with actual vertical walls, NOT floor/ceiling
const zombieWallBoxes = [];
const zombieWalls = [frontWall, backWall, leftWall, rightWall,
    alternateFloor, LEFT1Floor, RWSP, LWSP, ENT1, ENT2, ENT22,
    texturedPasswordDoor, door
];
zombieWalls.forEach(wall => {
    const box = new THREE.Box3().setFromObject(wall);
    zombieWallBoxes.push(box);
});

const collisionSystem = setupCollision({
  camera,
  wallBoundingBoxes,
  modelBoundingBoxes
});

const controls = setupPlayer(camera, scene, collisionSystem, audio);

zombieSystem = setupZombie({
  scene,
  camera,
  loader,
  zombieWallBoxes,
  damageOverlay: document.getElementById('damage-overlay'),
  gameOver
});

const interactionSystem = setupInteractions({
  scene,
  camera,
  loader,
  textureLoader,
  wallBoundingBoxes,
  door,
  texturedPasswordDoor
});





const clock = new THREE.Clock();

function animate() {
  if (gameOverSystem.isGameOver) return; // Stop everything if the game is over
  requestAnimationFrame(animate);

  collisionSystem.checkCameraCollision();
  TWEEN.update();  // Ensure TWEEN animations are updated in the loop

  
  
  const delta = clock.getDelta(); // Get time delta for smooth movement
/*
  if (walkingMixer) walkingMixer.update(delta); // Update the new animation mixer

  // Update the model's position to match the camera's position
  if (walkingModel) {
      walkingModel.position.set(camera.position.x, camera.position.y - .5, camera.position.z); // Adjust Y to show feet
  }
      */

  if (candleMixer) {
    candleMixer.update(delta); // Update the candle animation
}
  
  // Update FPS controls
  if (controls.pointerLockControls.isLocked) {
      controls.update(delta);
  }

 // Check player bounds
 checkPlayerBounds(camera.position); // Check the camera's position (player's position)

  zombieSystem.update(delta); // Update zombie AI


  // Update flood / water system
  flood.update(delta);

  const playerPosition = camera.position;

  interactionSystem.update(playerPosition);

  renderer.render(scene, camera);
}

animate();
