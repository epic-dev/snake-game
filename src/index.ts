import './styles.css';
import { BaseDirections, FoodPoints, FoodSideEffects, settings, SideEffects } from "./settings";
import { FoodItem, Mutable, TDirections, TPosition } from "./types";
import { createRect, createUseElement } from "./utils";
import { isEaten, getRandomPosition, getRandomFood } from './mechanics';


const Snake: TPosition[] = [settings.startingPosition];

const currentDirections: Mutable<TDirections> = BaseDirections;

let currentDirection = currentDirections.Up;

let gameBoard: SVGElement;
let scoreElement: HTMLElement;
let dialogs: HTMLElement[];
let currentFoodItem: FoodItem = produceFoodItem();
let score = 0;
let invertedDirections = false;


function produceFoodItem(): FoodItem {
    const position = getRandomPosition();
    const { ref, food } = getRandomFood();
    // TODO: verify food position to be outside snake segments and not correlated with other food items
    return {
        position,
        points: FoodPoints.get(food)!,
        effect: FoodSideEffects.get(food),
        ref: `#${ref}`,
    };
}

function init() {
    // initialize board, game settings and initial position 
}

// FIXME make it a generic object
function callEffect(effect?: SideEffects): void {
    switch (effect) {
        case SideEffects.InvertedDirections: {
            invertedDirections = true;
            setTimeout(() => {
                invertedDirections = false;
            }, 5000); //FIXME timeout to settings
            break;
        }
        case SideEffects.SpeedBoost: {
            GameSpeed += 5;
            break;
        }
        default: break;
    }
}

function update() {
    // update game settings, snake positioning and food cells position
    const newHead = {
        x: Snake[0].x + (currentDirection?.x ?? 1) * settings.cellSize,
        y: Snake[0].y + (currentDirection?.y ?? 0) * settings.cellSize,
    }
    Snake.unshift(newHead);

    if (isEaten(newHead, currentFoodItem)) {
        currentFoodItem = produceFoodItem();
        score += currentFoodItem.points;
        callEffect(currentFoodItem.effect);
    } else {
        Snake.pop();
    }
    // console.log(currentDirection === currentDirections.Left ? 'Left' : currentDirection === currentDirections.Right ? 'Right' : currentDirection === currentDirections.Up ? 'Up' : 'Down');
    // stop game if new head position is equal frame border position
}


function createSnakeSegment(pos: TPosition): SVGRectElement {
    const snakeSegmentSize = settings.cellSize;
    const snakeColor = settings.snakeColor;
    return createRect({
        position: pos,
        size: snakeSegmentSize,
        color: snakeColor,
    });
}
function createFoodElement(foodItem: FoodItem): SVGRectElement | SVGUseElement {
    return createUseElement({ position: foodItem.position, ref: foodItem.ref });
}
function render() {
    gameBoard.innerHTML = '';
    scoreElement.innerHTML = String(score);
    // TODO: probably it is better to build elements first and then append them
    Snake.forEach((s) => {
        const segment = createSnakeSegment(s);
        gameBoard.appendChild(segment)
    });
    gameBoard.appendChild(createFoodElement(currentFoodItem))
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

let isStarted = false;
let afId: number | null = null;
let frameLastUpdateTime = 0;
const Second = 1000;
let GameSpeed = 5; // cells per second
/**
 * Game starter
 */
function loop(frameCurrentTime: number) {
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

function start(): number | null {
    if (afId === null) {
        isStarted = true;
        afId = requestAnimationFrame(loop);
        dialogs.forEach(dialog => dialog.classList.add('hidden'))
    }
    return null;
}
function pause() {
    if (afId !== null) {
        cancelAnimationFrame(afId);
        afId = null;
    }
}
function moveUp() {
    if (currentDirection !== currentDirections.Down)
        currentDirection = currentDirections.Up;
}
function moveDown() {
    if (currentDirection !== currentDirections.Up)
        currentDirection = currentDirections.Down;
}
function moveRight() {
    if (currentDirection !== currentDirections.Left)
        currentDirection = currentDirections.Right;
}
function moveLeft() {
    if (currentDirection !== currentDirections.Right)
        currentDirection = currentDirections.Left;
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
                    pause()
                } else {
                    start();
                }
                break;
            }
            case 'w':
            case 'ArrowUp': {
                if (invertedDirections) { moveDown() } else moveUp();
                start();
                break;
            }
            case 'd':
            case 'ArrowRight': {
                if (invertedDirections) { moveLeft() } else moveRight();
                start();
                break;
            }
            case 'a':
            case 'ArrowLeft': {
                if (invertedDirections) { moveRight() } else moveLeft();
                start();
                break;
            }
            case 's':
            case 'ArrowDown': {
                if (invertedDirections) { moveUp() } else moveDown();
                start();
                break;
            }
            default: {
                console.log('default');
                // welcomeMessage.classList.add('hidden');
                break;
            }
        }
    });
    init();
});

// TODO unit tests
// - food production function
// - next head position function