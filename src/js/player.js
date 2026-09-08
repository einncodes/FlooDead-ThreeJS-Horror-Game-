import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

export function setupPlayer(camera, scene, collisionSystem, audio) {
  class FPSControls {
    constructor(camera, scene) {
        this.camera = camera;
        this.scene = scene;
        this.pointerLockControls = new PointerLockControls(camera, document.body);

        scene.add(this.pointerLockControls.getObject()); // Use getObject()

        document.addEventListener('click', () => this.pointerLockControls.lock());

        this.velocity = new THREE.Vector3(0, 0, 0);
        this.acceleration = new THREE.Vector3(40, 2130, 40);
        this.deceleration = new THREE.Vector3(-10, -55, -10);
        this.move = { forward: false, backward: false, left: false, right: false };
        this.isStanding = true;
        this.isEditMode = false; // Track whether we are in edit mode



        document.addEventListener('keydown', (e) => this._onKeyDown(e), false);
        document.addEventListener('keyup', (e) => this._onKeyUp(e), false);

         // Add event listener for the "Enter First Person Mode" button
      const firstPersonBtn = document.getElementById('firstPersonBtn');
      firstPersonBtn.addEventListener('click', () => this.enterFirstPersonMode());

      // Add event listener for the "Enter Edit Mode" button
      const editModeBtn = document.getElementById('editModeBtn');
      editModeBtn.addEventListener('click', () => this.enterEditMode());

      // Add a scroll wheel listener to handle zoom only in edit mode
      document.addEventListener('wheel', (event) => this.handleScroll(event), { passive: false });
       // Create the target marker in the game
       this.createTargetMarker();
    }

    createTargetMarker() {
      const targetPosition = new THREE.Vector3(-61, 4, -40); // The target position
    
      // Create a small sphere to act as the marker
      const geometry = new THREE.SphereGeometry(0.2, 32, 32); // Small sphere with radius 0.2
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xff0000,      // Red color
        transparent: true,    // Enable transparency
        opacity: 0.0         // Set the opacity to 50% (you can adjust this value)
      });
      const marker = new THREE.Mesh(geometry, material);
    
      // Set the marker's position to the target position
      marker.position.copy(targetPosition);
    
      // Add the marker to the scene
      this.scene.add(marker);
    }


    enterFirstPersonMode() {
      // Activates pointer lock controls when the button is clicked
      this.pointerLockControls.lock(); // This will activate the pointer lock
      this.isEditMode = false; // Disable edit mode when entering first-person view
    }

    enterEditMode() {
      this.isEditMode = true; // Enable edit mode (fly mode)
      this.velocity.set(0, 0, 0); // Reset velocity
    }
    handleScroll(event) {
      // Disable zoom on scroll in both modes
      event.preventDefault(); // Prevent the page from scrolling
    }

    _onKeyDown(event) {
      switch (event.code) {
        case 'KeyW': this.move.forward = true; break;
        case 'KeyS': this.move.backward = true; break;
        case 'KeyA': this.move.left = true; break;
        case 'KeyD': this.move.right = true; break;
        case 'Space': // Jump (move up in Edit Mode)
          if (this.isEditMode) {
            this.move.up = true;
          } else if (this.isStanding) {
            this.velocity.y += 12; // Adjust jump height as needed
            this.isStanding = true;
          }
          break;
        case 'ShiftLeft': // Move down in Edit Mode
          if (this.isEditMode) {
            this.move.down = true;
          }
          break;
      }
    }





    _onKeyUp(event) {
        switch (event.code) {
            case 'KeyW': this.move.forward = false; break;
            case 'KeyS': this.move.backward = false; break;
            case 'KeyA': this.move.left = false; break;
            case 'KeyD': this.move.right = false; break;
            case 'Space': break;
        }
    }

    update(delta) {
      const speedMultiplier = 1; // Adjust speed multiplier here
      const frameDeceleration = new THREE.Vector3(
          this.velocity.x * this.deceleration.x,
          this.deceleration.y,
          this.velocity.z * this.deceleration.z
      );
      frameDeceleration.multiplyScalar(delta);
      this.velocity.add(frameDeceleration);

      const direction = new THREE.Vector3();
      this.camera.getWorldDirection(direction);

      const forward = new THREE.Vector3(direction.x, 0, direction.z).normalize();
      const right = new THREE.Vector3().crossVectors(this.camera.up, forward).normalize();

      if (this.move.forward) this.velocity.addScaledVector(forward, this.acceleration.z * delta);
      if (this.move.backward) this.velocity.addScaledVector(forward, -this.acceleration.z * delta);
      if (this.move.left) this.velocity.addScaledVector(right, this.acceleration.x * delta);
      if (this.move.right) this.velocity.addScaledVector(right, -this.acceleration.x * delta);

      // Check for collisions with walls
      collisionSystem.resolveWallCollision(
          this.pointerLockControls.getObject().position,
          this.velocity,
          delta
      );

      // Update camera position
      const position = this.pointerLockControls.getObject().position;
      position.addScaledVector(this.velocity, delta);

      // Apply gravity
      if (position.y < 5) {
          this.velocity.y = 1;
          position.y = 5;
          this.isStanding = true;
      }

  /*
      // Floating effect: Custom down and up positions
      let time = Date.now() * 0.001; // Time for the floating effect (in seconds)

      // Customize the down and up positions
      const downPosition = 4.1;  // Lowest point (down position)
      const upPosition = 5;     // Highest point (up position)

      const floatingAmplitude = upPosition - downPosition;  // The range between up and down positions
      const floatingFrequency = 0.5;  // Controls how fast the floating oscillates

      // Sinusoidal floating effect between the custom down and up positions
      position.y = downPosition + Math.sin(time * floatingFrequency) * floatingAmplitude;

  */

      // Play both walking sounds when moving
      if (this.move.forward || this.move.backward || this.move.left || this.move.right) {
        if (!audio.walkSound.isPlaying) {
          audio.walkSound.play(); // Play the first sound
        }
        if (!audio.secondWalkSound.isPlaying) {
          audio.secondWalkSound.play(); // Play the second sound
        }
        position.y += Math.sin(Date.now() / 100) * 0.10; // Bump effect
      } else {
        if (audio.walkSound.isPlaying) {
          audio.walkSound.stop(); // Stop the first sound
        }
        // Delay stopping the second sound by 1 second
        if (audio.secondWalkSound.isPlaying) {
          setTimeout(() => {
            audio.secondWalkSound.stop(); // Stop the second sound after 1 second delay
          }, 1000); // 1000 milliseconds = 1 second
        }
      }
    }
  }







  return new FPSControls(camera, scene);
}
