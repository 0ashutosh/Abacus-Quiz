// Quiz state
let currentLevel = 0;
let currentQuestion = null;
let questionNumber = 1;
let correctAnswers = 0;
let timeLeft = 3;
let timer = null;
let startTime = null;
let totalTimer = null;

// DOM Elements
const screens = {
    levelSelect: document.getElementById('level-select'),
    quizStart: document.getElementById('quiz-start'),
    quiz: document.getElementById('quiz'),
    results: document.getElementById('results')
};

// Initialize floating calculators
function initializeFloatingCalculators() {
    const containers = document.querySelectorAll('.floating-calculators');
    const calculatorSVG = `
        <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <line x1="8" x2="16" y1="6" y2="6" />
            <line x1="16" x2="16" y1="14" y2="18" />
            <line x1="16" x2="16" y1="10" y2="10" />
            <line x1="12" x2="12" y1="14" y2="18" />
            <line x1="12" x2="12" y1="10" y2="10" />
            <line x1="8" x2="8" y1="14" y2="18" />
            <line x1="8" x2="8" y1="10" y2="10" />
        </svg>
    `;
    
    containers.forEach(container => {
        for (let i = 0; i < 15; i++) {
            const div = document.createElement('div');
            div.style.position = 'absolute';
            div.style.left = `${Math.random() * 100}%`;
            div.style.top = `${Math.random() * 100}%`;
            div.style.animation = `float ${10 + Math.random() * 10}s linear infinite`;
            div.style.animationDelay = `-${Math.random() * 10}s`;
            div.style.opacity = '0.1';
            div.style.color = 'white';
            div.innerHTML = calculatorSVG;
            container.appendChild(div);
        }
    });
}

// Quiz logic
function generateQuestion(level) {
    let num1, num2, operation, answer;

    switch (level) {
        case 1: // Level 1: single number add & subtract
            num1 = generateNumber(1, 9);
            num2 = generateNumber(1, 9);
            operation = Math.random() < 0.5 ? '+' : '-';
            if (operation === '-' && num2 > num1) [num1, num2] = [num2, num1];
            answer = operation === '+' ? num1 + num2 : num1 - num2;
            break;

        case 2: // Level 2: double number add & subtract
            num1 = generateNumber(10, 99);
            num2 = generateNumber(10, 99);
            operation = Math.random() < 0.5 ? '+' : '-';
            if (operation === '-' && num2 > num1) [num1, num2] = [num2, num1];
            answer = operation === '+' ? num1 + num2 : num1 - num2;
            break;

        case 3: // Level 3: triple number add & subtract
            num1 = generateNumber(100, 999);
            num2 = generateNumber(100, 999);
            operation = Math.random() < 0.5 ? '+' : '-';
            if (operation === '-' && num2 > num1) [num1, num2] = [num2, num1];
            answer = operation === '+' ? num1 + num2 : num1 - num2;
            break;

        case 4: // Level 4: single/double number add, subtract, multiply
            const ops4 = ['+', '-', '×'];
            operation = ops4[Math.floor(Math.random() * ops4.length)];
            num1 = generateNumber(1, Math.random() < 0.5 ? 9 : 99);
            num2 = generateNumber(1, Math.random() < 0.5 ? 9 : 99);
            if (operation === '-') {
                if (num2 > num1) [num1, num2] = [num2, num1];
                answer = num1 - num2;
            } else if (operation === '+') {
                answer = num1 + num2;
            } else {
                answer = num1 * num2;
            }
            break;

        case 5: // Level 5: add, subtract, multiply with single/double number
            const ops5 = ['+', '-', '×'];
            operation = ops5[Math.floor(Math.random() * ops5.length)];
            num1 = generateNumber(1, Math.random() < 0.5 ? 9 : 99);
            num2 = generateNumber(1, Math.random() < 0.5 ? 9 : 99);
            if (operation === '-') {
                if (num2 > num1) [num1, num2] = [num2, num1];
                answer = num1 - num2;
            } else if (operation === '+') {
                answer = num1 + num2;
            } else {
                answer = num1 * num2;
            }
            break;

        case 6: // Level 6: add, subtract, multiply, divide single number
            const ops6 = ['+', '-', '×', '÷'];
            operation = ops6[Math.floor(Math.random() * ops6.length)];
            num1 = generateNumber(1, 9);
            num2 = generateNumber(1, 9);
            if (operation === '-') {
                if (num2 > num1) [num1, num2] = [num2, num1];
                answer = num1 - num2;
            } else if (operation === '+') {
                answer = num1 + num2;
            } else if (operation === '×') {
                answer = num1 * num2;
            } else {
                answer = num1 * num2;
                operation = '÷';
                [num1, answer] = [answer, num2];
            }
            break;

        case 7: // Level 7: add, subtract, multiply, divide double number
            const ops7 = ['+', '-', '×', '÷'];
            operation = ops7[Math.floor(Math.random() * ops7.length)];
            num1 = generateNumber(10, 99);
            num2 = generateNumber(10, 99);
            if (operation === '-') {
                if (num2 > num1) [num1, num2] = [num2, num1];
                answer = num1 - num2;
            } else if (operation === '+') {
                answer = num1 + num2;
            } else if (operation === '×') {
                answer = num1 * num2;
            } else {
                num2 = generateNumber(2, 9);
                answer = generateNumber(2, 9);
                num1 = num2 * answer;
                operation = '÷';
            }
            break;

        case 8: // Level 8: any type of question
            const allOps = ['+', '-', '×', '÷'];
            operation = allOps[Math.floor(Math.random() * allOps.length)];
            num1 = generateNumber(1, 999);
            num2 = generateNumber(1, 999);
            if (operation === '-') {
                if (num2 > num1) [num1, num2] = [num2, num1];
                answer = num1 - num2;
            } else if (operation === '+') {
                answer = num1 + num2;
            } else if (operation === '×') {
                num1 = generateNumber(2, 99);
                num2 = generateNumber(2, 20);
                answer = num1 * num2;
            } else {
                num2 = generateNumber(2, 12);
                answer = generateNumber(2, 12);
                num1 = num2 * answer;
            }
            break;

        default:
            num1 = 1; num2 = 1; operation = '+'; answer = 2;
    }

    const options = generateOptions(answer, Math.max(0, answer - 10), answer + 10);
    return { num1, num2, operation, answer, options };
}

