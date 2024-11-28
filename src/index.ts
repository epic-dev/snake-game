import './styles.css';
import { BaseDirections, settings, SideEffects } from './settings';
import { FoodItem, TPosition } from './types';
import { collision, isEaten, moveDown, moveLeft, moveRight, moveUp, produceFoodItem } from './mechanics';
import { createFoodElement, createSnakeSegment } from './utils';


const Snake: TPosition[] = [settings.startingPosition];

let currentDirection = BaseDirections.Up;

let gameBoard: SVGElement;
let scoreElement: HTMLElement;
let gameSpeedElement: HTMLElement;
let startGameDialog: HTMLElement;
let restartGameDialog: HTMLElement;
let restartGameBtn: HTMLElement;
let currentFoodItem: FoodItem = produceFoodItem();
let score = 0;
let invertedDirections = false;
let afId: number | null = null;
let frameLastUpdateTime = 0;
const Second = 1000;
let gameSpeed = settings.gameSpeed;
let gameOver = false;


// function init() {
//     // initialize board, game settings and initial position 
// }

// FIXME make it a generic object
export function callEffect(effect?: SideEffects): void {
    switch (effect) {
        case SideEffects.InvertedDirections: {
            invertedDirections = true;
            setTimeout(() => { // cancel previous timeout in case it is running
                invertedDirections = false;
            }, 5000); //FIXME timeout to settings
            break;
        }
        case SideEffects.SpeedBoost: {
            gameSpeed = Math.min(gameSpeed + 5, settings.maxGameSpeed);
            gameSpeedElement.innerHTML = String(gameSpeed);
            break;
        }
        default: break;
    }
}

function update() {
    // update game settings, snake positioning and food cells position
    const newHead = {
        x: Snake[0].x + (currentDirection?.x ?? BaseDirections.Right.x) * settings.cellSize,
        y: Snake[0].y + (currentDirection?.y ?? BaseDirections.Right.y) * settings.cellSize,
    }
    Snake.unshift(newHead);

    if (collision(Snake)) {
        stopGame();
        return
    }

    if (isEaten(newHead, currentFoodItem)) {
        callEffect(currentFoodItem.effect);
        score += currentFoodItem.points;
        currentFoodItem = produceFoodItem();
    } else {
        Snake.pop();
    }
}

function render() {
    const fragment = document.createDocumentFragment();
    scoreElement.innerHTML = String(score);
    Snake.forEach((s) => {
        const segment = createSnakeSegment(s);
        fragment.appendChild(segment);
    });
    fragment.appendChild(createFoodElement(currentFoodItem));
    gameBoard.innerHTML = '';
    gameBoard.appendChild(fragment);
}

// enum GameStates {
//     NotStarted,
//     Running,
//     Paused,
//     Finished,
// }

// type GameState = {
//     running: boolean,
//     started: boolean,
//     paused: boolean,
//     finished: boolean,
// }

// const GameStateMap = new Map<GameStates, GameState>([
//     [GameStates.NotStarted, {
//         running: false,
//         started: false,
//         paused: false,
//         finished: false,
//     }]
// ]);

// let isStarted = false;

/**
 * Main game loop
 */
function loop(frameCurrentTime: number) {
    if (gameOver) { return; }

    const delta = (frameCurrentTime - frameLastUpdateTime) / Second;

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
    // Check if the game loop is not already running
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
    Snake.length = 0;
    Snake.push(settings.startingPosition);
    currentDirection = BaseDirections.Up;
    currentFoodItem = produceFoodItem();
    score = 0;
    gameOver = false;
    gameSpeed = settings.gameSpeed;
    if (afId !== null) {
        cancelAnimationFrame(afId);
    }
    restartGameDialog?.classList.add('hidden');
    afId = null;
    startGame();
}

/** 
 * Entry point
*/
document.addEventListener('DOMContentLoaded', () => {
    gameBoard = document.getElementById('game-board-field') as unknown as SVGElement;
    scoreElement = document.getElementById('score-value') as unknown as HTMLElement;
    gameSpeedElement = document.getElementById('game-speed-value') as unknown as HTMLElement;
    startGameDialog = document.querySelector('.dialog.welcome-message') as unknown as HTMLElement;
    restartGameDialog = document.querySelector('.dialog.gameover-message') as unknown as HTMLElement;
    restartGameBtn = document.getElementById('restart-game-btn') as unknown as HTMLElement;

    gameSpeedElement.innerHTML = String(gameSpeed);

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
    // init();
});

// TODO unit tests
// - food production function
// - next head position function