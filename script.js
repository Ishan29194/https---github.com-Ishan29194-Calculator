class Calculator {
    constructor(previousOperandTextElement, currentOperandTextElement) {
        this.previousOperandTextElement = previousOperandTextElement;
        this.currentOperandTextElement = currentOperandTextElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
    }

    delete() {
        if (this.currentOperand === '0' || this.currentOperand.length === 1) {
            this.currentOperand = '0';
            return;
        }
        if (this.currentOperand === 'Error') {
            this.clear();
            return;
        }
        this.currentOperand = this.currentOperand.toString().slice(0, -1);
    }

    appendNumber(number) {
        if (number === '.' && this.currentOperand.includes('.')) return;
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '' || this.currentOperand === 'Error') return;
        if (this.previousOperand !== '') {
            this.compute();
        }
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        if (isNaN(prev) || isNaN(current)) return;
        switch (this.operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '×':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    this.currentOperand = 'Error';
                    this.operation = undefined;
                    this.previousOperand = '';
                    return;
                }
                computation = prev / current;
                break;
            case '^':
                computation = Math.pow(prev, current);
                break;
            default:
                return;
        }
        // Handle floating point precision issues
        this.currentOperand = Math.round(computation * 1000000000) / 1000000000;
        this.operation = undefined;
        this.previousOperand = '';
    }

    computeSci(operation) {
        if (operation === 'pi') {
            this.currentOperand = Math.PI.toString();
            return;
        }
        
        if (this.currentOperand === '' || this.currentOperand === 'Error') return;
        const current = parseFloat(this.currentOperand);
        if (isNaN(current)) return;
        
        let result;
        switch (operation) {
            case 'sin':
                result = Math.sin(current);
                break;
            case 'cos':
                result = Math.cos(current);
                break;
            case 'tan':
                result = Math.tan(current);
                break;
            case 'log':
                if (current <= 0) {
                    this.currentOperand = 'Error';
                    return;
                }
                result = Math.log10(current);
                break;
            case 'sqrt':
                if (current < 0) {
                    this.currentOperand = 'Error';
                    return;
                }
                result = Math.sqrt(current);
                break;
            case 'square':
                result = Math.pow(current, 2);
                break;
            default:
                return;
        }
        this.currentOperand = (Math.round(result * 1000000000) / 1000000000).toString();
    }

    getDisplayNumber(number) {
        if (number === 'Error') return number;
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', { maximumFractionDigits: 0 });
        }
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        if (this.currentOperand === 'Error') {
            this.currentOperandTextElement.innerText = 'Error';
        } else {
            this.currentOperandTextElement.innerText = this.getDisplayNumber(this.currentOperand);
        }
        
        if (this.operation != null) {
            this.previousOperandTextElement.innerText =
                `${this.getDisplayNumber(this.previousOperand)} ${this.operation}`;
        } else {
            this.previousOperandTextElement.innerText = '';
        }
    }
}

const numberButtons = document.querySelectorAll('[data-number]');
const sciButtons = document.querySelectorAll('[data-sci]');
const operationButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-action="equals"]');
const deleteButton = document.querySelector('[data-action="delete"]');
const clearButton = document.querySelector('[data-action="clear"]');
const previousOperandTextElement = document.getElementById('previous-operand');
const currentOperandTextElement = document.getElementById('current-operand');

const calculator = new Calculator(previousOperandTextElement, currentOperandTextElement);

// Animation helper
const animateClick = (button) => {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = '';
    }, 100);
};

numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
        animateClick(button);
    });
});

sciButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.computeSci(button.dataset.sci);
        calculator.updateDisplay();
        animateClick(button);
    });
});

operationButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.chooseOperation(button.dataset.operator);
        calculator.updateDisplay();
        animateClick(button);
    });
});

equalsButton.addEventListener('click', button => {
    calculator.compute();
    calculator.updateDisplay();
    animateClick(equalsButton);
});

clearButton.addEventListener('click', button => {
    calculator.clear();
    calculator.updateDisplay();
    animateClick(clearButton);
});

deleteButton.addEventListener('click', button => {
    calculator.delete();
    calculator.updateDisplay();
    animateClick(deleteButton);
});

// Add keyboard support
document.addEventListener('keydown', e => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        calculator.appendNumber(e.key);
        calculator.updateDisplay();
        
        // Find and animate button
        const btn = Array.from(numberButtons).find(b => b.dataset.number === e.key);
        if (btn) animateClick(btn);
    }
    if (e.key === '=' || e.key === 'Enter') {
        e.preventDefault();
        calculator.compute();
        calculator.updateDisplay();
        animateClick(equalsButton);
    }
    if (e.key === 'Backspace') {
        calculator.delete();
        calculator.updateDisplay();
        animateClick(deleteButton);
    }
    if (e.key === 'Escape') {
        calculator.clear();
        calculator.updateDisplay();
        animateClick(clearButton);
    }
    if (e.key === '+' || e.key === '-') {
        calculator.chooseOperation(e.key);
        calculator.updateDisplay();
        const btn = Array.from(operationButtons).find(b => b.dataset.operator === e.key);
        if (btn) animateClick(btn);
    }
    if (e.key === '*' || e.key === 'x') {
        calculator.chooseOperation('×');
        calculator.updateDisplay();
        const btn = Array.from(operationButtons).find(b => b.dataset.operator === '×');
        if (btn) animateClick(btn);
    }
    if (e.key === '/') {
        calculator.chooseOperation('÷');
        calculator.updateDisplay();
        const btn = Array.from(operationButtons).find(b => b.dataset.operator === '÷');
        if (btn) animateClick(btn);
    }
});
