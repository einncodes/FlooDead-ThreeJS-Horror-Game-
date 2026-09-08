let flashlightOn = false;
let flashlightCooldown = false;
let flashlightOverlay = null;

function createFlashlightOverlay() {
  flashlightOverlay = document.createElement('div');

  flashlightOverlay.style.position = 'fixed';
  flashlightOverlay.style.bottom = '30px';
  flashlightOverlay.style.left = '50%';
  flashlightOverlay.style.transform = 'translateX(-50%)';
  flashlightOverlay.style.color = 'white';
  flashlightOverlay.style.fontSize = '18px';
  flashlightOverlay.style.fontFamily = 'Courier New, monospace';
  flashlightOverlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
  flashlightOverlay.style.padding = '8px 18px';
  flashlightOverlay.style.borderRadius = '6px';
  flashlightOverlay.style.pointerEvents = 'none';
  flashlightOverlay.style.display = 'none';
  flashlightOverlay.style.zIndex = '500';

  document.body.appendChild(flashlightOverlay);
}

function showFlashlightMessage(msg, duration = 2000) {
  flashlightOverlay.innerText = msg;
  flashlightOverlay.style.display = 'block';

  clearTimeout(flashlightOverlay._timeout);

  flashlightOverlay._timeout = setTimeout(() => {
    flashlightOverlay.style.display = 'none';
  }, duration);
}

export function setupFlashlight(lightObject, pointLight) {

  createFlashlightOverlay();

  // Start hidden
  lightObject.visible = false;
  pointLight.visible = false;

  document.addEventListener('keydown', (e) => {

    if (e.code !== 'KeyF') return;

    if (flashlightCooldown) return;

    if (!flashlightOn) {

      // Turn ON
      flashlightOn = true;

      lightObject.visible = true;
      pointLight.visible = true;

      showFlashlightMessage('🔦 Flashlight ON', 1500);

      // Auto turn off after 5 seconds
      setTimeout(() => {

        flashlightOn = false;

        lightObject.visible = false;
        pointLight.visible = false;

        flashlightCooldown = true;

        showFlashlightMessage(
          '🔥 Overheat — please wait 5 seconds...',
          5000
        );

        // Cooldown
        setTimeout(() => {

          flashlightCooldown = false;

          showFlashlightMessage(
            '✅ Flashlight ready',
            2000
          );

        }, 5000);

      }, 5000);

    } else {

      // Manual early turn off
      flashlightOn = false;

      lightObject.visible = false;
      pointLight.visible = false;

      flashlightCooldown = true;

      showFlashlightMessage(
        '🔥 Overheat — please wait 5 seconds...',
        5000
      );

      setTimeout(() => {

        flashlightCooldown = false;

        showFlashlightMessage(
          '✅ Flashlight ready',
          2000
        );

      }, 5000);
    }
  });
}