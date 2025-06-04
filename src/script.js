document.addEventListener("DOMContentLoaded", function () {
  const playBtn = document.getElementById("play-btn");
  const startScreen = document.getElementById("start-screen");
  const gameArea = document.getElementById("game-area");
  const questionContainer = document.getElementById("question-container");
  const scoreDiv = document.getElementById("score");

  // --- Create a column container for buttons ---
  let buttonColDiv = document.createElement("div");
  buttonColDiv.style.display = "flex";
  buttonColDiv.style.flexDirection = "column";
  buttonColDiv.style.alignItems = "stretch";
  buttonColDiv.style.gap = "1.2em";
  buttonColDiv.style.maxWidth = "260px";
  buttonColDiv.style.margin = "0 auto 1.5em auto";

  // --- Add: Option button to show/hide mode selection ---
  let modeBtn = document.createElement("button");
  modeBtn.textContent = "🛠️ Option";
  modeBtn.className = "animated-btn";
  modeBtn.style.marginBottom = "1em";
  modeBtn.style.background = "linear-gradient(90deg, #fffde4, #f7d9e3)";
  modeBtn.style.color = "#2196f3";
  modeBtn.style.border = "2px solid #2196f3";
  modeBtn.style.fontWeight = "bold";
  modeBtn.style.boxShadow = "0 2px 12px rgba(33,150,243,0.08)";
  modeBtn.style.transition = "background 0.2s, color 0.2s";
  modeBtn.style.margin = "0";

  playBtn.style.margin = "0";

  startScreen.insertBefore(modeBtn, playBtn);

  // --- Mode selection UI ---
  let modeDiv = document.createElement("div");
  modeDiv.id = "mode-options";
  modeDiv.style.display = "none";
  modeDiv.style.margin = "1em 0";
  modeDiv.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      align-items: stretch;
      gap: 1em;
      max-width: 240px;
      margin: 0 auto;
      background: #fff;
      border-radius: 14px;
      box-shadow: 0 2px 12px rgba(33,150,243,0.10);
      padding: 1.2em 1em;
    ">
      <button id="practice-mode" class="animated-btn" style="background:linear-gradient(90deg,#e3f0ff,#a8e063);color:#2196f3;">Practice Mode</button>
      <button id="exam-mode" class="animated-btn" style="background:linear-gradient(90deg,#ffb300,#ff5252);color:#fff;">Exam Mode</button>
    </div>
  `;
  startScreen.insertBefore(modeDiv, playBtn);

  let currentMode = "practice"; // default

  modeBtn.onclick = () => {
    modeDiv.style.display = modeDiv.style.display === "none" ? "block" : "none";
  };

  document.getElementById("practice-mode").onclick = () => {
    currentMode = "practice";
    modeDiv.style.display = "none";
    modeBtn.textContent = "🛠️ Option (Practice)";
  };
  document.getElementById("exam-mode").onclick = () => {
    currentMode = "exam";
    modeDiv.style.display = "none";
    modeBtn.textContent = "🛠️ Option (Exam)";
  };

  // --- Play Game button function based on option ---
  let timerDiv = document.createElement("div");
  timerDiv.id = "timer";
  timerDiv.style.marginTop = "1em";
  timerDiv.style.fontWeight = "bold";
  timerDiv.style.color = "#ff5252";
  gameArea.insertBefore(timerDiv, questionContainer);

  const questions = [
    {
      question: "What is the normal human body temperature?",
      answers: ["36.5–37.5°C", "38–39°C", "35–36°C", "40°C"],
      correct: 0,
    },
    {
      question: "Which organ is affected by hepatitis?",
      answers: ["Heart", "Liver", "Kidney", "Lung"],
      correct: 1,
    },
    {
      question: "What is the main function of red blood cells?",
      answers: [
        "Fight infection",
        "Carry oxygen",
        "Clot blood",
        "Produce hormones",
      ],
      correct: 1,
    },
    {
      question:
        "Which vitamin is produced when the skin is exposed to sunlight?",
      answers: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
      correct: 3,
    },
    {
      question: "What is the medical term for high blood pressure?",
      answers: ["Hypotension", "Hypertension", "Hyperglycemia", "Hypoglycemia"],
      correct: 1,
    },
  ];

  let currentQuestion = 0;
  let score = 0;
  let timer = null;
  let timeLeft = 15;

  function showConfetti() {
    const confettiColors = ["#4caf50", "#2196f3", "#ffb300", "#ff5252"];
    for (let i = 0; i < 24; i++) {
      const conf = document.createElement("div");
      conf.className = "confetti";
      conf.style.background =
        confettiColors[Math.floor(Math.random() * confettiColors.length)];
      conf.style.left = Math.random() * 100 + "vw";
      conf.style.animationDelay = Math.random() * 0.7 + "s";
      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 1200);
    }
  }

  function startTimer(onTimeout) {
    timeLeft = 15;
    timerDiv.textContent = `⏰ Time left: ${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      timerDiv.textContent = `⏰ Time left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        timerDiv.textContent = "⏰ Time's up!";
        onTimeout();
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
    timerDiv.textContent = "";
  }

  function showQuestion(idx) {
    stopTimer();
    if (idx >= questions.length) {
      questionContainer.innerHTML = `<div class="question">🎉 Game Over! Your score: ${score}/${questions.length}</div>
                <button id="restart-btn" class="animated-btn" style="margin-top:1em;"><i class="fa-solid fa-rotate-left"></i> Restart Game</button>`;
      scoreDiv.textContent = "";
      document.getElementById("restart-btn").onclick = () => {
        currentQuestion = 0;
        score = 0;
        showQuestion(currentQuestion);
      };
      return;
    }
    const q = questions[idx];
    questionContainer.innerHTML = `
            <div class="question">${q.question}</div>
            <div class="answers">
                ${q.answers
                  .map(
                    (ans, i) =>
                      `<button class="answer-btn" data-idx="${i}">${ans}</button>`
                  )
                  .join("")}
            </div>
            <div id="feedback" style="margin-top:1em;min-height:2em;"></div>
        `;
    scoreDiv.textContent = `Score: ${score}`;
    let answered = false;
    function handleAnswer(isCorrect, btn) {
      answered = true;
      stopTimer();
      const feedback = document.getElementById("feedback");
      const correctIndex = q.correct;
      const correctText = q.answers[correctIndex];

      // Highlight all answer buttons: green for correct, red for incorrect
      document.querySelectorAll(".answer-btn").forEach((button, idx) => {
        if (idx === correctIndex) {
          button.style.background = "#4caf50";
          button.style.color = "#fff";
        } else if (button === btn && !isCorrect) {
          button.style.background = "#ff5252";
          button.style.color = "#fff";
        } else {
          button.style.opacity = "0.7";
        }
        button.disabled = true;
      });

      if (isCorrect) {
        score++;
        showConfetti();
        feedback.innerHTML = `<span style="color:#4caf50;font-weight:bold;">✅ Correct!</span>`;
      } else {
        feedback.innerHTML = `<span style="color:#ff5252;font-weight:bold;">❌ Incorrect!</span><br>
      <span style="color:#2196f3;">Correct answer: <b>${correctText}</b></span>`;
      }
      setTimeout(() => {
        showNextButton();
      }, 700);
    }

    function showNextButton() {
      const nextBtn = document.createElement("button");
      nextBtn.textContent = "Next Question";
      nextBtn.className = "animated-btn";
      nextBtn.style.marginTop = "1em";
      nextBtn.onclick = () => {
        currentQuestion++;
        showQuestion(currentQuestion);
      };
      questionContainer.appendChild(nextBtn);
    }

    document.querySelectorAll(".answer-btn").forEach((btn) => {
      btn.addEventListener("click", function () {
        if (answered) return;
        const isCorrect = parseInt(btn.dataset.idx) === q.correct;
        handleAnswer(isCorrect, btn);
      });
    });

    startTimer(() => {
      if (!answered) {
        const feedback = document.getElementById("feedback");
        feedback.innerHTML = `<span style="color:#ff5252;font-weight:bold;">⏰ Time's up!</span>`;
        setTimeout(() => {
          showNextButton();
        }, 700);
      }
    });
  }

  // ...existing code...

if (playBtn) {
  playBtn.addEventListener("click", function () {
    startScreen.style.display = "none";
    gameArea.classList.add("active");
    currentQuestion = 0;
    score = 0;
    showQuestion(currentQuestion);
    quitBtn.style.display = "block"; // Show quit button when game starts
  });
}

// --- Add Quit button ---
let quitBtn = document.createElement("button");
quitBtn.textContent = "Quit";
quitBtn.className = "animated-btn";
quitBtn.style.background = "linear-gradient(90deg,#ff5252,#ffb300)";
quitBtn.style.color = "#fff";
quitBtn.style.fontWeight = "bold";
quitBtn.style.marginTop = "1em";
quitBtn.style.display = "none";
quitBtn.onclick = function () {
  gameArea.classList.remove("active");
  startScreen.style.display = "";
  scoreDiv.textContent = "";
  questionContainer.innerHTML = "";
  timerDiv.textContent = "";
  quitBtn.style.display = "none";
};
gameArea.appendChild(quitBtn);

// ...existing code...
});
