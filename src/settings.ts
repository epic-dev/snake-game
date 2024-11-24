import { BaseSettings, Direction } from "./types"

export const Directions: Direction = {
    Left: { x: -1, y: 0 },
    Right: { x: 1, y: 0 },
    Up: { x: 0, y: -1 },
    Down: { x: 0, y: 1 },
}

export const settings: BaseSettings = {
    frameWidth: 80,
    frameHeight: 60,
    cellSize: 10,
    startingPosition: {
        x: 400,
        y: 300,
    },
    direction: Directions.Up,
    snakeColor: 'green',
}

export enum Food {
    Cherries,
    Mushrooms,
    Pizza,
}

export enum SideEffects {
    InvertedDirections,
    SpeedBoost,
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