import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';

export function setupInteractions({
  scene,
  camera,
  loader,
  textureLoader,
  wallBoundingBoxes,
  door,
  texturedPasswordDoor
}) {
  let hasKey = false;
  let hasUsedKey = false;
  let doorOpen = false;
  let keyObject = null;
  let boundDoor = door;

  let passwordDevice = null;
  const correctPassword = '1532';
  let enteredPassword = '';
  let isInteracting = false;
  let interactionUI = null;
  let inputDiv = null;
  let deviceInteracted = false;
  let typingTimeout;

  const keyCollectSound = new Audio('/sounds/key.mp3');
  const doorOpenSound = new Audio('/sounds/Door.mp3');
  const wrongPasswordSound = new Audio('/sounds/Sound effect WRONG ANSWER.mp3');
  const correctPasswordSound = new Audio('/sounds/Correct answer Sound effect.mp3');
  const typingSound = new Audio('/sounds/enter button on a keyboard sound effect (royalty free).mp3');
  const deviceInteractionSound = new Audio('/sounds/90s PC boot sequence with sound HD.mp3');
  const doorOpenSound1 = new Audio('/sounds/Faction Vault Door Open (Fortnite Sound) - Sound Effect for editing.mp3');

  keyCollectSound.volume = 1.0;
  doorOpenSound.volume = 1.0;
  wrongPasswordSound.volume = 1.0;
  correctPasswordSound.volume = 1.0;
  typingSound.volume = 1.0;
  deviceInteractionSound.volume = 1.0;
  doorOpenSound1.volume = 1.0;

  // Load the key/card.
  loader.load('/images/models/metal_credit_card.glb', (gltf) => {
    keyObject = gltf.scene;
    keyObject.position.set(35, 4, 30);
    keyObject.scale.set(0.4, 0.4, 0.4);
    keyObject.rotation.x = Math.PI / 2;
    scene.add(keyObject);
  }, undefined, (error) => {
    console.error('Error loading key model:', error);
  });

  // Load the password device.
  loader.load('/images/models/simple_mini-atm.glb', (gltf) => {
    passwordDevice = gltf.scene;
    passwordDevice.scale.set(0.0030, 0.0030, 0.0030);
    passwordDevice.position.set(27, 6, -49.2);
    passwordDevice.rotation.y = Math.PI / -2;
    scene.add(passwordDevice);
    console.log('Green device manager loaded');
  }, undefined, (error) => {
    console.error('Error loading the GLTF model:', error);
  });

  // Interaction prompt UI.
  interactionUI = document.createElement('div');
  interactionUI.style.position = 'absolute';
  interactionUI.style.top = '10px';
  interactionUI.style.left = '50%';
  interactionUI.style.transform = 'translateX(-50%)';
  interactionUI.style.color = 'white';
  interactionUI.style.fontSize = '20px';
  interactionUI.style.fontFamily = 'Arial, sans-serif';
  interactionUI.innerHTML = '';
  document.body.appendChild(interactionUI);

  function showKeyCollectNote() {
    const note = document.getElementById('key-collect-note');
    if (note) note.style.display = 'block';
  }

  function hideKeyCollectNote() {
    const note = document.getElementById('key-collect-note');
    if (note) note.style.display = 'none';
  }

  function showDoorOpenNote() {
    const note = document.getElementById('door-open-note');
    if (note) note.style.display = 'block';
  }

  function hideDoorNote() {
    const note = document.getElementById('door-open-note');
    if (note) note.style.display = 'none';
  }

  function showNoKeyNote() {
    const note = document.getElementById('no-key-note');
    if (note) note.style.display = 'block';
  }

  function collectKey() {
    if (!keyObject) return;

    scene.remove(keyObject);
    camera.add(keyObject);
    keyObject.position.set(0.2, -0.5, -1);
    keyObject.scale.set(0.3, 0.4, 0.3);

    hasKey = true;
    hideKeyCollectNote();
    keyCollectSound.currentTime = 0;
    keyCollectSound.play().catch(() => {});

    const keyImageContainer = document.getElementById('key-image-container');
    if (keyImageContainer) keyImageContainer.style.display = 'block';
  }

  function onKeyPress(event) {
    if (event.key.toLowerCase() !== 'c' || hasUsedKey || !keyObject) return;

    const distanceToKey = camera.position.distanceTo(keyObject.position);
    if (distanceToKey < 15) {
      collectKey();
    }
  }

  function openDoor() {
    if (doorOpen) return;
    doorOpen = true;

    const doorTargetPosition = door.position.clone();
    doorTargetPosition.z -= 5.4;

    const doorBox = new THREE.Box3().setFromObject(door);
    const doorIndex = wallBoundingBoxes.findIndex(box => box.equals(doorBox));
    if (doorIndex !== -1) wallBoundingBoxes.splice(doorIndex, 1);

    const startTime = performance.now();
    const animationDuration = 1;

    function animateDoor() {
      const elapsedTime = (performance.now() - startTime) / 50000;
      if (elapsedTime < animationDuration) {
        door.position.lerp(doorTargetPosition, elapsedTime / animationDuration);
        requestAnimationFrame(animateDoor);
      } else {
        door.position.copy(doorTargetPosition);
      }
    }

    animateDoor();
    doorOpenSound.currentTime = 0;
    doorOpenSound.play().catch(() => {});
    hasUsedKey = true;

    if (keyObject) {
      camera.remove(keyObject);
      keyObject = null;
      const keyImageContainer = document.getElementById('key-image-container');
      if (keyImageContainer) keyImageContainer.style.display = 'none';
    }

    const hideKeyImage = typeof window.hideKeyImage === 'function' ? window.hideKeyImage : null;
    if (hideKeyImage) hideKeyImage();
  }

  function onDoorPress(event) {
    if (event.key.toLowerCase() !== 'e') return;

    if (hasKey && !hasUsedKey && boundDoor === door) {
      openDoor();
    } else {
      alert('You need the correct key to open the door!');
    }
  }

  function checkKey(playerPosition) {
    if (!keyObject) return;

    const distance = playerPosition.distanceTo(keyObject.position);
    if (distance < 5 && !hasKey) {
      showKeyCollectNote();
    } else {
      hideKeyCollectNote();
    }
  }

  function checkDoor(playerPosition) {
    const distanceToDoor = playerPosition.distanceTo(door.position);

    if (distanceToDoor < 10) {
      if (hasKey && !doorOpen && !hasUsedKey && boundDoor === door) {
        showDoorOpenNote();
      } else {
        showNoKeyNote();
      }
    } else {
      hideDoorNote();
      const noKeyNote = document.getElementById('no-key-note');
      if (noKeyNote) noKeyNote.style.display = 'none';
    }
  }

  function playWrongPasswordSound() {
    wrongPasswordSound.currentTime = 0;
    wrongPasswordSound.play().catch(() => {});
  }

  function playCorrectPasswordSound() {
    correctPasswordSound.currentTime = 0;
    correctPasswordSound.play().catch(() => {});
  }

  function playTypingSound() {
    if (typingTimeout) clearTimeout(typingTimeout);
    typingSound.currentTime = 0;
    typingSound.play().catch(() => {});
    typingTimeout = setTimeout(stopTypingSound, 1000);
  }

  function stopTypingSound() {
    typingSound.pause();
    typingSound.currentTime = 0;
  }

  function playDeviceInteractionSound() {
    deviceInteractionSound.currentTime = 0;
    deviceInteractionSound.play().catch(() => {});
  }

  function isNearDevice() {
    if (!passwordDevice) return false;
    return camera.position.distanceTo(passwordDevice.position) <= 8;
  }

  function createPasswordUI() {
    inputDiv = document.createElement('div');
    inputDiv.style.position = 'absolute';
    inputDiv.style.top = '50%';
    inputDiv.style.left = '50%';
    inputDiv.style.transform = 'translate(-50%, -50%)';
    inputDiv.style.backgroundColor = 'rgba(0,0,0,0.8)';
    inputDiv.style.padding = '20px';
    inputDiv.style.borderRadius = '10px';
    inputDiv.style.color = 'white';
    inputDiv.style.fontFamily = 'fantasy';
    document.body.appendChild(inputDiv);
    updatePasswordDisplay();
  }

  function updatePasswordDisplay() {
    if (!inputDiv) return;
    inputDiv.innerHTML = `
      <p style="font-size: 30px; color: ${enteredPassword === correctPassword ? 'green' : 'red'};">Entered Password: ${enteredPassword}</p>
      <p>Press Enter to Submit</p>
    `;
  }

  function startPasswordInput() {
    isInteracting = true;
    playDeviceInteractionSound();
    interactionUI.innerHTML = 'Enter Password:<br>Press Q to close the device';
    createPasswordUI();
  }

  function quitInteraction() {
    isInteracting = false;
    enteredPassword = '';
    interactionUI.innerHTML = '';

    if (!deviceInteractionSound.paused) {
      deviceInteractionSound.pause();
      deviceInteractionSound.currentTime = 0;
    }

    if (inputDiv) {
      inputDiv.remove();
      inputDiv = null;
    }
  }

  function showPasswordMessage(isCorrect) {
    const messageDiv = document.createElement('div');
    messageDiv.style.position = 'absolute';
    messageDiv.style.top = '60%';
    messageDiv.style.left = '50%';
    messageDiv.style.transform = 'translateX(-50%)';
    messageDiv.style.color = isCorrect ? 'green' : 'red';
    messageDiv.style.fontFamily = 'fantasy';
    messageDiv.style.fontSize = '30px';
    messageDiv.style.textAlign = 'center';
    messageDiv.innerHTML = isCorrect
      ? 'Correct! Password accepted. Door is open.'
      : 'Wrong password! Try again.';
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
  }

  function openPasswordDoor() {
    if (doorOpenSound1.paused || doorOpenSound1.ended) {
      doorOpenSound1.currentTime = 0;
      doorOpenSound1.play().catch(() => {});
    }

    const doorBox = new THREE.Box3().setFromObject(texturedPasswordDoor);
    const doorIndex = wallBoundingBoxes.findIndex(box => box.equals(doorBox));
    if (doorIndex !== -1) wallBoundingBoxes.splice(doorIndex, 1);

    new TWEEN.Tween(texturedPasswordDoor.position)
      .to({ y: texturedPasswordDoor.position.y + 11 }, 6000)
      .easing(TWEEN.Easing.Quadratic.Out)
      .start();

    setTimeout(() => {
      doorOpenSound1.pause();
      doorOpenSound1.currentTime = 0;
    }, 6000);
  }

  function validatePassword(password) {
    if (password === correctPassword) {
      openPasswordDoor();
      showPasswordMessage(true);
      playCorrectPasswordSound();
      setTimeout(quitInteraction, 2000);
      deviceInteracted = true;
    } else {
      showPasswordMessage(false);
      playWrongPasswordSound();
      enteredPassword = '';
      updatePasswordDisplay();
    }
  }

  function handleKeyPress(event) {
    const key = event.key.toLowerCase();

    if (key === 'c' && !hasUsedKey && !isInteracting && !deviceInteracted) {
      onKeyPress(event);
    }

    if (key === 'e' && !isInteracting && !deviceInteracted && isNearDevice()) {
      startPasswordInput();
      return;
    }

    if (key === 'q' && isInteracting) {
      quitInteraction();
      return;
    }

    if (!isInteracting) return;

    if (event.key >= '0' && event.key <= '9') {
      enteredPassword += event.key;
      updatePasswordDisplay();
      playTypingSound();
    } else if (event.key === 'Enter') {
      validatePassword(enteredPassword);
    } else if (event.key === 'Backspace') {
      enteredPassword = enteredPassword.slice(0, -1);
      updatePasswordDisplay();
      playTypingSound();
    }
  }

  function onMouseMove(event) {
    if (!passwordDevice || isInteracting || deviceInteracted) return;

    const mouse = new THREE.Vector2(
      (event.clientX / window.innerWidth) * 2 - 1,
      -(event.clientY / window.innerHeight) * 2 + 1
    );
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(passwordDevice, true);

    if (intersects.length > 0 && isNearDevice()) {
      interactionUI.innerHTML = 'Press E to Interact with the Device Manager';
    } else {
      interactionUI.innerHTML = '';
    }
  }

  window.addEventListener('keydown', handleKeyPress);
  window.addEventListener('mousemove', onMouseMove);

  function update(playerPosition) {
    checkKey(playerPosition);
    checkDoor(playerPosition);

    if (passwordDevice && isNearDevice() && !isInteracting && !deviceInteracted) {
      interactionUI.innerHTML = 'Press E to Interact with the Device Manager';
    } else if (!isInteracting && (!isNearDevice() || deviceInteracted)) {
      interactionUI.innerHTML = '';
    }
  }

  return {
    update,
    get hasKey() { return hasKey; },
    get hasUsedKey() { return hasUsedKey; },
    get isInteracting() { return isInteracting; },
    get deviceInteracted() { return deviceInteracted; }
  };
}
