import { BaseDirections, Food, FoodPoints, FoodSideEffects, settings } from './settings';
import { FoodItem, TPosition } from './types';

export function isEaten(headPosition: TPosition, food: FoodItem): boolean {
    const equalPositions = headPosition.x === food.position.x && headPosition.y === food.position.y;
    const isSurroundingsOfX = headPosition.x <= food.position.x + settings.cellSize && headPosition.x > food.position.x - settings.cellSize;
    const isSurroundingsOfY = headPosition.y <= food.position.y + settings.cellSize && headPosition.y > food.position.y - settings.cellSize;

    return equalPositions || (isSurroundingsOfX && isSurroundingsOfY);
}

// TODO unit tests
export function collision(snake: TPosition[]): boolean {
    const headPosition = snake[0];
    const tail = snake.slice(1);
    const collideX = headPosition.x < 0 || headPosition.x >= settings.frameWidth * settings.cellSize;
    const collideY = headPosition.y < 0 || headPosition.y >= settings.frameHeight * settings.cellSize;

    return collideX || collideY || !!tail.find(t => t.x === headPosition.x && t.y === headPosition.y);
}

// TODO unit tests to check corner cases: of frame size, cell size
export function getFoodRandomPosition(): TPosition {
    const maxX = settings.frameWidth * settings.cellSize - settings.foodItemSize;
    const maxY = settings.frameHeight * settings.cellSize - settings.foodItemSize;
    return {
        x: Math.floor(Math.random() * (maxX / settings.cellSize + 1)) * settings.cellSize,
        y: Math.floor(Math.random() * (maxY / settings.cellSize + 1)) * settings.cellSize,
    };
}

export function getRandomFood(): { ref: string, food: Food} {
    const reverseMappingIndex = Math.floor(Math.random() * settings.numberOfAllFoodItems);
    const ref = Food[reverseMappingIndex];

    if (!ref) {
        // just in case :)
        return { ref: Food[0], food: 0 }
    }

    return {
        ref,
        food: reverseMappingIndex,
    };
}

export function produceFoodItem(): FoodItem {
    const position = getFoodRandomPosition();
    const { ref, food } = getRandomFood();
    // TODO: verify food position to be outside snake segments and not correlated with other food items
    return {
        position,
        points: FoodPoints.get(food)!,
        effect: FoodSideEffects.get(food),
        ref: `#${ref}`,
    };
}

export function moveUp(currentDirection: { [key in keyof TPosition]: TPosition[key]; }) {
    if (currentDirection !== BaseDirections.Down)
        currentDirection = BaseDirections.Up;
    return currentDirection;
}
export function moveDown(currentDirection: { [key in keyof TPosition]: TPosition[key]; }) {
    if (currentDirection !== BaseDirections.Up)
        currentDirection = BaseDirections.Down;
    return currentDirection;
}
export function moveRight(currentDirection: { [key in keyof TPosition]: TPosition[key]; }) {
    if (currentDirection !== BaseDirections.Left)
        currentDirection = BaseDirections.Right;
    return currentDirection;
}
export function moveLeft(currentDirection: { [key in keyof TPosition]: TPosition[key]; }) {
    if (currentDirection !== BaseDirections.Right)
        currentDirection = BaseDirections.Left;
    return currentDirection;
}