function updateTotalTime() {
    const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    document.getElementById('total-time').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

// UI Updates
function showScreen(screenId) {
    Object.values(screens).forEach(screen => screen.classList.add('hidden'));
    screens[screenId].classList.remove('hidden');
}

function updateQuizUI() {
    document.getElementById('num1').textContent = currentQuestion.num1;
    document.getElementById('operation').textContent = currentQuestion.operation;
    document.getElementById('num2').textContent = currentQuestion.num2;
    document.getElementById('question-number').textContent = questionNumber;
    document.getElementById('current-level').textContent = currentLevel;
    
    const optionsContainer = document.querySelector('.options');
    optionsContainer.innerHTML = '';
    currentQuestion.options.forEach(option => {
        const button = document.createElement('button');
        button.className = 'btn-primary';
        button.textContent = option;
        button.onclick = () => handleAnswer(option);
        optionsContainer.appendChild(button);
    });
}

function updateTimer() {
    document.getElementById('time-left').textContent = timeLeft;
    if (timeLeft === 0) {
        handleAnswer(-1);
    }
}

function showResults() {
    clearInterval(timer);
    clearInterval(totalTimer);
    
    const timeTaken = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    const percentage = (correctAnswers / 100) * 100;
    
    document.getElementById('result-level').textContent = currentLevel;
    document.getElementById('retry-level').textContent = currentLevel;
    document.getElementById('correct-answers').textContent = correctAnswers;
    document.getElementById('percentage').textContent = percentage.toFixed(1);
    document.getElementById('time-taken').textContent = `${minutes}m ${seconds}s`;
    
    showScreen('results');
}

// Event Handlers
function handleLevelSelect(level) {
    currentLevel = level;
    document.getElementById('selected-level').textContent = level;
    showScreen('quizStart');
}

function handleAnswer(answer) {
    clearInterval(timer);
    if (answer === currentQuestion.answer) {
        correctAnswers++;
    }
    
    if (questionNumber < 100) {
        questionNumber++;
        startQuestion();
    } else {
        showResults();
    }
}

function startQuestion() {
    timeLeft = 6;
    currentQuestion = generateQuestion(currentLevel);
    updateQuizUI();
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
    }, 1000);
}

function startQuiz() {
    questionNumber = 1;
    correctAnswers = 0;
    startTime = Date.now();
    showScreen('quiz');
    startQuestion();
    
    // Start total time counter
    totalTimer = setInterval(updateTotalTime, 1000);
}

// Initialize the quiz
function initializeQuiz() {
    const levelGrid = document.querySelector('.level-grid');
    for (let i = 0; i < 9; i++) {
        const button = document.createElement('button');
        button.className = 'btn-primary';
        button.textContent = `Level ${i}`;
        button.onclick = () => handleLevelSelect(i);
        levelGrid.appendChild(button);
    }
    
    document.getElementById('start-quiz').onclick = startQuiz;
    document.getElementById('retry').onclick = () => {
        showScreen('quizStart');
    };
    document.getElementById('home').onclick = () => {
        showScreen('levelSelect');
    };
    
    initializeFloatingCalculators();
}

// Start the application
initializeQuiz();
