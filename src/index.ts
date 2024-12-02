import './styles.css';
import { BaseDirections, settings, SideEffects } from './settings';
import { FoodItem, TPosition, TDirections } from './types';
import { collision, isEaten, moveDown, moveLeft, moveRight, moveUp, produceFoodItem } from './mechanics';
import { createFoodElement, createSnakeSegment } from './utils';
import { timeUnit } from './constants';

// since this ts file transpiles into module, I decided not to use OOP and classes here

let snake: TPosition[];
let currentDirection: TDirections[keyof TDirections];
let gameBoard: SVGElement;
let scoreElement: HTMLElement;
let gameSpeedElement: HTMLElement;
let startGameDialog: HTMLElement;
let restartGameDialog: HTMLElement;
let restartGameBtn: HTMLElement;
let currentFoodItem: FoodItem;
let score: number;
let invertedDirections: boolean;
let afId: number | null;
let frameLastUpdateTime: number;
let gameSpeed: number;
let gameOver: boolean;
let invertedDirectionsId: NodeJS.Timeout | null;

export function callEffect(effect?: SideEffects): void {
    switch (effect) {
        case SideEffects.InvertedDirections: {
            invertedDirections = true;
            if (invertedDirectionsId) {
                clearTimeout(invertedDirectionsId);
            }
            invertedDirectionsId = setTimeout(() => {
                invertedDirections = false;
            }, settings.inverseDirectionsTimeout);
            break;
        }
        case SideEffects.SpeedBoost: {
            gameSpeed = Math.min(gameSpeed + settings.gameSpeedBoostValue, settings.maxGameSpeed);
            gameSpeedElement.innerHTML = String(gameSpeed);
            break;
        }
        default: break;
    }
}

function update() {
    const newHead = {
        x: snake[0].x + (currentDirection?.x ?? BaseDirections.Right.x) * settings.cellSize,
        y: snake[0].y + (currentDirection?.y ?? BaseDirections.Right.y) * settings.cellSize,
    }
    snake.unshift(newHead);

    if (collision(snake)) {
        stopGame();
        return
    }

    if (isEaten(newHead, currentFoodItem)) {
        callEffect(currentFoodItem.effect);
        score += currentFoodItem.points;
        currentFoodItem = produceFoodItem();
    } else {
        snake.pop();
    }
}

function render() {
    const fragment = document.createDocumentFragment();
    scoreElement.innerHTML = String(score);
    gameSpeedElement.innerHTML = String(gameSpeed);
    snake.forEach((s) => {
        const segment = createSnakeSegment(s);
        fragment.appendChild(segment);
    });
    fragment.appendChild(createFoodElement(currentFoodItem));
    gameBoard.innerHTML = '';
    gameBoard.appendChild(fragment);
}

/**
 * Main game loop
 */
function loop(frameCurrentTime: number) {
    if (gameOver) { return; }

    const delta = (frameCurrentTime - frameLastUpdateTime) / timeUnit;

    if (delta < 1 / gameSpeed) {
        afId = requestAnimationFrame(loop);
        return
    }
    frameLastUpdateTime = frameCurrentTime;

    update();

    render();

    afId = requestAnimationFrame(loop);
}

function startGame(): number | null {
    if (afId === null) {
        afId = requestAnimationFrame(loop);
        startGameDialog?.classList.add('hidden'); // TODO: could be controlled by game state
    }
    return null;
}

function pauseGame() {
    if (afId !== null) {
        cancelAnimationFrame(afId);
        afId = null;
    }
}

function stopGame() {
    gameOver = true;

    if (afId !== null) {
        cancelAnimationFrame(afId);
        afId = null;

        restartGameDialog?.classList.remove('hidden');
    }
}

function restartGame() {
    snake.length = 0;
    snake.push(settings.startingPosition);
    currentDirection = BaseDirections.Up;
    currentFoodItem = produceFoodItem();
    score = 0;
    gameOver = false;
    gameSpeed = settings.gameSpeed;
    invertedDirections = false;
    if (afId !== null) {
        cancelAnimationFrame(afId);
    }
    restartGameDialog?.classList.add('hidden');
    afId = null;
    startGame();
}

function init() {
    snake = [settings.startingPosition];
    currentDirection = BaseDirections.Up;
    currentFoodItem = produceFoodItem();
    score = 0;
    invertedDirections = false;
    afId = null;
    frameLastUpdateTime = 0;
    gameSpeed = settings.gameSpeed;
    gameOver = false;
    invertedDirectionsId = null;
}
function initElements() {
    gameBoard = document.getElementById('game-board-field') as unknown as SVGElement;
    scoreElement = document.getElementById('score-value') as unknown as HTMLElement;
    gameSpeedElement = document.getElementById('game-speed-value') as unknown as HTMLElement;
    startGameDialog = document.querySelector('.dialog.welcome-message') as unknown as HTMLElement;
    restartGameDialog = document.querySelector('.dialog.gameover-message') as unknown as HTMLElement;
    restartGameBtn = document.getElementById('restart-game-btn') as unknown as HTMLElement;
}

/** 
 * Entry point
*/
document.addEventListener('DOMContentLoaded', () => {
    init();
    initElements();
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case ' ': {
                if (afId !== null) {
                    pauseGame()
                } else {
                    startGame();
                }
                break;
            }
            case 'w':
            case 'ArrowUp': {
                currentDirection = invertedDirections ? moveDown(currentDirection) : moveUp(currentDirection);
                break;
            }
            case 'd':
            case 'ArrowRight': {
                currentDirection = invertedDirections ? moveLeft(currentDirection) : moveRight(currentDirection);
                break;
            }
            case 'a':
            case 'ArrowLeft': {
                currentDirection = invertedDirections ? moveRight(currentDirection) : moveLeft(currentDirection);
                break;
            }
            case 's':
            case 'ArrowDown': {
                currentDirection = invertedDirections ? moveUp(currentDirection) : moveDown(currentDirection);
                break;
            }
            default: break;
        }
    });
    restartGameBtn.addEventListener('click', (e) => {
        e.preventDefault();
        restartGame();
    });
});
