import { collision, isEaten, moveDown, moveLeft, moveRight, moveUp, produceFoodItem } from "../mechanics"
import { BaseDirections, FoodPoints, settings } from "../settings";

describe("Collisions:", () => {
    test('- with the snake tail', () => {
        let isCollision = collision([{ x: 10, y: 10 }, { x: 20, y: 20 }]);
        expect(isCollision).toBe(false);
        isCollision = collision([{ x: 10, y: 10 }, { x: 20, y: 20 }, { x: 10, y: 10 }]);
        expect(isCollision).toBe(true);
    });

    test('- with the pane borders', () => {
        const rightBorderPosition = { x: settings.frameWidth * settings.cellSize, y: 0 };
        const leftBorderPosition = { x: -settings.cellSize, y: 10 };
        const topBorderPosition = { x: 10, y: -settings.cellSize };
        const bottomBorderPosition = { x: 0, y: settings.frameHeight * settings.cellSize };

        let snakeHead = { x: rightBorderPosition.x, y: 10 };
        expect(collision([snakeHead])).toBe(true);
        
        snakeHead = { x: leftBorderPosition.x, y: 10 };
        expect(collision([snakeHead])).toBe(true);
        
        snakeHead = { x: 10, y: topBorderPosition.y };
        expect(collision([snakeHead])).toBe(true);
        
        snakeHead = { x: 10, y: bottomBorderPosition.y };
        expect(collision([snakeHead])).toBe(true);

        snakeHead = { x: rightBorderPosition.x - settings.cellSize, y: 10 };
        expect(collision([snakeHead])).toBe(false);
    });
});

describe('Food item', () => {
    test('- is eaten', () => {
        const foodItem = {
            position: { x: 10, y: 10 },
            points: 0,
            ref: '',
        };
        let snakeHead = { x: foodItem.position.x, y: foodItem.position.y };
        expect(isEaten(snakeHead, foodItem)).toBe(true);

        snakeHead = { x: foodItem.position.x + settings.cellSize, y: foodItem.position.y };
        expect(isEaten(snakeHead, foodItem)).toBe(true);
        
        snakeHead = { x: foodItem.position.x, y: foodItem.position.y + settings.cellSize };
        expect(isEaten(snakeHead, foodItem)).toBe(true);
        
        snakeHead = { x: foodItem.position.x + settings.cellSize, y: foodItem.position.y + settings.cellSize };
        expect(isEaten(snakeHead, foodItem)).toBe(true);

        snakeHead = { x: foodItem.position.x, y: foodItem.position.y + settings.cellSize * 2 };
        expect(isEaten(snakeHead, foodItem)).toBe(false);

        snakeHead = { x: foodItem.position.x + settings.cellSize * 2, y: foodItem.position.y };
        expect(isEaten(snakeHead, foodItem)).toBe(false);
    });

    test('- produced correctly', () => {
        const foodItem = produceFoodItem();
        const withinBorders = foodItem.position.x > 0
            && foodItem.position.x < settings.frameWidth * settings.cellSize - settings.foodItemSize
            && foodItem.position.y > 0
            && foodItem.position.y < settings.frameHeight * settings.cellSize - settings.foodItemSize;
        expect(withinBorders).toBe(true);

        const correctType = foodItem.ref === '#Cherries' || foodItem.ref === '#Mushrooms' || foodItem.ref === '#Pizza';
        expect(correctType).toBe(true);

        const correctPoints = [...FoodPoints.values()].includes(foodItem.points);        
        expect(correctPoints).toBe(true);
    });
});

describe('Snake movements', () => {
    test('- snake moves up only, cannot move the opposite direction', () => {
        let currentDirection = BaseDirections.Down;
        expect(moveUp(currentDirection)).toEqual(BaseDirections.Down);

        currentDirection = BaseDirections.Right;
        expect(moveUp(currentDirection)).toEqual(BaseDirections.Up);
    });
    test('- snake moves down only, cannot move the opposite direction', () => {
        let currentDirection = BaseDirections.Up;
        expect(moveDown(currentDirection)).toEqual(BaseDirections.Up);

        currentDirection = BaseDirections.Right;
        expect(moveDown(currentDirection)).toEqual(BaseDirections.Down);
    });
    test('- snake moves right only, cannot move the opposite direction', () => {
        let currentDirection = BaseDirections.Left;
        expect(moveRight(currentDirection)).toEqual(BaseDirections.Left);

        currentDirection = BaseDirections.Up;
        expect(moveRight(currentDirection)).toEqual(BaseDirections.Right);
    });
    test('- snake moves left only, cannot move the opposite direction', () => {
        let currentDirection = BaseDirections.Right;
        expect(moveLeft(currentDirection)).toEqual(BaseDirections.Right);

        currentDirection = BaseDirections.Up;
        expect(moveLeft(currentDirection)).toEqual(BaseDirections.Left);
    });
});