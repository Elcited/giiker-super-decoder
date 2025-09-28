const colors = {
    'red': '#e74c3c',
    'orange': '#e67e22',
    'yellow': '#f1c40f',
    'green': '#2ecc71',
    'cyan': '#1abc9c',
    'blue': '#3498db',
    'purple': '#9b59b6'
};

const lengthToColors = {
    4: ['red', 'green', 'blue', 'purple'],
    5: ['red', 'green', 'blue', 'purple', 'yellow'],
    6: ['red', 'orange', 'green', 'blue', 'purple', 'yellow'],
    7: ['red', 'orange', 'yellow', 'green', 'cyan', 'blue', 'purple']
};

const levels = {
    1: { 
        length: 4, 
        password: ['red', 'blue', 'green', 'purple'],
        maxAttempts: 4
    },
    2: { 
        length: 5, 
        password: ['red', 'yellow', 'blue', 'green', 'purple'],
        maxAttempts: 7
    },
    3: { 
        length: 6, 
        password: ['orange', 'blue', 'red', 'yellow', 'green', 'purple'],
        maxAttempts: 7
    },
    4: { 
        length: 7, 
        password: ['cyan', 'orange', 'purple', 'red', 'yellow', 'blue', 'green'],
        maxAttempts: 7
    }
};

colorsInit()

function colorsInit() {
    for (let level in levels) {
        levels[level].colors = lengthToColors[levels[level].length]
    }
}

const gameState = {
    level: 1,
    currentAttempt: [],
    attempts: [],
    currentRow: 0,
    currentSlotIndex: 0, // 当前行中下一个要填充的槽的索引
    maxAttempts: 7,
    success: false, // 是否已成功通关
    over: false
};

const colorPalette = document.getElementById('color-palette');
const attemptsContainer = document.getElementById('attempts-container');
const resetBtns = document.getElementsByClassName('reset-btn');
const nextBtn = document.getElementById('next-btn');
const levelElement = document.getElementById('level');
const successMessage = document.getElementById('success-message');
const failMessage = document.getElementById('fail-message');
const difficultyToggle = document.getElementById('difficulty-toggle');

function initGame() {
    const currentLevel = levels[gameState.level];
    
    gameState.currentAttempt = Array(currentLevel.length).fill(null);
    gameState.attempts = [];
    gameState.currentRow = 0;
    gameState.currentSlotIndex = 0;
    gameState.maxAttempts = currentLevel.maxAttempts;
    gameState.success = false;
    gameState.over = false;
    
    levelElement.textContent = gameState.level;
    
    generateColorPalette();
    
    generateAttemptsContainer();
    
    successMessage.style.display = 'none';
    failMessage.style.display = 'none';
    nextBtn.style.display = 'none';
}

function generateColorPalette() {
    colorPalette.innerHTML = '';
    const currentLevel = levels[gameState.level];
    
    currentLevel.colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.className = 'color-option';
        colorOption.style.backgroundColor = colors[color];
        colorOption.dataset.color = color;
        
        colorOption.addEventListener('click', () => {
            if (gameState.currentRow >= gameState.maxAttempts || gameState.success || gameState.over) 
                return;
            
            if (gameState.currentAttempt.includes(color)) 
                return;
            
            const currentSlotIndex = gameState.currentSlotIndex;

            if (currentSlotIndex < gameState.currentAttempt.length) {
                gameState.currentAttempt[currentSlotIndex] = color;
                gameState.currentSlotIndex++;
                
                if (gameState.currentSlotIndex >= gameState.currentAttempt.length) {
                    checkPassword()
                }
                
                updateActiveRow();

            }
        });
        
        colorPalette.appendChild(colorOption);
    });
}

function updateActiveRow() {
    // if(gameState.success) return;
    const activeRow = document.getElementById('active-row');
    if (!activeRow) return;
    
    const colorSlots = activeRow.querySelectorAll('.color-slot');
    
    colorSlots.forEach((slot, index) => {
        if (index < gameState.currentAttempt.length) {
            if (gameState.currentAttempt[index]) {
                slot.style.backgroundColor = colors[gameState.currentAttempt[index]];
                slot.textContent = '';
                slot.classList.add('filled');
            } else {
                slot.style.backgroundColor = '#ecf0f1';
                slot.textContent = index + 1;
                slot.classList.remove('filled');
            }
            
            if (!gameState.success || !gameState.over && index === gameState.currentSlotIndex && index < gameState.currentAttempt.length) {
                slot.classList.add('active');
            } else {
                slot.classList.remove('active');
            }
        }
    });
}

