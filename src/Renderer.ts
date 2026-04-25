import { settings } from './settings';
import { FoodItem, TPosition } from './types';

export class Renderer {
    private readonly canvas: HTMLCanvasElement;
    private readonly ctx: CanvasRenderingContext2D;
    private readonly sprites = new Map<string, HTMLImageElement>();

    // Cache last-rendered HUD values to skip DOM writes on unchanged frames.
    private lastScore = -1;
    private lastGameSpeed = -1;
    private readonly scoreEl: HTMLElement;
    private readonly gameSpeedEl: HTMLElement;

    constructor(canvas: HTMLCanvasElement, scoreEl: HTMLElement, gameSpeedEl: HTMLElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.scoreEl = scoreEl;
        this.gameSpeedEl = gameSpeedEl;
    }

    // Pre-renders each food <g id="..."> sprite into an Image so drawImage() can
    // stamp it on the canvas in O(1) without touching the SVG DOM every frame.
    async loadSprites(defs: SVGDefsElement): Promise<void> {
        const groups = Array.from(defs.querySelectorAll<SVGGElement>('g[id]'));
        await Promise.all(groups.map(g => this.loadSprite(g)));
    }

    private loadSprite(group: SVGGElement): Promise<void> {
        return new Promise(resolve => {
            const size = settings.foodItemSize;
            const clone = group.cloneNode(true) as SVGGElement;

            // Browsers won't resolve url(#id) references when <defs> is nested inside
            // a <g> in an image data-URI. Pull any inner <defs> up to the SVG root.
            const innerDefs = Array.from(clone.querySelectorAll('defs'));
            const defsHtml  = innerDefs.map(d => d.outerHTML).join('');
            innerDefs.forEach(d => d.remove());

            const svgStr = [
                `<svg xmlns="http://www.w3.org/2000/svg"`,
                ` width="${size}" height="${size}" viewBox="0 0 20 20">`,
                defsHtml,
                clone.outerHTML,
                `</svg>`,
            ].join('');

            const img = new Image();
            img.onload  = () => { this.sprites.set(group.id, img); resolve(); };
            img.onerror = () => resolve(); // fall back to colored rect on failure
            img.src = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgStr)}`;
        });
    }

    render(snake: readonly TPosition[], food: FoodItem, score: number, gameSpeed: number): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.drawSnake(snake);
        this.drawFood(food);
        this.updateHUD(score, gameSpeed);
    }

    private drawSnake(segments: readonly TPosition[]): void {
        this.ctx.fillStyle = settings.snakeColor;
        for (const { x, y } of segments) {
            this.ctx.fillRect(x, y, settings.cellSize, settings.cellSize);
        }
    }

    private drawFood(food: FoodItem): void {
        const sprite = this.sprites.get(food.ref);
        if (sprite) {
            this.ctx.drawImage(sprite, food.position.x, food.position.y, settings.foodItemSize, settings.foodItemSize);
        } else {
            // Fallback while sprite is loading or failed.
            this.ctx.fillStyle = '#ff6600';
            this.ctx.fillRect(food.position.x, food.position.y, settings.foodItemSize, settings.foodItemSize);
        }
    }

    private updateHUD(score: number, gameSpeed: number): void {
        if (score !== this.lastScore) {
            this.scoreEl.textContent = String(score);
            this.lastScore = score;
        }
        if (gameSpeed !== this.lastGameSpeed) {
            this.gameSpeedEl.textContent = String(gameSpeed);
            this.lastGameSpeed = gameSpeed;
        }
    }
}
