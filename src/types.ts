export type TPosition = {
    x: number;
    y: number;
};

export type TDirections = {
    readonly Left: TPosition;
    readonly Right: TPosition;
    readonly Up: TPosition;
    readonly Down: TPosition;
};

export type TBaseSettings = {
    frameWidth: number;
    frameHeight: number;
    cellSize: number;
    startingPosition: TPosition;
    direction: TPosition;
    snakeColor: string;
    numberOfAllFoodItems: number;
    numberOfFoodItemsOnBoard: number;
    foodItemSize: number;
    maxGameSpeed: number;
    gameSpeed: number;
    inverseDirectionsTimeout: number;
    gameSpeedBoostValue: number;
};

// Moved here from settings.ts to break the circular import
export enum SideEffects {
    InvertedDirections = 'InvertedDirections',
    SpeedBoost = 'SpeedBoost',
}

export type FoodItem = {
    position: TPosition;
    points: number;
    effect?: SideEffects;
    ref: string; // food type name used as sprite key, e.g. 'Cherries'
};
