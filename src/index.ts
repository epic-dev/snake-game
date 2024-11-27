import './styles.css';
import { BaseDirections, settings, SideEffects } from "./settings";
import { FoodItem, TPosition } from "./types";
import { collision, isEaten, moveDown, moveLeft, moveRight, moveUp, produceFoodItem } from './mechanics';
import { createFoodElement, createSnakeSegment } from "./utils";


const Snake: TPosition[] = [settings.startingPosition];

let currentDirection = BaseDirections.Up;

let gameBoard: SVGElement;
let scoreElement: HTMLElement;
let dialogs: HTMLElement[];
let currentFoodItem: FoodItem = produceFoodItem();
let score = 0;
let invertedDirections = false;


// function init() {
//     // initialize board, game settings and initial position 
// }

// FIXME make it a generic object
export function callEffect(effect?: SideEffects): void {
    switch (effect) {
        case SideEffects.InvertedDirections: {
            invertedDirections = true;
            setTimeout(() => {
                invertedDirections = false;
            }, 5000); //FIXME timeout to settings
            break;
        }
        case SideEffects.SpeedBoost: {
            GameSpeed = Math.min(GameSpeed + 5, settings.maxGameSpeed);
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
let afId: number | null = null;
let frameLastUpdateTime = 0;
const Second = 1000;
let GameSpeed = 5; // cells per second
let gameOver = false;

/**
 * Main game loop
 */
function loop(frameCurrentTime: number) {
    if (gameOver) { return; }

    const delta = (frameCurrentTime - frameLastUpdateTime) / Second;

    if (delta < 1 / GameSpeed) {
        afId = requestAnimationFrame(loop);
        return
    }
    frameLastUpdateTime = frameCurrentTime;

    update();

    render();

    afId = requestAnimationFrame(loop);
}
/**
 * Starts the game loop if it is not already running.
 * @returns {number | null} The animation frame ID or null if the game is already running.
 */
function startGame(): number | null {
    // Check if the game loop is not already running
    if (afId === null) {

        afId = requestAnimationFrame(loop);

        dialogs.forEach(dialog => dialog.classList.add('hidden'))
    }
    return null;
}

/**
 * Pauses the game by canceling the animation frame.
 * If `afId` is not null, it means the game is currently running.
 * Cancels the animation frame and sets `afId` to null to indicate the game is paused.
 */
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

        dialogs.forEach(dialog => dialog.classList.remove('hidden'));
    }
}

/** 
 * Entry point
*/
document.addEventListener('DOMContentLoaded', () => {
    gameBoard = document.getElementById('game-board-field') as unknown as SVGElement;
    scoreElement = document.getElementById('score-value') as unknown as HTMLElement;
    dialogs = document.querySelectorAll('.dialog') as unknown as HTMLElement[];

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
                startGame();
                break;
            }
            case 'd':
            case 'ArrowRight': {
                currentDirection = invertedDirections ? moveLeft(currentDirection) : moveRight(currentDirection);
                startGame();
                break;
            }
            case 'a':
            case 'ArrowLeft': {
                currentDirection = invertedDirections ? moveRight(currentDirection) : moveLeft(currentDirection);
                startGame();
                break;
            }
            case 's':
            case 'ArrowDown': {
                currentDirection = invertedDirections ? moveUp(currentDirection) : moveDown(currentDirection);
                startGame();
                break;
            }
            default: break;
        }
    });
    // init();
});

// TODO unit tests
// - food production function
// - next head position function