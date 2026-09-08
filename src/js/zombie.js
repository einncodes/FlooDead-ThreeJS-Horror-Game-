import * as THREE from 'three';

export function setupZombie({ scene, camera, loader, zombieWallBoxes, damageOverlay, gameOver }) {
  let zombie = null;
  let zombie2 = null;
  let mixer = null;
  let gltf = null;

  let isZombieMoving = true;
  let zombieState = 'patrolling';
  let zombieMoveSpeedMultiplier = 1;
  let zombieStuckTimer = 0;
  let zombieLastPosition = new THREE.Vector3();
  const STUCK_THRESHOLD = 10;

  const minX = -40, maxX = 40;
  const minZ = -40, maxZ = 40;
  let currentTarget = new THREE.Vector3();
  let isMovingToTarget = false;
  const wanderDistance = 50;

  let lastAttackTime = 0;
  const attackCooldown = 1.5;

  const zombieSound1 = new Audio('/sounds/Snake Hiss _ Sound Effect(MP3_160K).mp3');
  zombieSound1.loop = true;

  const zombieSound2 = new Audio('/sounds/Snake (Hiss) - Sound Effect _ ProSounds(MP3_160K).mp3');
  zombieSound2.loop = true;

  const attackSound = new Audio('/sounds/Snake (Hiss) - Sound Effect _ ProSounds(MP3_160K).mp3');
  attackSound.volume = 1;
  attackSound.playbackRate = 2;

  function triggerRedFlicker() {
    if (!damageOverlay) return;

    let flickerCount = 0;
    const maxFlickers = 5;

    const interval = setInterval(() => {
      damageOverlay.style.opacity = damageOverlay.style.opacity === '0' ? '1' : '0';
      flickerCount++;

      if (flickerCount >= maxFlickers * 2) {
        clearInterval(interval);
        damageOverlay.style.opacity = '0';
      }
    }, 100);
  }

  function onZombieAttack() {
    if (!zombie) return;

    triggerRedFlicker();
    console.log('Player attacked by zombie!');
    attackSound.play().catch(() => {});

    zombie.rotation.x = 0;
    zombie.rotation.z = 0;

    const directionToCamera = new THREE.Vector3();
    directionToCamera.subVectors(camera.position, zombie.position).normalize();
    zombie.rotation.y = Math.atan2(directionToCamera.x, directionToCamera.z);

    const shakeDuration = 0.2;
    const shakeMagnitude = 0.1;
    const originalCameraPosition = camera.position.clone();
    const originalFOV = camera.fov;

    const zoomDuration = 0.2;
    const zoomMagnitude = 30;
    camera.fov = zoomMagnitude;
    camera.updateProjectionMatrix();

    let shakeTime = 0;
    let zoomTime = 0;

    function shakeCamera() {
      if (shakeTime < shakeDuration) {
        camera.position.x = originalCameraPosition.x + (Math.random() - 0.5) * shakeMagnitude;
        camera.position.y = originalCameraPosition.y + (Math.random() - 0.5) * shakeMagnitude;
        camera.position.z = originalCameraPosition.z + (Math.random() - 0.5) * shakeMagnitude;
        shakeTime += 0.016;
        requestAnimationFrame(shakeCamera);
      } else {
        camera.position.copy(originalCameraPosition);
      }
    }

    function zoomCamera() {
      if (zoomTime < zoomDuration) {
        camera.fov = THREE.MathUtils.lerp(camera.fov, originalFOV, zoomTime / zoomDuration);
        camera.updateProjectionMatrix();
        zoomTime += 0.016;
        requestAnimationFrame(zoomCamera);
      } else {
        camera.fov = originalFOV;
        camera.updateProjectionMatrix();
      }
    }

    shakeCamera();
    zoomCamera();

    setTimeout(() => gameOver(), 550);
  }

  function isPlayerLookingAtZombie({ fovCos = Math.cos(THREE.MathUtils.degToRad(35)), maxDistance = 50 } = {}) {
    if (!zombie) return false;

    const toZombie = new THREE.Vector3().subVectors(zombie.position, camera.position);
    const dist = toZombie.length();
    if (dist === 0) return true;
    if (dist > maxDistance) return false;

    toZombie.normalize();
    const camForward = new THREE.Vector3();
    camera.getWorldDirection(camForward);
    return camForward.dot(toZombie) >= fovCos;
  }

  function patrolRandomly() {
    if (!zombie) return;

    if (!isMovingToTarget) {
      currentTarget.set(
        Math.random() * (maxX - minX) + minX,
        0,
        Math.random() * (maxZ - minZ) + minZ
      );
      isMovingToTarget = true;
    }

    const distanceToTarget = zombie.position.distanceTo(currentTarget);

    if (distanceToTarget < 1) {
      isMovingToTarget = false;
    } else {
      const direction = new THREE.Vector3().subVectors(currentTarget, zombie.position).normalize();
      zombie.rotation.y = Math.atan2(direction.x, direction.z);

      const previousPosition = zombie.position.clone();
      zombie.position.addScaledVector(direction, 0.04);

      const zombieBox = new THREE.Box3().setFromCenterAndSize(
        zombie.position,
        new THREE.Vector3(2, 4, 2)
      );

      if (zombieWallBoxes.some(wallBox => zombieBox.intersectsBox(wallBox))) {
        zombie.position.copy(previousPosition);
        isMovingToTarget = false;
      }
    }

    if (Math.random() < 0.04) {
      zombie.rotation.y += (Math.random() - 0.5) * Math.PI / 4;
    }
  }

  function stalkPlayer(direction, distanceToPlayer) {
    if (!zombie || isPlayerLookingAtZombie()) return;

    const previousPosition = zombie.position.clone();
    zombie.position.addScaledVector(direction, 0.090 * zombieMoveSpeedMultiplier);

    const zombieBox = new THREE.Box3().setFromCenterAndSize(
      zombie.position,
      new THREE.Vector3(2, 4, 2)
    );

    if (zombieWallBoxes.some(wallBox => zombieBox.intersectsBox(wallBox))) {
      zombie.position.copy(previousPosition);
    }

    zombie.rotation.y = Math.atan2(direction.x, direction.z);
    zombie.rotation.x = 0;
    zombie.rotation.z = 0;
    zombie.position.y = 3;

    const volume = THREE.MathUtils.clamp(0.3 - distanceToPlayer / 80, 0, 0.3);
    zombieSound1.volume = volume;
    zombieSound2.volume = volume;
    if (zombieSound1.paused) zombieSound1.play().catch(() => {});
    if (zombieSound2.paused) zombieSound2.play().catch(() => {});
  }

  function chasePlayer(direction, distanceToPlayer) {
    if (!zombie) return;

    let speed = 0.04;
    if (distanceToPlayer < 15) speed = 0.07;
    if (distanceToPlayer < 8) speed = 0.11;
    speed *= zombieMoveSpeedMultiplier;

    const previousPosition = zombie.position.clone();
    zombie.position.addScaledVector(direction, speed);

    const zombieBox = new THREE.Box3().setFromCenterAndSize(
      zombie.position,
      new THREE.Vector3(2, 4, 2)
    );

    if (zombieWallBoxes.some(wallBox => zombieBox.intersectsBox(wallBox))) {
      zombie.position.copy(previousPosition);
    }

    zombie.lookAt(camera.position);
    zombie.rotation.x = 0;
    zombie.rotation.z = 0;
    zombie.position.y = 7;

    const volume = THREE.MathUtils.clamp(1 - distanceToPlayer / 26, 0, 1);
    zombieSound1.volume = volume;
    zombieSound2.volume = volume;

    if (distanceToPlayer <= 26) {
      if (zombieSound1.paused) zombieSound1.play().catch(() => {});
      if (zombieSound2.paused) zombieSound2.play().catch(() => {});
    } else {
      zombieSound1.pause();
      zombieSound2.pause();
    }
  }

  function wanderRandomly() {
    if (!zombie) return;

    if (!isMovingToTarget) {
      currentTarget.set(
        Math.random() * (maxX - minX) + minX,
        0,
        Math.random() * (maxZ - minZ) + minZ
      );
      isMovingToTarget = true;
    }

    const distanceToTarget = zombie.position.distanceTo(currentTarget);
    if (distanceToTarget < 1) {
      isMovingToTarget = false;
      return;
    }

    const direction = new THREE.Vector3().subVectors(currentTarget, zombie.position).normalize();
    zombie.rotation.y = Math.atan2(direction.x, direction.z);
    zombie.position.addScaledVector(direction, 0.05);

    if (Math.random() < 0.04) {
      zombie.rotation.y += (Math.random() - 0.5) * Math.PI / 4;
    }
  }

  function update(delta) {
    if (!zombie) return;

    if (isPlayerLookingAtZombie()) {
      if (mixer) mixer.timeScale = 0;
      console.log(`[ZOMBIE] FROZEN — player is looking | dist: ${camera.position.distanceTo(zombie.position).toFixed(2)}`);
      return;
    }

    const distanceMoved = zombie.position.distanceTo(zombieLastPosition);
    zombieStuckTimer = distanceMoved < 0.3 ? zombieStuckTimer + delta : 0;
    zombieLastPosition.copy(zombie.position);

    if (zombieStuckTimer >= STUCK_THRESHOLD) {
      console.log('[ZOMBIE] STUCK 10s — resetting position');
      zombie.position.set(Math.random() * 40 - 20, 5, Math.random() * 40 - 20);
      zombieStuckTimer = 0;
      zombieState = 'patrolling';
      isMovingToTarget = false;
      return;
    }

    if (mixer) {
      mixer.timeScale = 0.7;
      mixer.update(delta);
    }

    const playerPosition = camera.position;
    const distanceToPlayer = playerPosition.distanceTo(zombie.position);
    const direction = new THREE.Vector3().subVectors(playerPosition, zombie.position).normalize();

    switch (zombieState) {
      case 'patrolling':
        patrolRandomly();
        if (distanceToPlayer < 32) zombieState = 'stalking';
        break;

      case 'stalking':
        stalkPlayer(direction, distanceToPlayer);
        zombie.position.y = -0.6;
        if (distanceToPlayer < 10) {
          zombieState = 'chasing';
        } else if (distanceToPlayer > 33) {
          zombieState = 'patrolling';
          isMovingToTarget = false;
        }
        break;

      case 'chasing':
        chasePlayer(direction, distanceToPlayer);
        zombie.position.y = -0.6;
        if (distanceToPlayer < 7) {
          zombieState = 'attacking';
        } else if (distanceToPlayer > 20) {
          zombieState = 'stalking';
        }
        break;

      case 'attacking': {
        const now = performance.now() / 1000;
        if (now - lastAttackTime > attackCooldown) {
          onZombieAttack();
          lastAttackTime = now;
        }
        if (distanceToPlayer > 5) {
          zombieState = 'chasing';
          if (damageOverlay) damageOverlay.style.opacity = '0';
        }
        break;
      }

      case 'wandering':
        wanderRandomly();
        if (distanceToPlayer < wanderDistance) zombieState = 'chasing';
        break;
    }
  }

  function loadZombieModel(path, scale, position, animSpeed = 1, moveSpeedMultiplier = 1, onLoaded) {
    loader.load(path, (loadedGltf) => {
      gltf = loadedGltf;
      const newZombie = loadedGltf.scene;
      newZombie.scale.set(...scale);
      newZombie.position.copy(position || new THREE.Vector3(0, 5, 0));
      newZombie.castShadow = true;
      newZombie.receiveShadow = true;

      newZombie.traverse((child) => {
        if (child.isMesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            metalness: 0.2,
            roughness: 0.6,
            side: THREE.DoubleSide
          });
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      if (mixer) mixer.stopAllAction();
      if (zombie) scene.remove(zombie);

      zombie = newZombie;
      scene.add(zombie);
      zombieMoveSpeedMultiplier = moveSpeedMultiplier;

      mixer = new THREE.AnimationMixer(zombie);
      loadedGltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
        action.timeScale = animSpeed;
      });

      zombieLastPosition.copy(zombie.position);
      if (onLoaded) onLoaded();
    });
  }

  loadZombieModel(
    '/images/models/exaggerated_female_walk.glb',
    [4, 5, 3],
    new THREE.Vector3(0, 5, 0),
    1.5,
    1.0,
    () => {
      console.log('Female zombie loaded! Starting 20s timer...');

      setTimeout(() => {
        if (!zombie) return;
        const savedPosition = zombie.position.clone();

        loadZombieModel(
          '/images/models/Running Crawl.fbx.glb',
          [0.090, 0.090, 0.090],
          savedPosition,
          3.5,
          2.0,
          null
        );
      }, 20000);
    }
  );

  function restart() {
    if (!zombie) return;

    zombie.position.set(0, 0, 0);
    zombieState = 'patrolling';
    isZombieMoving = true;
    isMovingToTarget = false;
    zombieStuckTimer = 0;
    lastAttackTime = 0;
    zombieLastPosition.copy(zombie.position);

    if (damageOverlay) damageOverlay.style.opacity = '0';

    if (mixer && gltf) {
      mixer.stopAllAction();
      gltf.animations.forEach((clip) => mixer.clipAction(clip).play());
    }
  }

  return { update, restart };
}
