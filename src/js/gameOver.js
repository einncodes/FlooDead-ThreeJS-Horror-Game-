export function setupGameOver({ onRestart }) {
  let gameOverState = false;
  let gameOverMessage = null;
  let gameOverImage = null;
  let restartHandler = null;

  const gameoverSound = new Audio('/sounds/Snake (Hiss) - Sound Effect _ ProSounds(MP3_160K).mp3');

  function trigger() {
    if (gameOverState) return;
    gameOverState = true;

    setTimeout(() => {
      gameOverMessage = document.createElement('div');
      gameoverSound.currentTime = 0;
      gameoverSound.play().catch(() => {});

      gameOverMessage.style.position = 'absolute';
      gameOverMessage.style.top = '50%';
      gameOverMessage.style.left = '50%';
      gameOverMessage.style.transform = 'translate(-50%, -50%)';
      gameOverMessage.style.fontSize = '48px';
      gameOverMessage.style.fontFamily = 'Courier New, Courier, monospace';
      gameOverMessage.style.color = 'red';
      gameOverMessage.style.fontWeight = 'bold';
      gameOverMessage.innerText = 'GAME OVER\nPress Ctrl + R to restart';
      document.body.appendChild(gameOverMessage);

      gameOverImage = document.createElement('img');
      gameOverImage.src = '/images/pics/bloodscreen.png';
      gameOverImage.style.position = 'fixed';
      gameOverImage.style.top = '0';
      gameOverImage.style.left = '0';
      gameOverImage.style.width = '100%';
      gameOverImage.style.height = '100%';
      gameOverImage.style.filter = 'contrast(41)';
      gameOverImage.style.opacity = '0.3';
      gameOverImage.style.zIndex = '-5';
      document.body.appendChild(gameOverImage);

      restartHandler = (event) => {
        if (event.ctrlKey && event.key.toLowerCase() === 'r') {
          onRestart();
          cleanup();
        }
      };
      document.addEventListener('keydown', restartHandler);
    }, 2000);
  }

  function cleanup() {
    if (gameOverMessage?.parentNode) gameOverMessage.remove();
    if (gameOverImage?.parentNode) gameOverImage.remove();
    if (restartHandler) {
      document.removeEventListener('keydown', restartHandler);
      restartHandler = null;
    }
    gameOverState = false;
  }

  return {
    trigger,
    cleanup,
    get isGameOver() {
      return gameOverState;
    }
  };
}
