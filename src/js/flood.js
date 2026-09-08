import * as THREE from 'three';

export function setupFlood(scene, loader, textureLoader, onDrown) {
  let water1;
  let waterMixer;

  // Load animated water GLB
  loader.load('/images/models/water_wave_for_ar.glb', (gltf) => {
    water1 = gltf.scene;
    water1.scale.set(0.3, 0.3, 0.31);
    water1.position.set(20, 21.7, 20);
    water1.castShadow = true;
    water1.receiveShadow = true;
    scene.add(water1);

    water1.traverse((child) => {
      if (child.isMesh && child.material) {
        child.material.color = new THREE.Color(0x001a33);
        child.material.emissive = new THREE.Color(0x000000);
        child.material.needsUpdate = true;
      }
    });

    if (gltf.animations && gltf.animations.length) {
      waterMixer = new THREE.AnimationMixer(water1);
      gltf.animations.forEach((clip) => {
        waterMixer.clipAction(clip).play();
      });
    }
  });

  const waterVertexShader = `
    uniform float time;
    varying vec2 vUv;
    varying float vWaveHeight;

    void main() {
      vUv = uv;

      float waveAmplitude = 12.0;
      float waveFrequency = 0.1;

      vec3 newPosition = position;
      float waveHeight = sin(position.x * waveFrequency + time * 1.5) * waveAmplitude +
                         cos(position.z * waveFrequency + time * 1.5) * waveAmplitude;

      newPosition.y += waveHeight;
      vWaveHeight = waveHeight;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;

  const waterFragmentShader = `
    uniform float time;
    uniform sampler2D normalMap;
    uniform vec3 lightPosition;
    uniform vec3 waterColor;
    uniform vec3 ambientLightColor;
    varying vec2 vUv;
    varying float vWaveHeight;

    void main() {
      vec3 normal = texture2D(normalMap, vUv).rgb;
      normal = normalize(normal * 2.0 - 1.0);

      vec3 lightDir = normalize(lightPosition - gl_FragCoord.xyz);
      float diff = max(dot(normal, lightDir), 0.0);

      vec3 color = waterColor * diff * 0.3 +
                   vec3(48.0/255.0, 48.0/255.0, 0.0) * (1.0 - diff);

      color += ambientLightColor * 1.0;

      gl_FragColor = vec4(color, 0.1);
    }
  `;

  const normalTexture = textureLoader.load('/images/texture/water.avif');

  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0.0 },
      normalMap: { value: normalTexture },
      lightPosition: { value: new THREE.Vector3(0, 10, 0) },
      waterColor: { value: new THREE.Color(0x001a33) },
      ambientLightColor: { value: new THREE.Color(0x404040) },
    },
    vertexShader: waterVertexShader,
    fragmentShader: waterFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const waterGeometry = new THREE.PlaneGeometry(900, 900, 64, 64);
  const water = new THREE.Mesh(waterGeometry, waterMaterial);
  water.rotation.x = -Math.PI * 0.5;
  water.position.set(0, -50, 0);
  water.scale.set(0.130, 0.130, 0.130);
  water.receiveShadow = true;
  water.castShadow = true;
  // scene.add(water); // Preserve original behavior

  let waterRising = true;
  const waterRiseSpeed = 0.05;

  function triggerFloodGameOver() {
    const floodOverlay = document.createElement('div');
    floodOverlay.style.position = 'fixed';
    floodOverlay.style.top = '0';
    floodOverlay.style.left = '0';
    floodOverlay.style.width = '100%';
    floodOverlay.style.height = '100%';
    floodOverlay.style.backgroundColor = 'rgba(0, 50, 150, 0.7)';
    floodOverlay.style.zIndex = '999';
    document.body.appendChild(floodOverlay);

    const gameOverMessage = document.createElement('div');
    gameOverMessage.style.position = 'fixed';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.fontSize = '48px';
    gameOverMessage.style.fontFamily = 'Courier New, Courier, monospace';
    gameOverMessage.style.color = 'white';
    gameOverMessage.style.fontWeight = 'bold';
    gameOverMessage.style.textAlign = 'center';
    gameOverMessage.style.zIndex = '1000';
    gameOverMessage.innerHTML = 'YOU DROWNED<br><span style="font-size:24px">Press Ctrl + R to restart</span>';
    document.body.appendChild(gameOverMessage);

    onDrown();
  }

  function update(delta) {
    waterMaterial.uniforms.time.value += delta;

    if (waterMixer) {
      waterMixer.update(delta);
    }

    if (waterRising) {
      water.position.y += waterRiseSpeed * delta;

      if (water1) {
        water1.position.y += waterRiseSpeed * delta;
      }

      if (water.position.y >= -40.2) {
        waterRising = false;
        triggerFloodGameOver();
      }
    }
  }

  return {
    water,
    water1: () => water1,
    update,
    triggerFloodGameOver,
  };
}
