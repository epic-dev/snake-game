import { Directions, Food, FoodPoints, FoodSideEffects, settings, SideEffects } from "./settings";
import { Direction, Position } from "./types";
import { createRect, getRandomPosition } from "./utils";


const Snake: Position[] = [settings.startingPosition];

let currentDirection: Direction['Left'] | Direction['Right'] | Direction['Up'] | Direction['Down'] | null = null

let pane: SVGElement;
let scoreElement: HTMLElement;
let food: FoodItem = produceFoodItem(Food.Cherries);
let score = 0;

type FoodItem = {
    position: Position,
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

function update() {
    // update game settings, snake positioning and food cells position
    const newHead = {
        x: Snake[0].x + (currentDirection?.x ?? 1) * settings.cellSize,
        y: Snake[0].y + (currentDirection?.y ?? 0) * settings.cellSize,
    }
    Snake.unshift(newHead);
    if (newHead.x === food.position.x && newHead.y === food.position.y) {
        food = produceFoodItem(Food.Cherries); //FIXME based on answer
        score += food.points;
    } else {
        Snake.pop();
    }

    
    // stop game if new head position is equal frame border position
}


function createSnakeSegment(pos: Position): SVGRectElement {
    const snakeSegmentSize = settings.cellSize;
    const snakeColor = settings.snakeColor;
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
const GameSpeed = 10; // cells per second
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

/** 
 * Entry point
*/
document.addEventListener('DOMContentLoaded', () => {
    pane = document.getElementById('frame') as unknown as SVGElement;
    scoreElement = document.getElementById('score-value') as unknown as HTMLElement;
    document.addEventListener('keydown', (e) => {
        switch (e.key) {
            case ' ': {
                if (afId !== null) {
                    pause()
                } else start();
                break;
            }
            case 'w':
            case 'ArrowUp': {
                if (currentDirection !== Directions.Down)
                    currentDirection = Directions.Up;
                if (afId === null)
                    start();
                break;
            }
            case 'd':
            case 'ArrowRight': {
                if (currentDirection !== Directions.Left)
                    currentDirection = Directions.Right;
                if (afId === null)
                    start();
                break;
            }
            case 'a':
            case 'ArrowLeft': {
                if (currentDirection !== Directions.Right)
                    currentDirection = Directions.Left;
                if (afId === null)
                    start();
                break;
            }
            case 's':
            case 'ArrowDown': {
                if (currentDirection !== Directions.Up)
                    currentDirection = Directions.Down;
                if (!afId)
                    start();
                break;
            }
        }
    });
    init();
});

// TODO unit tests
// - food production function
// - next head position function