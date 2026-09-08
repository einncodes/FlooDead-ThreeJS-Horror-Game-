import * as THREE from 'three';

export function setupAudio(camera) {
  const listener = new THREE.AudioListener();
  camera.add(listener);

  const walkSound = new THREE.Audio(listener);
  const secondWalkSound = new THREE.Audio(listener);

  const audioLoader = new THREE.AudioLoader();

  // Walking on tile floor
  audioLoader.load(
    '/sounds/Sound Effects - Walking on Tile Floor.mp3',
    (buffer) => {
      walkSound.setBuffer(buffer);
      walkSound.setLoop(true);
      walkSound.setVolume(0.5);
    }
  );

  // Walking through water
  audioLoader.load(
    '/sounds/Walking Through Water Sound Effect.mp3',
    (buffer) => {
      secondWalkSound.setBuffer(buffer);
      secondWalkSound.setLoop(true);
      secondWalkSound.setVolume(0.5);
    }
  );

  return {
    listener,
    walkSound,
    secondWalkSound,
    audioLoader
  };
}