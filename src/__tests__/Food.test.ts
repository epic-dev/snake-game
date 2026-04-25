import { FoodManager } from '../Food';
import { FoodPoints, settings } from '../settings';

const { cellSize, frameWidth, frameHeight, foodItemSize } = settings;

describe('FoodManager', () => {
    test('produces an item within board bounds', () => {
        const mgr = new FoodManager();
        const { position } = mgr.item;
        expect(position.x).toBeGreaterThanOrEqual(0);
        expect(position.x).toBeLessThanOrEqual(frameWidth  * cellSize - foodItemSize);
        expect(position.y).toBeGreaterThanOrEqual(0);
        expect(position.y).toBeLessThanOrEqual(frameHeight * cellSize - foodItemSize);
    });

    test('position is aligned to the cell grid', () => {
        for (let i = 0; i < 20; i++) {
            const mgr = new FoodManager();
            expect(mgr.item.position.x % cellSize).toBe(0);
            expect(mgr.item.position.y % cellSize).toBe(0);
        }
    });

    test('ref is a known food type name', () => {
        const validRefs = new Set(['Cherries', 'Mushrooms', 'Pizza']);
        for (let i = 0; i < 20; i++) {
            const mgr = new FoodManager();
            expect(validRefs.has(mgr.item.ref)).toBe(true);
        }
    });

    test('points match the food type', () => {
        const validPoints = new Set(FoodPoints.values());
        for (let i = 0; i < 20; i++) {
            const mgr = new FoodManager();
            expect(validPoints.has(mgr.item.points)).toBe(true);
        }
    });

    test('refresh replaces the current item', () => {
        // Run many times to guard against the rare case of two identical items
        let saw_difference = false;
        for (let i = 0; i < 30; i++) {
            const mgr = new FoodManager();
            const before = { ...mgr.item.position };
            mgr.refresh();
            const after = { ...mgr.item.position };
            if (before.x !== after.x || before.y !== after.y) {
                saw_difference = true;
                break;
            }
        }
        expect(saw_difference).toBe(true);
    });
});
