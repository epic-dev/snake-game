import { Snake } from '../Snake';
import { BaseDirections, settings } from '../settings';

const { cellSize, frameWidth, frameHeight } = settings;
const W = frameWidth  * cellSize; // board pixel width
const H = frameHeight * cellSize; // board pixel height

// ─── helpers ───────────────────────────────────────────────────────────────

function makeSnake(segments: { x: number; y: number }[], dir = BaseDirections.Right): Snake {
    return new Snake(segments[0], dir, segments);
}

function step(snake: Snake, grow = false): void {
    snake.prepareMove();
    snake.confirmMove(grow);
}

// ─── border collisions ─────────────────────────────────────────────────────

describe('Border collision', () => {
    test('right border', () => {
        const snake = makeSnake([{ x: W - cellSize, y: 10 }], BaseDirections.Right);
        snake.prepareMove();
        expect(snake.hasCollision()).toBe(true);
    });

    test('left border', () => {
        const snake = makeSnake([{ x: 0, y: 10 }], BaseDirections.Left);
        snake.prepareMove();
        expect(snake.hasCollision()).toBe(true);
    });

    test('top border', () => {
        const snake = makeSnake([{ x: 10, y: 0 }], BaseDirections.Up);
        snake.prepareMove();
        expect(snake.hasCollision()).toBe(true);
    });

    test('bottom border', () => {
        const snake = makeSnake([{ x: 10, y: H - cellSize }], BaseDirections.Down);
        snake.prepareMove();
        expect(snake.hasCollision()).toBe(true);
    });

    test('one cell before right border does not collide', () => {
        const snake = makeSnake([{ x: W - cellSize * 2, y: 10 }], BaseDirections.Right);
        snake.prepareMove();
        expect(snake.hasCollision()).toBe(false);
    });
});

// ─── self-collision ────────────────────────────────────────────────────────

describe('Self-collision', () => {
    test('no collision when head does not overlap body', () => {
        const snake = makeSnake([
            { x: 10, y: 10 },
            { x: 20, y: 10 },
            { x: 30, y: 10 },
        ], BaseDirections.Left);
        expect(snake.hasCollision()).toBe(false);
    });

    test('detects collision when head overlaps a body segment', () => {
        // head is already on top of segment[2] — simulates a tight loop
        const snake = makeSnake([
            { x: 10, y: 10 },
            { x: 20, y: 10 },
            { x: 10, y: 10 }, // same as head
        ], BaseDirections.Left);
        expect(snake.hasCollision()).toBe(true);
    });
});

// ─── direction changes ─────────────────────────────────────────────────────

describe('Direction changes', () => {
    test('accepts a perpendicular direction', () => {
        const snake = makeSnake([{ x: 40, y: 40 }], BaseDirections.Right);
        snake.setDirection(BaseDirections.Up);
        snake.prepareMove();
        // head should move up, not right
        expect(snake.head.y).toBe(40 - cellSize);
        expect(snake.head.x).toBe(40);
    });

    test('rejects 180° reversal going right → left', () => {
        const snake = makeSnake([{ x: 40, y: 40 }], BaseDirections.Right);
        snake.setDirection(BaseDirections.Left);
        snake.prepareMove();
        // should still move right
        expect(snake.head.x).toBe(40 + cellSize);
    });

    test('rejects 180° reversal going up → down', () => {
        const snake = makeSnake([{ x: 40, y: 40 }], BaseDirections.Up);
        snake.setDirection(BaseDirections.Down);
        snake.prepareMove();
        expect(snake.head.y).toBe(40 - cellSize);
    });
});

// ─── growth ────────────────────────────────────────────────────────────────

describe('Growth', () => {
    test('snake does not grow when confirmMove(false)', () => {
        const snake = makeSnake([{ x: 40, y: 40 }, { x: 30, y: 40 }], BaseDirections.Right);
        step(snake, false);
        expect(snake.body.length).toBe(2);
    });

    test('snake grows when confirmMove(true)', () => {
        const snake = makeSnake([{ x: 40, y: 40 }, { x: 30, y: 40 }], BaseDirections.Right);
        step(snake, true);
        expect(snake.body.length).toBe(3);
    });
});

// ─── food eating ──────────────────────────────────────────────────────────

describe('Eating detection', () => {
    const food = {
        position: { x: 50, y: 50 },
        points: 0,
        ref: 'Cherries',
    };

    test('eats when head is exactly on food position', () => {
        const snake = makeSnake([{ x: 50, y: 50 }]);
        expect(snake.hasEaten(food)).toBe(true);
    });

    test('eats when head is within cellSize of food', () => {
        const snake = makeSnake([{ x: 50 + cellSize, y: 50 }]);
        expect(snake.hasEaten(food)).toBe(true);
    });

    test('does not eat when head is two cells away', () => {
        const snake = makeSnake([{ x: 50 + cellSize * 2, y: 50 }]);
        expect(snake.hasEaten(food)).toBe(false);
    });

    test('does not eat when head is off in Y only', () => {
        const snake = makeSnake([{ x: 50, y: 50 + cellSize * 2 }]);
        expect(snake.hasEaten(food)).toBe(false);
    });
});

// ─── reset ────────────────────────────────────────────────────────────────

describe('Reset', () => {
    test('resets to single-segment snake at given position', () => {
        const snake = makeSnake([{ x: 10, y: 10 }], BaseDirections.Right);
        step(snake, true);
        step(snake, true);
        snake.reset({ x: 200, y: 200 }, BaseDirections.Up);
        expect(snake.body.length).toBe(1);
        expect(snake.head).toEqual({ x: 200, y: 200 });
    });
});
