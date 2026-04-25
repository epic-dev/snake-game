import { settings } from './settings';
import { FoodItem, TPosition } from './types';

function lerp(a: number, b: number, t: number): number {
    return a + (b - a) * t;
}

export class Snake {
    private segments: TPosition[];
    private prevSegments: TPosition[];
    private direction: TPosition;

    constructor(startPosition: TPosition, startDirection: TPosition, initialSegments?: TPosition[]) {
        // initialSegments is a test-seeding escape hatch; production code always omits it.
        this.segments = initialSegments
            ? initialSegments.map(s => ({ ...s }))
            : [{ ...startPosition }];
        this.prevSegments = this.segments.map(s => ({ ...s }));
        this.direction = startDirection;
    }

    get head(): TPosition {
        return this.segments[0];
    }

    get body(): readonly TPosition[] {
        return this.segments;
    }

    setDirection(dir: TPosition): void {
        // Reject a 180-degree reversal using value comparison, not reference equality.
        // This is more robust than the original reference-based moveUp/Down/Left/Right fns.
        const isOpposite = dir.x === -this.direction.x && dir.y === -this.direction.y;
        if (!isOpposite) this.direction = dir;
    }

    // Saves current positions as the interpolation baseline for the coming tick.
    // Must be called immediately before prepareMove().
    snapshot(): void {
        this.prevSegments = this.segments.map(s => ({ ...s }));
    }

    // Returns positions lerped between the snapshot and current state.
    // alpha=0 → previous positions, alpha=1 → current positions.
    getInterpolated(alpha: number): TPosition[] {
        return this.segments.map((seg, i) => {
            // When the snake just grew, new tail segment has no previous counterpart;
            // anchor it at the old tail so it appears to emerge from there.
            const prev = this.prevSegments[i] ?? this.prevSegments[this.prevSegments.length - 1];
            return {
                x: lerp(prev.x, seg.x, alpha),
                y: lerp(prev.y, seg.y, alpha),
            };
        });
    }

    // Pushes the next head onto the front, keeping the current tail in place temporarily
    // so hasCollision() sees the full pre-shrink body. Call confirmMove() afterwards.
    prepareMove(): void {
        this.segments.unshift({
            x: this.head.x + this.direction.x * settings.cellSize,
            y: this.head.y + this.direction.y * settings.cellSize,
        });
    }

    confirmMove(grow: boolean): void {
        if (!grow) this.segments.pop();
    }

    hasCollision(): boolean {
        const { x, y } = this.head;
        if (
            x < 0 || x >= settings.frameWidth  * settings.cellSize ||
            y < 0 || y >= settings.frameHeight * settings.cellSize
        ) return true;

        // Plain for-loop avoids the array allocation that slice(1) would create each tick.
        for (let i = 1; i < this.segments.length; i++) {
            if (this.segments[i].x === x && this.segments[i].y === y) return true;
        }
        return false;
    }

    hasEaten(food: FoodItem): boolean {
        // equalPositions from the original is a subset of this range check, so it's omitted.
        const { x, y } = this.head;
        return (
            x <= food.position.x + settings.cellSize && x > food.position.x - settings.cellSize &&
            y <= food.position.y + settings.cellSize && y > food.position.y - settings.cellSize
        );
    }

    reset(startPosition: TPosition, startDirection: TPosition): void {
        this.segments     = [{ ...startPosition }];
        this.prevSegments = [{ ...startPosition }];
        this.direction    = startDirection;
    }
}
