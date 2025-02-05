class ColorGame {
    constructor() {
        this.score = 0;
        this.colors = [
            '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
            '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB',
            '#FF9F43', '#58B19F', '#2ECC71', '#E74C3C'
        ];
        

        this.initializeElements();
        this.setupEventListeners();
        this.resetGame();
    }

    initializeElements() {
        this.colorDisplay = document.querySelector('.color-display');
        this.optionsRow = document.querySelector('.options-row');
        this.scoreDisplay = document.querySelector('.score');
        this.statusDisplay = document.querySelector('.status');
        this.newGameButton = document.querySelector('.new-game-btn');
    }

    setupEventListeners() {
        this.newGameButton.addEventListener('click', () => this.resetGame());

        document.addEventListener('keydown', (e) => {
            const num = parseInt(e.key);
            if (num >= 1 && num <= 6) {
                const option = this.optionsRow.children[num - 1];
                if (option) {
                    // Get the computed style to ensure consistent color format
                    const computedColor = getComputedStyle(option).backgroundColor;
                    const targetComputedColor = getComputedStyle(this.colorDisplay).backgroundColor;
                    
                    // Compare the computed RGB values
                    if (computedColor === targetComputedColor) {
                        this.handleGuess(this.targetColor, option);
                    } else {
                        this.handleGuess(computedColor, option);
                    }
                }
            }
        });
    }

    
    getRandomColor() {
        return this.colors[Math.floor(Math.random() * this.colors.length)];
    }

    generateColorOptions() {
        const options = [this.targetColor];
        while (options.length < 6) {
            const color = this.getRandomColor();
            if (!options.includes(color)) {
                options.push(color);
            }
        }
        return this.shuffleArray(options);
    }

    shuffleArray(array) {
        return array.sort(() => Math.random() - 0.5);
    }

    createColorOption(color, index) {
        const button = document.createElement('button');
        button.setAttribute('data-testid', 'colorOption');
        button.className = 'color-option';
        button.style.backgroundColor = color;
        button.title = `Option ${index + 1} (Press ${index + 1})`;

        button.addEventListener('click', () => {
            // Use the same comparison method for click events
            const computedColor = getComputedStyle(button).backgroundColor;
            const targetComputedColor = getComputedStyle(this.colorDisplay).backgroundColor;
            
            if (computedColor === targetComputedColor) {
                this.handleGuess(this.targetColor, button);
            } else {
                this.handleGuess(computedColor, button);
            }
        });
        return button;
    }

    handleGuess(color, button) {
        if (color === this.targetColor) {
            this.score++;
            this.animateScore();
            this.showStatus('Correct! 🎉', 'correct');
            button.classList.add('correct');
            setTimeout(() => this.startNewGame(), 500);
        } else {
            this.showStatus('Try again!', 'wrong');
            button.classList.add('wrong');
            setTimeout(() => button.classList.remove('wrong'), 400);
        }
    }

    animateScore() {
        
        const increment = document.createElement('span');
        increment.className = 'score-increment';
        increment.textContent = '+1';
        this.scoreDisplay.appendChild(increment);

        this.scoreDisplay.classList.add('animate');
        this.scoreDisplay.textContent = `Score: ${this.score}`;

        
        setTimeout(() => {
            this.scoreDisplay.classList.remove('animate');
            increment.remove();
        }, 1000);
    }

    showStatus(message, type) {
        this.statusDisplay.textContent = message;
        this.statusDisplay.className = 'status visible';
        this.statusDisplay.style.color = type === 'correct' ? '#4CAF50' : '#F44336';

        setTimeout(() => {
            this.statusDisplay.classList.remove('visible');
        }, 1500);
    }

    resetGame() {
        this.score = 0; 
        this.startNewGame();
    }

    startNewGame() {
        this.targetColor = this.getRandomColor();
        this.colorDisplay.style.backgroundColor = this.targetColor;
        
        this.optionsRow.innerHTML = '';
        const options = this.generateColorOptions();
        options.forEach((color, index) => {
            this.optionsRow.appendChild(this.createColorOption(color, index));
        });

        this.scoreDisplay.textContent = `Score: ${this.score}`;
    }
}

new ColorGame();