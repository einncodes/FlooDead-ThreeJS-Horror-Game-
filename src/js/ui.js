// ================================================================
// UI Setup
// ================================================================
// Keeps dynamically-created interface controls separate from the
// game systems. Existing gameplay/UI elements are still owned by
// the systems that use them (interactions, gameOver, etc.).

export function setupUI() {
  function playAudio() {
    const audio1 = new Audio('/sounds/Sound Effects Heavy Rain and Thunder.mp3');
    const audio2 = new Audio('/sounds/Underwater Pool - Sound Effect (HD).mp3');
    const audio3 = new Audio('/sounds/Free Horror Ambience (Dark Project).mp3');

    audio1.volume = 1;
    audio2.volume = 1;
    audio3.volume = 1;

    audio1.loop = true;
    audio2.loop = true;
    audio3.loop = true;

    audio1.play().catch(error => console.error('Error playing audio1:', error));
    audio2.play().catch(error => console.error('Error playing audio2:', error));
    audio3.play().catch(error => console.error('Error playing audio3:', error));

    return { audio1, audio2, audio3 };
  }

  const playButton = document.createElement('button');
  playButton.textContent = 'Play Audio';
  playButton.onclick = playAudio;
  document.body.appendChild(playButton);

  return {
    playButton,
    playAudio
  };
}
