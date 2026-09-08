import * as THREE from 'three';

export function setupCollision({ camera, wallBoundingBoxes, modelBoundingBoxes }) {
  const playerSize = new THREE.Vector3(1, 1.8, 1);

  function createPlayerBox(position) {
    return new THREE.Box3().setFromCenterAndSize(position, playerSize);
  }

  // Preserves the original movement collision behavior:
  // check the player's current body box against wall boxes and, on collision,
  // revert the current velocity step and stop the velocity.
  function resolveWallCollision(position, velocity, delta) {
    const characterBox = createPlayerBox(position);

    for (const wallBox of wallBoundingBoxes) {
      if (characterBox.intersectsBox(wallBox)) {
        position.sub(velocity.clone().multiplyScalar(delta));
        velocity.set(0, 0, 0);
        return true;
      }
    }

    return false;
  }

  // Collision against environment-model bounding boxes.
  // This preserves the original small push-back behavior.
  function checkCameraCollision() {
    const cameraBox = createPlayerBox(camera.position);

    for (const modelBox of modelBoundingBoxes) {
      if (cameraBox.intersectsBox(modelBox)) {
        const collisionNormal = new THREE.Vector3()
          .subVectors(camera.position, modelBox.getCenter(new THREE.Vector3()))
          .normalize();

        camera.position.add(collisionNormal.multiplyScalar(0.2));
        camera.position.add(collisionNormal.multiplyScalar(0.1));
      }
    }
  }

  return {
    createPlayerBox,
    resolveWallCollision,
    checkCameraCollision
  };
}
