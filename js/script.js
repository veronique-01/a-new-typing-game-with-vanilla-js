let startTime = null;
let timerInterval = null;
let currentWordIndex = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");
const keyboardElement = document.getElementById("keyboard");

const correctSound = new Audio('../sound/correct.mp3');

const words = {
  easy: ["apple", "banana", "grape", "orange", "cherry"],
  medium: ["keyboard", "monitor", "printer", "charger", "battery"],
  hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

let correctChars = 0;
let totalTypedChars = 0;

const formatTime = (ms) => {
  const totalSec = Math.floor(ms / 1000);
  const min = String(Math.floor(totalSec / 60)).padStart(2, '0');
  const sec = String(totalSec % 60).padStart(2, '0');
  return `${min}:${sec}`;
};

const startChrono = () => {
  startTime = Date.now();
  const timerDisplay = document.createElement("p");
  timerDisplay.id = "timerDisplay";
  timerDisplay.className = "fw-bold fs-5 text-danger text-center mt-3";
  timerDisplay.textContent = "00:00";
  results.insertAdjacentElement("afterend", timerDisplay);


  timerInterval = setInterval(() => {
    const now = Date.now();
    document.getElementById("timerDisplay").textContent = formatTime(now - startTime);
  }, 1000);
};

const getWPM = (elapsedSeconds) => {
  const wordsTyped = totalTypedChars / 5;
  return ((wordsTyped / elapsedSeconds) * 60).toFixed(2);
};

const getRandomWord = (mode) => {
  const wordList = words[mode];
  return wordList[Math.floor(Math.random() * wordList.length)];
};

const startTest = (wordCount = 10) => {
  wordsToType.length = 0;
  currentWordIndex = 0;
  correctChars = 0;
  totalTypedChars = 0;
  inputField.disabled = false;
  inputField.value = "";
  results.textContent = "";
  wordDisplay.innerHTML = "";

  if (document.getElementById("timerDisplay")) {
    document.getElementById("timerDisplay").remove();
  }

  clearInterval(timerInterval);
  startChrono();

  for (let i = 0; i < wordCount; i++) {
    wordsToType.push(getRandomWord(modeSelect.value));
  }

  wordsToType.forEach((word, index) => {
    const span = document.createElement("span");
    span.textContent = word + " ";
    span.classList.add("word-span");
    if (index === 0) span.classList.add("current-word");
    wordDisplay.appendChild(span);
  });
};

const updateWordColor = (typed, target) => {
  const spans = wordDisplay.querySelectorAll(".word-span");
  spans[currentWordIndex].style.color = target.startsWith(typed) ? "black" : "crimson";
};

inputField.addEventListener("input", () => {
  const typed = inputField.value.trim();
  const target = wordsToType[currentWordIndex];
  updateWordColor(typed, target);
});

inputField.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();

    const typed = inputField.value.trim();
    const target = wordsToType[currentWordIndex];
    const span = wordDisplay.querySelectorAll(".word-span")[currentWordIndex];

    // Stats
    const minLength = Math.min(typed.length, target.length);
    for (let i = 0; i < minLength; i++) {
      if (typed[i] === target[i]) correctChars++;
    }
    totalTypedChars += typed.length;

    // Résultat mot
    if (typed === target) {
      span.style.color = "limegreen";
      correctSound.play();
    } else {
      span.style.color = "crimson";
      keyboardElement.classList.add("shake");
      setTimeout(() => {
        keyboardElement.classList.remove("shake");
      }, 300);
    }

    span.classList.remove("current-word");
    currentWordIndex++;

    if (currentWordIndex >= wordsToType.length) {
      clearInterval(timerInterval);
      inputField.disabled = true;

      const elapsedTime = (Date.now() - startTime) / 1000;
      const accuracy = totalTypedChars > 0 ? (correctChars / totalTypedChars) * 100 : 0;
      const wpm = getWPM(elapsedTime);

      results.textContent = `Test terminé ! WPM : ${wpm} | Accuracy : ${accuracy.toFixed(2)}%`;


      const starsContainer = document.createElement("p");
      starsContainer.className = "fs-2 text-warning text-center mt-3";

      let stars = "★☆☆";
      if (accuracy >= 90 && wpm >= 60) stars = "★★★";
      else if (accuracy >= 70 && wpm >= 40) stars = "★★☆";

      starsContainer.textContent = `${stars}`;
      results.insertAdjacentElement("afterend", starsContainer);

    } else {
      wordDisplay.querySelectorAll(".word-span")[currentWordIndex].classList.add("current-word");
      inputField.value = "";
    }
  }
});


modeSelect.addEventListener("change", () => startTest());
startTest();
