import './styles.css';
import { BaseDirections, Food, FoodPoints, FoodSideEffects, settings, SideEffects } from "./settings";
import { Mutable, TDirections, TPosition } from "./types";
import { createRect, getRandomPosition } from "./utils";


const Snake: TPosition[] = [settings.startingPosition];

const currentDirections: Mutable<TDirections> = BaseDirections;

let currentDirection = currentDirections.Up;

let pane: SVGElement;
let scoreElement: HTMLElement;
let food: FoodItem = produceFoodItem(Food.Cherries);
let score = 0;
let invertedDirections = false;

type FoodItem = {
    position: TPosition,
    points: number,
    effect?: SideEffects,
}
function produceFoodItem(food: Food): FoodItem {
    const newFoodPosition = getRandomPosition()
// TODO: verify food position to be outside snake segments and not correlated with other food items
    return {
        position: newFoodPosition,
        points: FoodPoints.get(food)!,
        effect: FoodSideEffects.get(food),
    };
}

function init() {
    // initialize board, game settings and initial position 
}

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
    if (newHead.x === food.position.x && newHead.y === food.position.y) {
        food = produceFoodItem(Food.Mushrooms); //FIXME based on answer
        score += food.points;
        callEffect(food.effect);
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
function createFoodElement(food: TPosition): SVGRectElement {
    return createRect({
        position: food,
        size: settings.cellSize,
        color: 'red',
    });
}
function render() {
    pane.innerHTML = '';
    scoreElement.innerHTML = String(score);
    // TODO: probably it is better to build elements first and then append them
    Snake.forEach((s) => {
        const segment = createSnakeSegment(s);
        pane.appendChild(segment)
    });
    pane.appendChild(createFoodElement(food.position))
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
        afId = requestAnimationFrame(loop);
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
    pane = document.getElementById('game-board') as unknown as SVGElement;
    scoreElement = document.getElementById('score-value') as unknown as HTMLElement;
    const welcomeMessage = document.getElementById('welcome-message') as unknown as HTMLElement;
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
                welcomeMessage.classList.add('hidden');
                break;
            }
        }
    });
    init();
});

// TODO unit tests
// - food production function
// - next head position function