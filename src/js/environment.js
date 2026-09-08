import * as THREE from 'three';

export function setupEnvironment({ scene, loader, models, modelBoundingBoxes }) {
  const shrinkFactor = -3;

  // Load and add chair model to the scene
  loader.load('/images/models/day_20__old_office_chair.glb', (gltf) => {
      chair = gltf.scene;
      chair.position.set(40, 2, -42);
      chair.scale.set(7, 5, 5);
      chair.rotation.x = Math.PI / 4;
      chair.rotation.z = -Math.PI / 1.9;
      chair.castShadow = true;
      chair.receiveShadow = true;
      scene.add(chair);

      // Add the chair to models and modelBoundingBoxes
      models.push(chair);
      const chairBox = new THREE.Box3().setFromObject(chair);
      chairBox.expandByVector(new THREE.Vector3(shrinkFactor, shrinkFactor, shrinkFactor));  // Shrink collision volume
      modelBoundingBoxes.push(chairBox);
  });

  // Load and add desk model to the scene
  loader.load('/images/models/office_desk.glb', (gltf) => {
      desk = gltf.scene;
      desk.position.set(40, 0.050, 33);
      desk.scale.set(0.130, 0.130, 0.130);
      desk.rotation.y = Math.PI / -1;
      desk.castShadow = true;
      desk.receiveShadow = true;
      scene.add(desk);

      // Add the desk to models and modelBoundingBoxes
      models.push(desk);
      const deskBox = new THREE.Box3().setFromObject(desk);
      deskBox.expandByVector(new THREE.Vector3(shrinkFactor, shrinkFactor, shrinkFactor));  // Shrink collision volume
      modelBoundingBoxes.push(deskBox);
  });

  // Load and add air conditioner model to the scene
  loader.load('/images/models/old_aircon.glb', (gltf) => {
      aircon = gltf.scene;
      aircon.position.set(34, 9, 28);
      aircon.scale.set(0.8, 0.8, 0.8);
      aircon.rotation.y = Math.PI / -2;
      aircon.castShadow = true;
      aircon.receiveShadow = true;
      scene.add(aircon);

      // Add the aircon to models and modelBoundingBoxes
      models.push(aircon);
      const airconBox = new THREE.Box3().setFromObject(aircon);
      airconBox.expandByVector(new THREE.Vector3(shrinkFactor, shrinkFactor, shrinkFactor));  // Shrink collision volume
      modelBoundingBoxes.push(airconBox);
  });
  /*
  // Load and add flower model to the scene
  loader.load('/images/models/flowering_cannabis_plant_in_a_pot.glb', (gltf) => {
      flower = gltf.scene;
      flower.position.set(30.4, 0, 31);
      flower.scale.set(0.030, 0.030, 0.030);
      flower.rotation.y = Math.PI / -2;
      flower.castShadow = false;
      flower.receiveShadow = true;
      scene.add(flower);

      // Add the flower to models and modelBoundingBoxes
      models.push(flower);
      const flowerBox = new THREE.Box3().setFromObject(flower);
      flowerBox.expandByVector(new THREE.Vector3(shrinkFactor, shrinkFactor, shrinkFactor));  // Shrink collision volume
      modelBoundingBoxes.push(flowerBox);
  });*/

  // Load and add frame model to the scene
  loader.load('/images/models/picture_frame.glb', (gltf) => {
      frame = gltf.scene;
      frame.position.set(46, 0, 43);
      frame.scale.set(1.3, 1.3, 1.3);
      frame.rotation.y = Math.PI / -2;
      frame.castShadow = true;
      frame.receiveShadow = true;
      scene.add(frame);

      // Add the frame to models and modelBoundingBoxes
      models.push(frame);
      const frameBox = new THREE.Box3().setFromObject(frame);
      frameBox.expandByVector(new THREE.Vector3(shrinkFactor, shrinkFactor, shrinkFactor));  // Shrink collision volume
      modelBoundingBoxes.push(frameBox);
  });





  loader.load('/images/models/isometric_office.glb', (gltf) => {
    design1 = gltf.scene;
    design1.position.set(10, 0, -30);
    design1.scale.set(6, 5, 6);
    design1.rotation.y = Math.PI / 100;
    design1.castShadow = true;
    design1.receiveShadow = true;
    //scene.add(design1);

    const design1ShrinkFactor = -7.2;

    //models.push(design1);
    const design1Box = new THREE.Box3().setFromObject(design1);
    design1Box.expandByVector(new THREE.Vector3(design1ShrinkFactor, design1ShrinkFactor, design1ShrinkFactor));
    //modelBoundingBoxes.push(design1Box);

    const pushBackAmount = 0.00010;
    const bounceDamping = 0.00010;

    function handleCameraBounce(camera, modelBox) {
      const cameraBox = new THREE.Box3().setFromObject(camera);

      if (cameraBox.intersectsBox(modelBox)) {
        const collisionNormal = new THREE.Vector3().subVectors(camera.position, modelBox.getCenter(new THREE.Vector3())).normalize();
        camera.position.add(collisionNormal.multiplyScalar(pushBackAmount));
        const velocity = new THREE.Vector3();
        velocity.add(collisionNormal.multiplyScalar(pushBackAmount));
        velocity.multiplyScalar(bounceDamping);
        camera.position.add(velocity);
      }
    }

    handleCameraBounce(camera, design1Box);
  });




  // Load and add office of a crane operator model to the scene
  loader.load('/images/models/office_of_a_crane_operator.glb', (gltf) => {
      design2 = gltf.scene;
      design2.position.set(-75, -1, 40);
      design2.scale.set(7, 5, 4);
      design2.rotation.y = Math.PI / -2;
      design2.castShadow = true;
      design2.receiveShadow = true;
      scene.add(design2);

      // Add the design2 to models and modelBoundingBoxes
      models.push(design2);
      const design2Box = new THREE.Box3().setFromObject(design2);
      design2Box.expandByVector(new THREE.Vector3(shrinkFactor, shrinkFactor, shrinkFactor));  // Shrink collision volume
      modelBoundingBoxes.push(design2Box);
  });



  loader.load('/images/models/building_hallway.glb', (gltf) => {
    design3 = gltf.scene;
    design3.position.set(-115, -39, -40);
    design3.scale.set(0.120, 0.110, 0.120);
    design3.rotation.y = Math.PI;
    design3.castShadow = true;
    design3.receiveShadow = true;
    //scene.add(design3);

    const design3ShrinkFactor = -116.8;

    models.push(design3);
    const design3Box = new THREE.Box3().setFromObject(design3);
    design3Box.expandByVector(new THREE.Vector3(design3ShrinkFactor, design3ShrinkFactor, design3ShrinkFactor));
    modelBoundingBoxes.push(design3Box);

    const pushBackAmount = 0.010;
    const bounceDamping = 0.010;

    function handleCameraBounce(camera, modelBox) {
        const cameraBox = new THREE.Box3().setFromObject(camera);

        if (cameraBox.intersectsBox(modelBox)) {
            const collisionNormal = new THREE.Vector3().subVectors(camera.position, modelBox.getCenter(new THREE.Vector3())).normalize();
            camera.position.add(collisionNormal.multiplyScalar(pushBackAmount));
            const velocity = new THREE.Vector3();
            velocity.add(collisionNormal.multiplyScalar(pushBackAmount));
            velocity.multiplyScalar(bounceDamping);
            camera.position.add(velocity);
        }
    }

    handleCameraBounce(camera, design3Box);
  });




  // Load and add checkered tile floor model to the scene, but not include it for collision detection
  loader.load('/images/models/checkered_tile_floor.glb', (gltf) => {
      floor = gltf.scene;
      floor.traverse((child) => {
          if (child.isMesh && child.material) {
              child.material.roughness = 0;
              child.material.needsUpdate = true;
          }
      });
      floor.position.set(0, 1, 0);
      floor.scale.set(0.410, 0.5, 0.450);
      floor.rotation.y = Math.PI / -2;
      floor.castShadow = true;
      floor.receiveShadow = true;
      scene.add(floor);
  });

  // Load and add waiting chair model to the scene
  loader.load('/images/models/waiting_chair.glb', (gltf) => {
      hallchairs = gltf.scene;
      hallchairs.position.set(-15, -1, 47);
      hallchairs.scale.set(6, 6, 6);
      hallchairs.rotation.y = Math.PI;
      hallchairs.castShadow = true;
      hallchairs.receiveShadow = true;
      scene.add(hallchairs);

      // Add the hallchairs to models and modelBoundingBoxes
      models.push(hallchairs);
      const hallchairsBox = new THREE.Box3().setFromObject(hallchairs);
      hallchairsBox.expandByVector(new THREE.Vector3(shrinkFactor, shrinkFactor, shrinkFactor));  // Shrink collision volume
      modelBoundingBoxes.push(hallchairsBox);
  });

  // Load and add low poly office cubicle model to the scene
  loader.load('/images/models/low_poly_90s_office_cubicle.glb', (gltf) => {
    cheaproom = gltf.scene;
    cheaproom.position.set(39, -1, 6.2);
    cheaproom.scale.set(9, 6, 9);
    cheaproom.rotation.y = Math.PI / 2;
    cheaproom.castShadow = true;
    cheaproom.receiveShadow = true;
    scene.add(cheaproom);

    // Set the specific shrink factor for this model
    const cheaproomShrinkFactor = -7.7; // Customize the shrink factor here

    // Add the cheaproom to models and modelBoundingBoxes
    models.push(cheaproom);
    const cheaproomBox = new THREE.Box3().setFromObject(cheaproom);
    cheaproomBox.expandByVector(new THREE.Vector3(cheaproomShrinkFactor, cheaproomShrinkFactor, cheaproomShrinkFactor));  // Shrink collision volume
    modelBoundingBoxes.push(cheaproomBox);

    // Customizable push-back and bounce damping for this model
    const pushBackAmount = 0.0010;  // Amount to push back the camera
    const bounceDamping = 0.0010;  // Factor to reduce the bounce

    // Update the camera position based on collision with this model
    function handleCameraBounce(camera, modelBox) {
        const cameraBox = new THREE.Box3().setFromObject(camera);

        if (cameraBox.intersectsBox(modelBox)) {
            // Collision detected, calculate collision normal
            const collisionNormal = new THREE.Vector3().subVectors(camera.position, modelBox.getCenter(new THREE.Vector3())).normalize();

            // Push the camera back slightly
            camera.position.add(collisionNormal.multiplyScalar(pushBackAmount));

            // Apply a damping effect to the bounce (if desired)
            const velocity = new THREE.Vector3();  // You can adjust how the camera "bounces" using this vector
            velocity.add(collisionNormal.multiplyScalar(pushBackAmount));
            velocity.multiplyScalar(bounceDamping);  // Apply the bounce damping to reduce bounce over time
            camera.position.add(velocity);  // Apply the velocity (adjusted by damping)
        }
    }

    // Call this function within your game loop to check and handle the collision for this specific model
    // Assuming you have a game loop where the camera is being updated regularly
    handleCameraBounce(camera, cheaproomBox);
  });


  // Load and add simple metal fence model to the scene
  loader.load('/images/models/simple_metal_fence.glb', (gltf) => {
      const fence = gltf.scene;
      fence.position.set(-45, 7, -40);
      fence.scale.set(1.2, 2, 1.2);
      fence.rotation.y = Math.PI / -6;
      fence.castShadow = true;
      fence.receiveShadow = true;
      scene.add(fence);

      // Add the fence to models and modelBoundingBoxes
      models.push(fence);
      const fenceBox = new THREE.Box3().setFromObject(fence);
      fenceBox.expandByVector(new THREE.Vector3(shrinkFactor, shrinkFactor, shrinkFactor));  // Shrink collision volume
      modelBoundingBoxes.push(fenceBox);
  });

  // Load and add statue of Edward Snowden model to the scene
  // Load and add statue of Edward Snowden model to the scene
  loader.load('/images/models/statue_of_edward_snowden.glb', (gltf) => {
    const statue = gltf.scene;
    statue.position.set(29, 7, -28);
    statue.scale.set(2, 2, 2);
    statue.rotation.y = Math.PI / 2;
    statue.castShadow = true;
    statue.receiveShadow = true;
    scene.add(statue);

    // Set the specific shrink factor for this model
    const statueShrinkFactor = -3; // Customize the shrink factor here

    // Add the statue to models and modelBoundingBoxes
    models.push(statue);
    const statueBox = new THREE.Box3().setFromObject(statue);
    statueBox.expandByVector(new THREE.Vector3(statueShrinkFactor, statueShrinkFactor, statueShrinkFactor));  // Shrink collision volume
    modelBoundingBoxes.push(statueBox);
  });

  // Load and add water dispenser near statue model to the scene
  loader.load('/images/models/water_dispenser.glb', (gltf) => {
      const nearstatue = gltf.scene;
      nearstatue.position.set(28, 6, -18);
      nearstatue.scale.set(3, 3, 3);
      nearstatue.rotation.y = Math.PI / 2;
      nearstatue.castShadow = true;
      nearstatue.receiveShadow = true;
      scene.add(nearstatue);

      // Add the nearstatue dispenser to models and modelBoundingBoxes
      models.push(nearstatue);
      const nearstatueBox = new THREE.Box3().setFromObject(nearstatue);
      nearstatueBox.expandByVector(new THREE.Vector3(shrinkFactor, shrinkFactor, shrinkFactor));  // Shrink collision volume
      modelBoundingBoxes.push(nearstatueBox);
  });

  // Load and add abandoned office ceiling model to the scene
  loader.load('/images/models/abandoned_office_ceiling.glb', (gltf) => {
      const ceiling = gltf.scene;
      ceiling.position.set(-149, 40, 100);
      ceiling.scale.set(2, 2, 2);
      ceiling.rotation.y = Math.PI / 2;
      ceiling.castShadow = true;
      ceiling.receiveShadow = true;
      ceiling.traverse((child) => {
          if (child.isMesh) {
              child.material = child.material.clone();
              child.material.roughness = 0;
          }
      });
      scene.add(ceiling);


  });


  // Load and add low poly dead body model to the scene
  loader.load('/images/models/low_poly_dead_body_covered_game_ready.glb', (gltf) => {
    const dead = gltf.scene;
    dead.position.set(10, 1, 40.2);
    dead.scale.set(5, 5, 5);
    dead.rotation.y = Math.PI / 2;
    dead.traverse((child) => {
        if (child.isMesh) {
            child.material = child.material.clone();
            child.material.roughness = 1;
        }
    });
    scene.add(dead);

    // Add the dead body to models and modelBoundingBoxes
    models.push(dead);
    const deadBox = new THREE.Box3().setFromObject(dead);
    deadBox.expandByVector(new THREE.Vector3(shrinkFactor, shrinkFactor, shrinkFactor));  // Shrink collision volume
    modelBoundingBoxes.push(deadBox);
  });

  // Load and add debris falling from ceiling model to the scene
  loader.load('/images/models/falling_debris_ceiling.glb', (gltf) => {
    const fallingdebris = gltf.scene;
    fallingdebris.position.set(1, 3, -40);
    fallingdebris.scale.set(4, 6, 5);
    fallingdebris.rotation.y = Math.PI / 2;
    fallingdebris.castShadow = true;
    fallingdebris.receiveShadow = true;
    scene.add(fallingdebris);

    // Add the falling debris to models and modelBoundingBoxes
    models.push(fallingdebris);

  });

  // Load and add falling ceiling model to the scene
  loader.load('images/models/abandoned_office_ceiling.glb', (gltf) => {
    const fallceiling = gltf.scene;
    fallceiling.position.set(-27, -16.3, 54);
    fallceiling.scale.set(1, 12, 1);
    fallceiling.rotation.y = Math.PI / 2; // 90-degree rotation
    fallceiling.rotation.z = Math.PI / 8; // Slight tilt by 22.5 degrees
    fallceiling.castShadow = true;
    fallceiling.receiveShadow = true;
    scene.add(fallceiling);

    // Add the falling ceiling to models and modelBoundingBoxes
    models.push(fallceiling);
  });

  // Camera collision detection
}
