import * as THREE from 'three';

export function setupWorld({ scene, textureLoader }) {

// Front Wall
const frontWallTexture = textureLoader.load('/images/texture/tile.jpg'); // Front wall texture
frontWallTexture.wrapS = THREE.RepeatWrapping;
frontWallTexture.wrapT = THREE.RepeatWrapping;
frontWallTexture.repeat.set(30, 10); // Scale texture to fit

const frontWallMaterial = new THREE.MeshStandardMaterial({ 
    map: frontWallTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5 // Optional: for added shininess
});
const frontWall = new THREE.Mesh(new THREE.BoxGeometry(100, 40, 1), frontWallMaterial);
frontWall.position.z = -50;
frontWall.castShadow = false;
frontWall.receiveShadow = true;
scene.add(frontWall);

// Back Wall
const backWallTexture = textureLoader.load('/images/texture/tile.jpg'); // Back wall texture
backWallTexture.wrapS = THREE.RepeatWrapping;
backWallTexture.wrapT = THREE.RepeatWrapping;
backWallTexture.repeat.set(30, 10); // Adjust the repeat scale

const backWallMaterial = new THREE.MeshStandardMaterial({ 
    map: backWallTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const backWall = new THREE.Mesh(new THREE.BoxGeometry(100, 40, 1), backWallMaterial);
backWall.position.z = 50;
backWall.castShadow = false;
backWall.receiveShadow = true;
scene.add(backWall);

// Left Wall
const leftWallTexture = textureLoader.load('/images/texture/tile.jpg'); // Left wall texture
leftWallTexture.wrapS = THREE.RepeatWrapping;
leftWallTexture.wrapT = THREE.RepeatWrapping;
leftWallTexture.repeat.set(30, 10); // Adjust the repeat scale

const leftWallMaterial = new THREE.MeshStandardMaterial({ 
    map: leftWallTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const leftWall = new THREE.Mesh(new THREE.BoxGeometry(1, 40, 100), leftWallMaterial);
leftWall.position.set(-52, 2, -1);
leftWall.scale.set(1, 2, 0.6);

leftWall.castShadow = false;
leftWall.receiveShadow = true;
scene.add(leftWall);

// Left Wall 1
const left1WallTexture = textureLoader.load('/images/texture/tile.jpg'); // Left wall texture
left1WallTexture.wrapS = THREE.RepeatWrapping;
left1WallTexture.wrapT = THREE.RepeatWrapping;
left1WallTexture.repeat.set(30, 10); // Adjust the repeat scale

const left1WallMaterial = new THREE.MeshStandardMaterial({ 
    map: left1WallTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const left1Wall = new THREE.Mesh(new THREE.BoxGeometry(1, 40, 100), left1WallMaterial);
left1Wall.scale.set(8, 0.3, 0.3);
left1Wall.position.set(-44, 20, 35);

left1Wall.castShadow = false;
left1Wall.receiveShadow = true;
scene.add(left1Wall);

// Right Wall
const rightWallTexture = textureLoader.load('/images/texture/tile.jpg'); // Right wall texture
rightWallTexture.wrapS = THREE.RepeatWrapping;
rightWallTexture.wrapT = THREE.RepeatWrapping;
rightWallTexture.repeat.set(30, 10); // Adjust the repeat scale

const rightWallMaterial = new THREE.MeshStandardMaterial({ 
    map: rightWallTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const rightWall = new THREE.Mesh(new THREE.BoxGeometry(1, 40, 100), rightWallMaterial);
rightWall.position.x = 50;
rightWall.castShadow = false;
rightWall.receiveShadow = true;
scene.add(rightWall);

//================================================================
// Ceiling and Floor Setup
//================================================================

// Ceiling
const ceilingTexture2 = textureLoader.load('/images/texture/tile.jpg'); // Ceiling texture
ceilingTexture2.wrapS = THREE.RepeatWrapping;
ceilingTexture2.wrapT = THREE.RepeatWrapping;
ceilingTexture2.repeat.set(30, 10); // Adjust the repeat scale

const ceilingMaterial = new THREE.MeshStandardMaterial({ 
    map: ceilingTexture2,
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), ceilingMaterial);
ceiling.rotation.x = Math.PI / 2;
ceiling.position.y = 22; // Place it above the floor
ceiling.receiveShadow = true;
scene.add(ceiling);

// Floor
const floorTexture = textureLoader.load('/images/texture/tile.jpg'); // Floor texture (same texture as ceiling)
floorTexture.wrapS = THREE.RepeatWrapping;
floorTexture.wrapT = THREE.RepeatWrapping;
floorTexture.repeat.set(30, 10); // Adjust the repeat scale

const floorMaterial = new THREE.MeshStandardMaterial({ 
    map: floorTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
let floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), floorMaterial);
floor.rotation.x = Math.PI / -2; // Rotate to make it horizontal
floor.position.y = 0; // Place it on the ground
floor.receiveShadow = true;
scene.add(floor);




/*

// New Floor (Renamed to alternateFloor to avoid confusion)
const NORMALLTexture = textureLoader.load(''); // Same texture as floor
NORMALLTexture.wrapS = THREE.RepeatWrapping;
NORMALLTexture.wrapT = THREE.RepeatWrapping;
NORMALLTexture.repeat.set(30, 10); // Adjust the repeat scale

const NORMALLTextureFloorMaterial = new THREE.MeshStandardMaterial({ 
    map: NORMALLTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const NORMAL = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), NORMALLTextureFloorMaterial);
NORMAL.receiveShadow = true;
scene.add(NORMAL);

*/





// New Floor (Renamed to alternateFloor to avoid confusion)
const alternateFloorTexture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
alternateFloorTexture.wrapS = THREE.RepeatWrapping;
alternateFloorTexture.wrapT = THREE.RepeatWrapping;
alternateFloorTexture.repeat.set(30, 10); // Adjust the repeat scale

const alternateFloorMaterial = new THREE.MeshStandardMaterial({ 
    map: alternateFloorTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const alternateFloor = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), alternateFloorMaterial);
alternateFloor.rotation.y = Math.PI / 2; // Rotate to make it horizontal
alternateFloor.position.set(33, 2, 25.3); // Set position
                    //nipis     //width    //heigh
alternateFloor.scale.set(0.040,         1,          22); // Shrink width to create space for the door
alternateFloor.receiveShadow = true;
scene.add(alternateFloor);


//left

const LEFT1Texture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
LEFT1Texture .wrapS = THREE.RepeatWrapping;
LEFT1Texture .wrapT = THREE.RepeatWrapping;
LEFT1Texture .repeat.set(30, 10); // Adjust the repeat scale

const LEFT1TextureMaterial = new THREE.MeshStandardMaterial({ 
    map: LEFT1Texture , 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const LEFT1Floor = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), LEFT1TextureMaterial);
LEFT1Floor.rotation.y = Math.PI / 2; // Rotate to make it horizontal
LEFT1Floor.position.set(24, 2, 50); // Set position
                    //nipis     //width    //heigh
LEFT1Floor.scale.set(0.1, 0.5, 2); // Shrink width to create space for the door
LEFT1Floor.receiveShadow = true;
scene.add(LEFT1Floor);


//top
const topTexture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
topTexture .wrapS = THREE.RepeatWrapping;
topTexture .wrapT = THREE.RepeatWrapping;
topTexture .repeat.set(30, 10); // Adjust the repeat scale

const top1TextureMaterial = new THREE.MeshStandardMaterial({ 
    map: topTexture , 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const topFloor = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), top1TextureMaterial);
topFloor.rotation.y = Math.PI / 2; // Rotate to make it horizontal
topFloor.position.set(24, 16, 45); // Set position
                    //nipis     //width    //heigh
                    topFloor.scale.set(0.3, 0.4, 2); // Shrink width to create space for the door
                    topFloor.receiveShadow = true;
scene.add(topFloor);

//ceiling room
const ceilingTexture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
ceilingTexture .wrapS = THREE.RepeatWrapping;
ceilingTexture .wrapT = THREE.RepeatWrapping;
ceilingTexture .repeat.set(30, 10); // Adjust the repeat scale

const ceilingTextureMaterial = new THREE.MeshStandardMaterial({ 
    map: ceilingTexture , 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const ceiling1 = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), ceilingTextureMaterial);
ceiling1.rotation.x = Math.PI / 2; // Rotate to make it horizontal
ceiling1.position.set(42, 13.4, 45); // Set position
                    //nipis     //width    //heigh
                    ceiling1.scale.set(0.8, 1, 0.5); // Shrink width to create space for the door
                    ceiling1.receiveShadow = true;
scene.add(ceiling1);

//carpet

const carpetTexture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
carpetTexture .wrapS = THREE.RepeatWrapping;
carpetTexture .wrapT = THREE.RepeatWrapping;
carpetTexture .repeat.set(30, 10); // Adjust the repeat scale

const carpetTextureTextureMaterial = new THREE.MeshStandardMaterial({ 
    map: carpetTexture , 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const carpet = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), carpetTextureTextureMaterial);
carpet.rotation.x = Math.PI / 2; // Rotate to make it horizontal
carpet.position.set(37, -0, 35); // Set position
                    //nipis     //width    //heigh
                    carpet.scale.set(0.4, 0.5, 0.2); // Shrink width to create space for the door
                    carpet.receiveShadow = true;
scene.add(carpet);

//OFFICE AREA-------------------------------------------------------------------

//right wall second path
const RWSPTexture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
RWSPTexture .wrapS = THREE.RepeatWrapping;
RWSPTexture .wrapT = THREE.RepeatWrapping;
RWSPTexture .repeat.set(30, 10); // Adjust the repeat scale

const RWSPTextureTextureMaterial = new THREE.MeshStandardMaterial({ 
    map: RWSPTexture , 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const RWSP = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), RWSPTextureTextureMaterial);
RWSP.rotation.y = Math.PI / 2; // Rotate to make it horizontal
RWSP.position.set(24, 2, 17); // Set position
                    //nipis     //width    //heigh
                    RWSP.scale.set(1.2, 1, 2); // Shrink width to create space for the door
                    RWSP.receiveShadow = true;
scene.add(RWSP);

//left wall second path
const LWSPTexture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
LWSPTexture .wrapS = THREE.RepeatWrapping;
LWSPTexture .wrapT = THREE.RepeatWrapping;
LWSPTexture .repeat.set(30, 10); // Adjust the repeat scale

const LWSPTextureTextureMaterial = new THREE.MeshStandardMaterial({ 
    map: LWSPTexture , 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const LWSP = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), LWSPTextureTextureMaterial);
LWSP.rotation.y = Math.PI / 2; // Rotate to make it horizontal
LWSP.position.set(24, 2, -24); // Set position
                    //nipis     //width    //heigh
                    LWSP.scale.set(0.5, 1, 2); // Shrink width to create space for the door
                    LWSP.receiveShadow = true;
scene.add(LWSP);


//top second path

const TSPTexture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
TSPTexture.wrapS = THREE.RepeatWrapping;
TSPTexture.wrapT = THREE.RepeatWrapping;
TSPTexture.repeat.set(5, 5); // Adjust the repeat scale

const TSPTextureMaterial = new THREE.MeshStandardMaterial({ 
    map: TSPTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const TSP = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), TSPTextureMaterial);
TSP.rotation.y = Math.PI / 2; // Rotate to make it horizontal
TSP.position.set(24, 18, -11); // Set position
TSP.scale.set(2, 0.4, 2); // Shrink width to create space for the door
TSP.receiveShadow = true;
scene.add(TSP);



//entrance wall

const ENT1Texture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
ENT1Texture .wrapS = THREE.RepeatWrapping;
ENT1Texture .wrapT = THREE.RepeatWrapping;
ENT1Texture .repeat.set(30, 10); // Adjust the repeat scale

const ENT1TextureMaterial = new THREE.MeshStandardMaterial({ 
    map: ENT1Texture , 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const ENT1 = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), ENT1TextureMaterial);

ENT1.position.set(35, 2, 23.6); // Set position
                    //nipis     //width    //heigh
                    ENT1.scale.set(0.653, 2, 2); // Shrink width to create space for the door
                    TSP.receiveShadow = true;
scene.add(ENT1);


//entrance wall 2

const ENT2Texture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
ENT2Texture .wrapS = THREE.RepeatWrapping;
ENT2Texture .wrapT = THREE.RepeatWrapping;
ENT2Texture .repeat.set(30, 10); // Adjust the repeat scale

const ENT2TextureMaterial = new THREE.MeshStandardMaterial({ 
    map: ENT2Texture , 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const ENT2 = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), ENT2TextureMaterial);

ENT2.position.set(-36, 2, -30); // Set position
                    //nipis     //width    //heigh
                    ENT2.scale.set(3, 1, 2); // Shrink width to create space for the door
                    ENT2.receiveShadow = true;
scene.add(ENT2);


const ENT22Texture = textureLoader.load('/images/texture/tile.jpg'); // Same texture as floor
ENT22Texture .wrapS = THREE.RepeatWrapping;
ENT22Texture .wrapT = THREE.RepeatWrapping;
ENT22Texture .repeat.set(30, 10); // Adjust the repeat scale

const ENT22TextureMaterial = new THREE.MeshStandardMaterial({ 
    map: ENT22Texture , 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});
const ENT22 = new THREE.Mesh(new THREE.BoxGeometry(40, 35, 1), ENT2TextureMaterial);

ENT22.position.set(-36, 2, -50); // Set position
                    //nipis     //width    //heigh
                    ENT22.scale.set(3, 1, 2); // Shrink width to create space for the door
                    ENT22.receiveShadow = true;
scene.add(ENT22);
const mapTexture = textureLoader.load('/map.png'); // Left wall texture
mapTexture.wrapS = THREE.RepeatWrapping;
mapTexture.wrapT = THREE.RepeatWrapping;
mapTexture.repeat.set(1, 1); // Adjust the repeat scale

// Create the material
const mapMaterial = new THREE.MeshStandardMaterial({ 
    map: mapTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});

// Create the mesh
const mapWall = new THREE.Mesh(new THREE.BoxGeometry(1, 40, 100), mapMaterial);
mapWall.scale.set(.12,.17,.12);
mapWall.position.set(23, 7,33.5);
// Enable shadows
mapWall.castShadow = true;
mapWall.receiveShadow = true;

// Add the mesh to the scene
scene.add(mapWall);





// Load the texture
const noteTexture = textureLoader.load('/map/fordoorcardpaper.png'); // Paper texture
noteTexture.wrapS = THREE.RepeatWrapping;
noteTexture.wrapT = THREE.RepeatWrapping;
noteTexture.repeat.set(1, 1); // Adjust the repeat scale

// Create the material
const noteMaterial = new THREE.MeshStandardMaterial({ 
    map: noteTexture, 
    side: THREE.DoubleSide, 
    roughness: 0, 
    metalness: 0.5
});

// Create the mesh
const noteWall = new THREE.Mesh(new THREE.BoxGeometry(1, 40, 100), noteMaterial);
noteWall.scale.set(0.050, 0.050, 0.020); // Scale to resemble paper size
noteWall.position.set(-13, 3.6, -27.4); // Slightly above the ground to avoid z-fighting

// Rotate the paper to lie flat, facing up
noteWall.rotation.x = Math.PI / 2; // Rotate 90 degrees on the X-axis to make it lie flat
noteWall.rotation.y = Math.PI / -2;


// Enable shadows
noteWall.castShadow = true;
noteWall.receiveShadow = true;

// Add the mesh to the scene
scene.add(noteWall);
const customDoorTexture = textureLoader.load('/images/texture/glass.jpg');  // Set your image path

// Set texture wrapping
customDoorTexture.wrapS = THREE.RepeatWrapping;  // Repeat the texture on the X-axis
customDoorTexture.wrapT = THREE.RepeatWrapping;  // Repeat the texture on the Y-axis

// Adjust the number of times the texture repeats
customDoorTexture.repeat.set(1, 1);  // Repeat the texture 1 time along X, 1 time along Y

// Create material with transparency and smoothness
const customDoorMaterial = new THREE.MeshStandardMaterial({
  map: customDoorTexture,        // Apply the texture
  transparent: true,             // Enable transparency
  opacity: 0.7,                  // Set semi-transparency (adjust 0 to 1 for desired effect)
  roughness: 0,                  // Make the material completely smooth
  side: THREE.DoubleSide         // Apply the texture to both sides
});

// Define geometry for the door
const customDoorGeometry = new THREE.BoxGeometry(1, 3, 0.2); // Width, height, depth of the door

// Create the door mesh
const texturedPasswordDoor = new THREE.Mesh(customDoorGeometry, customDoorMaterial);

// Position and scale the door
texturedPasswordDoor.position.set(23, 7, -42); // Same position as the original door
texturedPasswordDoor.rotation.y = Math.PI / 2;
texturedPasswordDoor.scale.set(16, 6, 4);  // Example scale (width, height, depth)

// Add the door to the scene
scene.add(texturedPasswordDoor);
const doorTexture = textureLoader.load('/images/texture/moderndoor.jpg');
doorTexture.wrapS = THREE.RepeatWrapping;
doorTexture.wrapT = THREE.RepeatWrapping;
doorTexture.repeat.set(1, 1);

const doorMaterial = new THREE.MeshStandardMaterial({
    map: doorTexture,
    side: THREE.DoubleSide
});

const doorGeometry = new THREE.BoxGeometry(3, 6, 0.2);
const door = new THREE.Mesh(doorGeometry, doorMaterial);
door.position.set(24, 4, 44);
door.rotation.y = Math.PI / -2;
door.scale.set(3, 2, 7);
scene.add(door);

  return {
    frontWall, backWall, leftWall, rightWall,
    floor, alternateFloor, LEFT1Floor, topFloor, ceiling1,
    carpet, RWSP, LWSP, TSP, ENT1, ENT2, ENT22,
    texturedPasswordDoor, door, mapWall, noteWall
  };
}
