import { Food, FoodPoints, FoodSideEffects, settings } from './settings';
import { FoodItem, SideEffects, TPosition } from './types';

export class FoodManager {
    private current: FoodItem;

    constructor() {
        this.current = this.produce();
    }

    get item(): FoodItem {
        return this.current;
    }

    refresh(): void {
        this.current = this.produce();
    }

    private produce(): FoodItem {
        const foodType = this.randomType();
        return {
            position: this.randomPosition(),
            points:   FoodPoints.get(foodType)!,
            effect:   FoodSideEffects.get(foodType) as SideEffects | undefined,
            ref:      Food[foodType], // 'Cherries' | 'Mushrooms' | 'Pizza'
        };
    }

    private randomPosition(): TPosition {
        const maxX = settings.frameWidth  * settings.cellSize - settings.foodItemSize;
        const maxY = settings.frameHeight * settings.cellSize - settings.foodItemSize;
        return {
            x: Math.floor(Math.random() * (maxX / settings.cellSize + 1)) * settings.cellSize,
            y: Math.floor(Math.random() * (maxY / settings.cellSize + 1)) * settings.cellSize,
        };
    }

    private randomType(): Food {
        return Math.floor(Math.random() * settings.numberOfAllFoodItems) as Food;
    }
}