function generateAttemptsContainer() {
    attemptsContainer.innerHTML = '';
    const currentLevel = levels[gameState.level];
    const isHardMode = difficultyToggle.checked;
    
    gameState.attempts.forEach((attemptObj, index) => {
        const attemptRow = document.createElement('div');
        attemptRow.className = 'attempt-row';
        
        if (!isHardMode) {
            // 普通模式 - 添加颜色和其下方的长条状灯光
            
        } else {
            // 困难模式
            // 添加颜色
            const attemptColors = document.createElement('div');
            attemptColors.className = 'attempt-colors';
            
            attemptObj.attempt.forEach(color => {
                const colorSlot = document.createElement('div');
                colorSlot.className = 'color-slot filled';
                colorSlot.style.backgroundColor = colors[color];
                attemptColors.appendChild(colorSlot);
            });
            
            attemptRow.appendChild(attemptColors);
            
            // 添加灯光反馈
            const attemptLights = document.createElement('div');
            attemptLights.className = 'attempt-lights';
            
            // 绿色灯（位置正确）
            for (let i = 0; i < attemptObj.feedback.correctPositions; i++) {
                const light = document.createElement('div');
                light.className = 'light green';
                attemptLights.appendChild(light);
            }
            
            // 浅蓝色灯（颜色正确但位置错误）
            for (let i = 0; i < attemptObj.feedback.correctColors; i++) {
                const light = document.createElement('div');
                light.className = 'light blue';
                attemptLights.appendChild(light);
            }
            
            // 填充剩余位置（无灯）
            const totalLights = currentLevel.length;
            const currentLights = attemptObj.feedback.correctPositions + attemptObj.feedback.correctColors;
            for (let i = currentLights; i < totalLights; i++) {
                const light = document.createElement('div');
                light.className = 'light';
                attemptLights.appendChild(light);
            }
            
            attemptRow.appendChild(attemptLights);
        }
        
        attemptsContainer.appendChild(attemptRow);
    });
    
    // 添加当前活动行
    if (gameState.currentRow < gameState.maxAttempts) {
        const activeRow = document.createElement('div');
        if(gameState.success) {
            activeRow.className = 'empty-row';
        } else {
            activeRow.className = 'attempt-row active';
            activeRow.id = 'active-row';
        }
        
        const activeColors = document.createElement('div');
        activeColors.className = gameState.success ? 'empty-colors' : 'attempt-colors';
        
        for (let i = 0; i < currentLevel.length; i++) {
            const colorSlot = document.createElement('div');
            colorSlot.style.cursor = 'default';
            if(!gameState.success && !gameState.over) {
                colorSlot.className = 'color-slot';
                colorSlot.dataset.index = i;
                colorSlot.textContent = i + 1;
                
                // 高亮第一个空槽（仅在未胜利时）
                if (i === gameState.currentSlotIndex) {
                    colorSlot.classList.add('active');
                }
            } else {
                colorSlot.className = 'empty-slot';
            }
            
            activeColors.appendChild(colorSlot);
        }
        
        activeRow.appendChild(activeColors);
        
        // 添加不亮的灯光区域
        const emptyLights = document.createElement('div');
        emptyLights.className = gameState.success ? 'empty-lights': 'attempt-lights';
        
        for (let i = 0; i < currentLevel.length; i++) {
            const light = document.createElement('div');
            light.className = gameState.success ? 'empty-light' :'light';
            emptyLights.appendChild(light);
        }
        
        activeRow.appendChild(emptyLights);
        
        attemptsContainer.appendChild(activeRow);
    }
    
    // 添加剩余尝试的空位
    const remainingAttempts = gameState.maxAttempts - gameState.attempts.length - 
        (gameState.currentRow < gameState.maxAttempts ? 1 : 0);
    for (let i = 0; i < remainingAttempts; i++) {
        const emptyRow = document.createElement('div');
        emptyRow.className = 'empty-row';
        
        // 添加不亮的颜色槽
        const emptyColors = document.createElement('div');
        emptyColors.className = 'empty-colors';
        
        for (let j = 0; j < currentLevel.length; j++) {
            const emptySlot = document.createElement('div');
            emptySlot.className = 'empty-slot';
            emptyColors.appendChild(emptySlot);
        }
        
        emptyRow.appendChild(emptyColors);
        
        // 添加不亮的灯光
        const emptyLights = document.createElement('div');
        emptyLights.className = 'empty-lights';
        
        for (let j = 0; j < currentLevel.length; j++) {
            const emptyLight = document.createElement('div');
            emptyLight.className = 'empty-light';
            emptyLights.appendChild(emptyLight);
        }
        
        emptyRow.appendChild(emptyLights);
        
        attemptsContainer.appendChild(emptyRow);
    }
}

function checkPassword() {
    const currentLevel = levels[gameState.level];
    const feedback = calculateFeedback(gameState.currentAttempt, currentLevel.password);
    
    gameState.attempts.push({
        attempt: [...gameState.currentAttempt],
        feedback: feedback
    });
    // 检查是否通关
    if (feedback.correctPositions === currentLevel.length) {
        successMessage.style.display = 'block';
        nextBtn.style.display = 'block';
        gameState.success = true;
    } else if (gameState.attempts.length >= gameState.maxAttempts) {
        failMessage.style.display = 'block';
        gameState.over = true;
    } else {
        // 重置当前尝试和槽索引
        gameState.currentAttempt = Array(currentLevel.length).fill(null);
        gameState.currentSlotIndex = 0;

    }
        
    gameState.currentRow++;
    generateAttemptsContainer();
}

function calculateFeedback(attempt, password) {
    // 深拷贝密码和尝试，用于标记已匹配的颜色
    const passwordCopy = [...password];
    const attemptCopy = [...attempt];
    
    let correctPositions = 0;
    let correctColors = 0;
    
    // 先检查位置正确的颜色
    for (let i = 0; i < password.length; i++) {
        if (attempt[i] === password[i]) {
            correctPositions++;
            passwordCopy[i] = null; // 标记已匹配
            attemptCopy[i] = null;
        }
    }
    
    // 再检查颜色正确但位置错误的
    for (let i = 0; i < attemptCopy.length; i++) {
        if (attemptCopy[i] !== null) {
            const foundIndex = passwordCopy.indexOf(attemptCopy[i]);
            if (foundIndex !== -1) {
                correctColors++;
                passwordCopy[foundIndex] = null; // 标记已匹配
            }
        }
    }
    
    return {
        correctPositions,
        correctColors
    };
}

[...resetBtns].forEach(btn => btn.addEventListener('click', () => {
    initGame();
}));

nextBtn.addEventListener('click', () => {
    if (levels[gameState.level + 1]) {
        gameState.level++;
        initGame();
    }
});

initGame();