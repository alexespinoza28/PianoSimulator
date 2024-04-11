const keys = document.querySelectorAll(".key");
const audioFilesClassic = {
  a: "c.mp3",
  w: "csharp.mp3",
  s: "d.mp3",
  e: "dsharp.mp3",
  d: "e.mp3",
  f: "f.mp3",
  t: "fsharp.mp3",
  g: "g.mp3",
  y: "gsharp.mp3",
  h: "a.mp3",
  u: "asharp.mp3",
  j: "b.mp3",
  k: "c2.mp3", // C of the next octave
  o: "csharp2.mp3",
  l: "d2.mp3",
  p: "dsharp2.mp3",
  ";": "e2.mp3",
};

const audioFilesCyber = {
  a: "digikeyC.wav",
  w: "digikeyCsharp.wav",
  s: "digikeyD.wav",
  e: "digikeyDsharp.wav",
  d: "digikeyE.wav",
  f: "digikeyF.wav",
  t: "digikeyFsharp.wav",
  g: "digikeyG.wav",
  y: "digikeyGsharp.wav",
  h: "digikeyA.wav",
  u: "digikeyAsharp.wav",
  j: "digikeyB.wav",
  k: "digikeyC2.wav", // C of the next octave
  o: "digikeyCsharp2.wav",
  l: "digikeyD2.wav",
  p: "digikeyDsharp2.wav",
  ";": "digikeyE2.wav",
};

let currentAudioFiles = audioFilesClassic; // Start with classic

let currentlyPlaying = []; // Array to track playing sounds
let keyStates = {}; // Track if a key is currently down
const keysBeingPressed = new Set(); // Create a Set to store the keys being pressed

function playSound(key) {
  // If there's already an audio playing for this key, return
  if (currentlyPlaying[key]) return;

  const audio = new Audio();

  audio.src =
    currentTheme === "classic"
      ? `sounds/${currentAudioFiles[key]}`
      : `digikeys/${currentAudioFiles[key]}`;
  audio.play();

  // Store the audio in the currentlyPlaying object
  currentlyPlaying[key] = audio;

  // When the audio ends, remove it from the currentlyPlaying object
  audio.onended = () => {
    delete currentlyPlaying[key];
  };

  currentlyPlaying[key].targetVolume = 1.0; // Store the target volume

  return audio;
}

function stopSound(audio) {
  audio.pause();
  audio.currentTime = 0;
  currentlyPlaying = currentlyPlaying.filter((a) => a !== audio);
}

function addPlayingClass(key) {
  key.classList.add("playing");
}

function removePlayingClass(event) {
  event.target.classList.remove("playing");
}

function fadeOut(audio) {
  setTimeout(function () {
    let fadeAudio = setInterval(function () {
      if (audio.volume > 0.005) {
        audio.volume -= 0.005; // Decrease volume by a smaller amount
      }
      if (audio.volume <= 0.01) {
        audio.pause();
        audio.currentTime = 0;
        clearInterval(fadeAudio);
      }
    }, 10); // Run the interval more frequently
  }); // Delay before starting the fade out
}
keys.forEach((key) => {
  key.addEventListener("click", () => {
    playSound(key.dataset.key);
    addPlayingClass(key);
  });
  key.addEventListener("transitionend", (event) => {
    removePlayingClass(event);

    const audio = currentlyPlaying.find((a) =>
      a.src.includes(audioFilesClassic[key.dataset.key])
    );
    if (audio) {
      fadeOut(audio);
    }
    keyStates[key.dataset.key] = false; // Mark key as up
  });
});

window.addEventListener("keydown", (event) => {
  if (keysBeingPressed.has(event.key)) {
    return; // If the key is already down, don't play the sound again
  }
  playSound(event.key); // Pass event.key to playSound
  const pressedKey = document.querySelector(`[data-key="${event.key}"]`);
  if (pressedKey) {
    addPlayingClass(pressedKey);
    keysBeingPressed.add(event.key); // Add the key to the Set
  }
  let audio = document.getElementById(event.key);
  audio.volume = 1.0; // Reset the volume
  audio.currentTime = 0; // Reset the audio time
  audio.play();
});

window.addEventListener("keyup", (event) => {
  const audio = currentlyPlaying[event.key];
  if (audio) {
    fadeOut(audio);
    delete currentlyPlaying[event.key];
  }
  keysBeingPressed.delete(event.key); // Remove the key from the Set
  let audioo = document.getElementById(event.key);
  fadeOut(audio);
});

//new cyber theme

let currentTheme = "classic";

const toggleButton = document.getElementById("button");
toggleButton.addEventListener("click", toggleTheme);

function toggleTheme() {
  document.body.style.display = "none"; // Temporary hide
  document.body.offsetHeight; // Trigger a reflow
  document.body.style.display = ""; // Show it again
  if (currentTheme === "classic") {
    currentTheme = "cyber";
    document.body.classList.add("cyber-theme");
    currentAudioFiles = audioFilesCyber; // Update sound files for cyber theme
    document.getElementById("pianoTitle").textContent = "Cyberpunk Theme"; // Classic title
  } else {
    currentTheme = "classic";
    document.body.classList.remove("cyber-theme");
    currentAudioFiles = audioFilesClassic; // Update sound files for classic theme
    document.getElementById("pianoTitle").textContent = "Classic theme"; // Classic title
  }
}
