import { TBaseSettings, TDirections } from "./types"

export const BaseDirections: TDirections = {
    Left: { x: -1, y: 0 },
    Right: { x: 1, y: 0 },
    Up: { x: 0, y: -1 },
    Down: { x: 0, y: 1 },
}

export const settings: TBaseSettings = {
    frameWidth: 80,
    frameHeight: 60,
    cellSize: 10,
    startingPosition: {
        x: 400,
        y: 300,
    },
    direction: BaseDirections.Up,
    snakeColor: 'green',
    numberOfAllFoodItems: 3,
    numberOfFoodItemsOnBoard: 1,
    foodItemSize: 20,
    maxGameSpeed: 50,
    gameSpeed: 7,  // cells per second
    inverseDirectionsTimeout: 30000,
    gameSpeedBoostValue: 5,
}

export enum Food {
    Cherries,
    Mushrooms,
    Pizza,
}

export enum SideEffects {
    InvertedDirections = 'InvertedDirections',
    SpeedBoost = 'SpeedBoost',
}

export const FoodSideEffects = new Map<Food, SideEffects>([
    [Food.Mushrooms, SideEffects.InvertedDirections],
    [Food.Pizza, SideEffects.SpeedBoost]
]);

export const FoodPoints = new Map<Food, number>([
    [Food.Cherries, 100],
    [Food.Mushrooms, 350],
    [Food.Pizza, 400],
]);