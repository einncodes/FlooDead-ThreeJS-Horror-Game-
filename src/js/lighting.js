import * as THREE from 'three';
import { GUI } from 'dat.gui';

export function setupLighting(scene, renderer) {
  // ================================================================
  // Fog Setup
  // ================================================================
  let fogDensity = 0.08;
  let fogColor = new THREE.Color(0x000000);
  scene.fog = new THREE.FogExp2(fogColor, fogDensity);

  // ================================================================
  // Lighting Setup
  // ================================================================
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.010);
  directionalLight.position.set(-15.36, -50, 50).normalize();
  scene.add(directionalLight);

  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const localizedDirectionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
  localizedDirectionalLight.position.set(-15.36, -50, 50);
  localizedDirectionalLight.target.position.set(29, 7, -28);
  localizedDirectionalLight.castShadow = true;
  localizedDirectionalLight.shadow.mapSize.width = 1024;
  localizedDirectionalLight.shadow.mapSize.height = 1024;
  localizedDirectionalLight.shadow.camera.near = 0.1;
  localizedDirectionalLight.shadow.camera.far = 500;

  scene.add(localizedDirectionalLight);
  scene.add(localizedDirectionalLight.target);

  // ================================================================
  // Flickering light effect
  // ================================================================
  const sparkSound = new Audio('/sounds/Electricity spark sound effects HQ.mp3');
  sparkSound.volume = 1.0;

  sparkSound.addEventListener('loadedmetadata', () => {
    console.log('Sound loaded, duration:', sparkSound.duration);
  });

  function flickerLight() {
    const flashCount = Math.floor(Math.random() * 6) + 3;
    let currentFlash = 0;

    function flash() {
      if (currentFlash < flashCount) {
        const isFlickering = Math.random() > 0.5;

        if (isFlickering) {
          ambientLight.intensity = Math.random() * 0.7 + 0.1;

          if (sparkSound.paused && !isNaN(sparkSound.duration)) {
            const randomStartTime = Math.random() * sparkSound.duration;
            sparkSound.currentTime = randomStartTime;
            sparkSound.play().catch(() => {});
          }
        } else {
          ambientLight.intensity = 1;
          if (!sparkSound.paused) {
            sparkSound.pause();
          }
        }

        currentFlash++;
        setTimeout(flash, Math.random() * 100 + 50);
      } else {
        ambientLight.intensity = 0.1;
        if (!sparkSound.paused) {
          sparkSound.pause();
        }
        setTimeout(flickerLight, 5000);
      }
    }

    flash();
  }

  flickerLight();

  // ================================================================
  // GUI Setup
  // ================================================================
  const gui = new GUI();
  const lightFolder = gui.addFolder('Lighting');
  lightFolder.add(ambientLight, 'intensity', 0, 2).name('Ambient Light Intensity');
  lightFolder.add(directionalLight, 'intensity', 0, 2).name('Directional Light Intensity');

  const lightDirectionFolder = gui.addFolder('Light Direction');
  const initialLightPosition = {
    x: -15.36,
    y: -50,
    z: 50
  };

  directionalLight.position.set(
    initialLightPosition.x,
    initialLightPosition.y,
    initialLightPosition.z
  );

  lightDirectionFolder.add(initialLightPosition, 'x', -50, 50)
    .name('Light X Position')
    .onChange((value) => { directionalLight.position.x = value; });

  lightDirectionFolder.add(initialLightPosition, 'y', -50, 50)
    .name('Light Y Position')
    .onChange((value) => { directionalLight.position.y = value; });

  lightDirectionFolder.add(initialLightPosition, 'z', -50, 50)
    .name('Light Z Position')
    .onChange((value) => { directionalLight.position.z = value; });

  const fogFolder = gui.addFolder('Fog');
  fogFolder.add({ fogDensity }, 'fogDensity', 0, 0.1)
    .name('Fog Density')
    .onChange((value) => { scene.fog.density = value; });

  fogFolder.addColor({ fogColor: fogColor.getHex() }, 'fogColor')
    .name('Fog Color')
    .onChange((value) => { scene.fog.color.set(value); });

  function hideGUI() {
    const guiContainer = document.querySelector('.dg.ac');
    if (guiContainer) {
      guiContainer.style.display = '1';
    }
  }

  hideGUI();
  lightFolder.close();
  lightDirectionFolder.close();
  fogFolder.close();

  return {
    ambientLight,
    directionalLight,
    localizedDirectionalLight,
    gui
  };
}
