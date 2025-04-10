/**
 * Point culture (en Français car je suis un peu obligé): 
 * Dans ce genre de jeu, un mot equivaut à 5 caractères, y compris les espaces. 
 * La précision, c'est le pourcentage de caractères tapés correctement sur tous les caractères tapés.
 * 
 * Sur ce... Amusez-vous bien ! 
 */
let startTime = null, previousEndTime = null;
let currentWordIndex = 0;
const wordsToType = [];

const modeSelect = document.getElementById("mode");
const wordDisplay = document.getElementById("word-display");
const inputField = document.getElementById("input-field");
const results = document.getElementById("results");

const words = {
    easy: ["apple", "banana", "grape", "orange", "cherry"],
    medium: ["keyboard", "monitor", "printer", "charger", "battery"],
    hard: ["synchronize", "complicated", "development", "extravagant", "misconception"]
};

const getRandomWord = (mode) => {
    const wordList = words[mode];
    return wordList[Math.floor(Math.random() * wordList.length)];
};

const startTest = (wordCount = 50) => {
    wordsToType.length = 0;
    wordDisplay.innerHTML = "";
    currentWordIndex = 0;
    startTime = null;
    previousEndTime = null;

    for (let i = 0; i < wordCount; i++) {
        wordsToType.push(getRandomWord(modeSelect.value));
    }

    wordsToType.forEach((word, index) => {
        const span = document.createElement("span");
        span.textContent = word + " ";
        if (index === 0) span.style.color = "red";
        wordDisplay.appendChild(span);
    });

    inputField.value = "";
    results.textContent = "";
};

const startTimer = () => {
    if (!startTime) startTime = Date.now();
};

const getCurrentStats = (typedWord, targetWord) => {
    let correctChars = 0;
    const minLength = Math.min(typedWord.length, targetWord.length);
    for (let i = 0; i < minLength; i++) {
        if (typedWord[i] === targetWord[i]) {
            correctChars++;
        }
    }

    const totalTyped = typedWord.length;
    const accuracy = totalTyped > 0 ? (correctChars / totalTyped) * 100 : 0;

    const elapsedTime = (Date.now() - previousEndTime) / 1000;
    const wpm = (targetWord.length / 5) / (elapsedTime / 60);

    return {
        wpm: wpm.toFixed(2),
        accuracy: accuracy.toFixed(2)
    };
};

const updateWord = (event) => {
    if (event.key === " ") {
        event.preventDefault();

        const typed = inputField.value.trim();
        const target = wordsToType[currentWordIndex];
        const wordElements = wordDisplay.children;

        const { wpm, accuracy } = getCurrentStats(typed, target);

        if (typed === target) {
            wordElements[currentWordIndex].style.color = "green";
        } else {
            wordElements[currentWordIndex].style.color = "crimson";
        }

        results.textContent = `WPM: ${wpm}, Accuracy: ${accuracy}%`;

        currentWordIndex++;
        previousEndTime = Date.now();
        inputField.value = "";

        if (currentWordIndex >= wordsToType.length) {
            inputField.disabled = true;
            results.textContent += " 🎉 Test terminé !";
        } else {
            highlightNextWord();
        }
    }
};

const highlightNextWord = () => {
    const wordElements = wordDisplay.children;

    if (currentWordIndex < wordElements.length) {
        if (currentWordIndex > 0) {
            wordElements[currentWordIndex - 1].style.color = "black";
        }
        wordElements[currentWordIndex].style.color = "red";
    }
};

inputField.addEventListener("keydown", (event) => {
    startTimer();
    updateWord(event);
});

modeSelect.addEventListener("change", () => startTest());

// Clavier virtuel : clic sur une touche

document.querySelectorAll(".key").forEach(key => {
    key.addEventListener("click", () => {
        const value = key.textContent;

        if (value === "←") {
            inputField.value = inputField.value.slice(0, -1);
        } else if (value === "Espace") {
            const spaceEvent = new KeyboardEvent("keydown", {
                key: " ",
                bubbles: true
            });
            inputField.dispatchEvent(spaceEvent);
        } else {
            inputField.value += value.toLowerCase();
        }

        inputField.focus();
    });
});

startTest();
