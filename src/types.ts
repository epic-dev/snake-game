import { SideEffects } from "./settings"

export type Mutable<T> = {
    -readonly [P in keyof T]: T[P];
}

export type TPosition = {
    x: number,
    y: number,
}

export type TDirections = {
    readonly Left: { [key in keyof TPosition]: TPosition[key] },
    readonly Right: { [key in keyof TPosition]: TPosition[key] },
    readonly Up: { [key in keyof TPosition]: TPosition[key] },
    readonly Down: { [key in keyof TPosition]: TPosition[key] },
}

export type TBaseSettings = {
    frameWidth: number, // number of cells horizontally
    frameHeight: number, // number of cells vertically
    cellSize: number, // cell size in pixels
    startingPosition: TPosition,
    direction: TPosition,
    snakeColor: string,
    numberOfAllFoodItems: number,
    numberOfFoodItemsOnBoard: number,
    foodItemSize: number,
    maxGameSpeed: number,
    gameSpeed: number,
    inverseDirectionsTimeout: number,
    gameSpeedBoostValue: number,
}

export type FoodItem = {
    position: TPosition,
    points: number,
    effect?: SideEffects,
    ref: string, // svg reference
}