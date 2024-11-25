import { Food, settings } from "./settings";
import { FoodItem, TPosition } from "./types";

export function isEaten(headPosition: TPosition, food: FoodItem): boolean {
    const equalPositions = headPosition.x === food.position.x && headPosition.y === food.position.y;
    const isSurroundingsOfX = headPosition.x <= food.position.x + settings.cellSize && headPosition.x > food.position.x - settings.cellSize;
    const isSurroundingsOfY = headPosition.y <= food.position.y + settings.cellSize && headPosition.y > food.position.y - settings.cellSize;

    return equalPositions || (isSurroundingsOfX && isSurroundingsOfY);
}
// TODO unit tests to check corner cases: of frame size, cell size
export function getRandomPosition(): TPosition {
    const maxX = settings.frameWidth * settings.cellSize - settings.cellSize;
    const maxY = settings.frameHeight * settings.cellSize - settings.cellSize;
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