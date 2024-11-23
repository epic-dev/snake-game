import { Directions, settings } from "./settings";
import { Position } from "./types";
import { createRect } from "./utils";

// enum Food {
//     Cherries,
//     Mushrooms,
//     Pizza,
// }

// enum SideEffects {
//     InvertedDirections,
//     SpeedBoost,
// }

// const FoodSideEffects = new Map<Food, SideEffects>([
//     [Food.Mushrooms, SideEffects.InvertedDirections],
//     [Food.Pizza, SideEffects.SpeedBoost]
// ]);

// const FoodPoints = new Map<Food, number>([
//     [Food.Cherries, 100],
//     [Food.Mushrooms, 350],
//     [Food.Pizza, 400],
// ]);


const GameSpeed = 300;
const Snake: Position[] = [settings.startingPosition];
let currentDirection = Directions.Right; // initial direction: ;
let frame: SVGElement;
let food: Position = produceFood();

function produceFood(): Position {
    const newFood = { x: Math.floor(Math.random() + settings.frameWidth), y: Math.floor(Math.random() + settings.frameHeight)};
    // createRect(newFood);
    return newFood;
}

function init() {
    // initialize board, game settings and initial position 
    console.log('init global vars')
}

function update() {
    // update game settings, snake positioning and food cells position
    const newHead = {
        x: Snake[0].x + currentDirection.x * settings.cellSize,
        y: Snake[0].y + currentDirection.y * settings.cellSize,
    }
    Snake.unshift(newHead);
    if (newHead.x === food.x && newHead.y === food.y) {
        food = produceFood();
    } else {
        Snake.pop();
    }

    
    // stop game if new head position is equal frame border position
}


function createSnakeSegment(pos: Position): SVGRectElement {
    const snakeSegmentSize = settings.cellSize;
    const snakeColor = settings.color;
    return createRect({
        position: pos,
        size: snakeSegmentSize,
        color: snakeColor,
    });
}
function createFoodElement(food: Position): SVGRectElement {
    return createRect({
        position: food,
        size: settings.cellSize,
        color: 'red',
    });
}
function render() {
    frame.innerHTML = '';
    Snake.forEach((s) => {
        const segment = createSnakeSegment(s);
        frame.appendChild(segment)
    });
    frame.appendChild(createFoodElement(food))
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

let isRunning = false;
let timeoutId: number;
/**
 * Game starter
 */
function loop() {
    update();
    render();
    timeoutId = setTimeout(loop, GameSpeed);
}

function start(): number | null {
    if (!isRunning) {
        isRunning = true;
        loop();
    }
    return null;
}
function pause(game: number) {
    if (isRunning) {
        clearTimeout(game);
        isRunning = false;
    }
}

/** 
 * Entry point
*/
document.addEventListener('DOMContentLoaded', () => {
    frame = document.getElementById('frame') as unknown as SVGElement;
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case ' ': {
                if (isRunning) {
                    pause(timeoutId)
                } else start();
                break;
            }
            case 'w':
            case 'ArrowUp': {
                currentDirection = Directions.Up;
                if (!isRunning) { start(); }
                break;
            }
            case 'd':
            case 'ArrowRight': {
                currentDirection = Directions.Right;
                if (!isRunning) { start(); }
                break;
            }
            case 'a':
            case 'ArrowLeft': {
                currentDirection = Directions.Left;
                if (!isRunning) { start(); }
                break;
            }
            case 's':
            case 'ArrowDown': {
                currentDirection = Directions.Down;
                if (!isRunning) { start(); }
                break;
            }
        }
    });
    init();
});