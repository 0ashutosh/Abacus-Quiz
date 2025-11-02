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
function generateNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateOptions(correctAnswer, min, max) {
    const options = new Set([correctAnswer]);
    while (options.size < 4) {
        const wrong = correctAnswer + generateNumber(-5, 5);
        if (wrong !== correctAnswer && wrong >= min && wrong <= max) {
            options.add(wrong);
        }
    }
    return Array.from(options).sort(() => Math.random() - 0.5);
}

// ✅ UPDATED DIFFICULTY LOGIC (scaling & floor division)
function generateQuestion(level) {
    let num1, num2, operation, answer;

    switch (level) {
        case 1: // single number Add and subtract
            num1 = generateNumber(1, 9);
            num2 = generateNumber(1, 9);
            operation = Math.random() < 0.5 ? '+' : '-';
            answer = operation === '+' ? num1 + num2 : num1 - num2;
            break;

        case 2: // double number Add and subtract
            num1 = generateNumber(10, 99);
            num2 = generateNumber(10, 99);
            operation = Math.random() < 0.5 ? '+' : '-';
            answer = operation === '+' ? num1 + num2 : num1 - num2;
            break;

        case 3: // triple number Add and subtract
            num1 = generateNumber(100, 999);
            num2 = generateNumber(100, 999);
            operation = Math.random() < 0.5 ? '+' : '-';
            answer = operation === '+' ? num1 + num2 : num1 - num2;
            break;

        case 4: // single & double add/subtract + multiply
            const ops4 = ['+', '-', '×'];
            operation = ops4[Math.floor(Math.random() * ops4.length)];
            if (operation === '×') {
                num1 = generateNumber(10, 50);
                num2 = generateNumber(5, 20);
                answer = num1 * num2;
            } else {
                num1 = generateNumber(10, 99);
                num2 = generateNumber(10, 99);
                answer = operation === '+' ? num1 + num2 : num1 - num2;
            }
            break;

        case 5: // Add, subtraction, single number, double number, multiply
            const ops5 = ['+', '-', '×'];
            operation = ops5[Math.floor(Math.random() * ops5.length)];
            if (operation === '×') {
                num1 = generateNumber(20, 80);
                num2 = generateNumber(10, 30);
                answer = num1 * num2;
            } else {
                num1 = generateNumber(50, 200);
                num2 = generateNumber(10, 150);
                answer = operation === '+' ? num1 + num2 : num1 - num2;
            }
            break;

        case 6: // Add, subtraction, multiplication, division single number
            const ops6 = ['+', '-', '×', '÷'];
            operation = ops6[Math.floor(Math.random() * ops6.length)];
            if (operation === '÷') {
                num2 = generateNumber(2, 9);
                num1 = generateNumber(num2, num2 * 9);
                answer = Math.floor(num1 / num2);
            } else if (operation === '×') {
                num1 = generateNumber(5, 20);
                num2 = generateNumber(5, 20);
                answer = num1 * num2;
            } else {
                num1 = generateNumber(10, 99);
                num2 = generateNumber(10, 99);
                answer = operation === '+' ? num1 + num2 : num1 - num2;
            }
            break;

        case 7: // Add, subtraction, multiplication, division double number
            const ops7 = ['+', '-', '×', '÷'];
            operation = ops7[Math.floor(Math.random() * ops7.length)];
            if (operation === '÷') {
                num2 = generateNumber(10, 99);
                num1 = generateNumber(num2, num2 * 9);
                answer = Math.floor(num1 / num2);
            } else if (operation === '×') {
                num1 = generateNumber(20, 99);
                num2 = generateNumber(10, 50);
                answer = num1 * num2;
            } else {
                num1 = generateNumber(100, 999);
                num2 = generateNumber(50, 500);
                answer = operation === '+' ? num1 + num2 : num1 - num2;
            }
            break;

        case 8: // any type of question
        default:
            const ops8 = ['+', '-', '×', '÷'];
            operation = ops8[Math.floor(Math.random() * ops8.length)];
            if (operation === '÷') {
                num2 = generateNumber(10, 99);
                num1 = generateNumber(num2, num2 * 20);
                answer = Math.floor(num1 / num2);
            } else if (operation === '×') {
                num1 = generateNumber(50, 999);
                num2 = generateNumber(20, 200);
                answer = num1 * num2;
            } else {
                num1 = generateNumber(500, 5000);
                num2 = generateNumber(100, 2000);
                answer = operation === '+' ? num1 + num2 : num1 - num2;
            }
            break;
    }

    const options = generateOptions(answer, Math.max(0, answer - 10), answer + 10);
    return { num1, num2, operation, answer, options };
}

// Rest of your original code (unchanged)
function updateTotalTime() {
    const totalSeconds = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    document.getElementById('total-time').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

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
    totalTimer = setInterval(updateTotalTime, 1000);
}

function initializeQuiz() {
    const levelGrid = document.querySelector('.level-grid');
    for (let i = 1; i <= 8; i++) {
        const button = document.createElement('button');
        button.className = 'btn-primary';
        button.textContent = `Level ${i}`;
        button.onclick = () => handleLevelSelect(i);
        levelGrid.appendChild(button);
    }
    
    document.getElementById('start-quiz').onclick = startQuiz;
    document.getElementById('retry').onclick = () => showScreen('quizStart');
    document.getElementById('home').onclick = () => showScreen('levelSelect');
    initializeFloatingCalculators();
}

initializeQuiz();
