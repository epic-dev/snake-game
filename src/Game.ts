import { timeUnit } from './constants';
import { FoodManager } from './Food';
import { InputHandler } from './InputHandler';
import { Renderer } from './Renderer';
import { BaseDirections, settings } from './settings';
import { Snake } from './Snake';
import { SideEffects, TPosition } from './types';

export class Game {
    private readonly snake: Snake;
    private readonly foodManager: FoodManager;
    private readonly renderer: Renderer;
    private readonly inputHandler: InputHandler;

    private readonly welcomeDialog: HTMLElement;
    private readonly gameOverDialog: HTMLElement;

    private score = 0;
    private gameSpeed = settings.gameSpeed;
    private isPaused = true;
    private isGameOver = false;
    private afId: number | null = null;
    private frameLastUpdateTime = 0;
    private invertedDirections = false;
    private invertedDirectionsId: ReturnType<typeof setTimeout> | null = null;

    constructor(
        renderer: Renderer,
        welcomeDialog: HTMLElement,
        gameOverDialog: HTMLElement,
        restartBtn: HTMLElement,
    ) {
        this.renderer = renderer;
        this.welcomeDialog = welcomeDialog;
        this.gameOverDialog = gameOverDialog;

        this.snake = new Snake(settings.startingPosition, BaseDirections.Up);
        this.foodManager = new FoodManager();

        this.inputHandler = new InputHandler({
            onTogglePause:    () => this.togglePause(),
            onDirectionUp:    () => this.handleDirectionInput(BaseDirections.Up),
            onDirectionDown:  () => this.handleDirectionInput(BaseDirections.Down),
            onDirectionLeft:  () => this.handleDirectionInput(BaseDirections.Left),
            onDirectionRight: () => this.handleDirectionInput(BaseDirections.Right),
            onRestart:        () => this.restart(),
        }, restartBtn);

        // Show the initial game state so the board is not blank during the welcome screen.
        this.renderer.render(this.snake.getInterpolated(1), this.foodManager.item, this.score, this.gameSpeed);
    }

    private togglePause(): void {
        if (this.isGameOver) return;
        if (this.isPaused) { this.resume(); } else { this.pause(); }
    }

    private resume(): void {
        if (!this.isPaused || this.isGameOver) return;
        this.isPaused = false;
        this.welcomeDialog.classList.add('hidden');
        this.afId = requestAnimationFrame(ts => this.loop(ts));
    }

    private pause(): void {
        if (this.isPaused) return;
        this.isPaused = true;
        if (this.afId !== null) {
            cancelAnimationFrame(this.afId);
            this.afId = null;
        }
    }

    private stop(): void {
        this.isGameOver = true;
        this.pause();
        this.gameOverDialog.classList.remove('hidden');
    }

    private restart(): void {
        if (this.invertedDirectionsId !== null) {
            clearTimeout(this.invertedDirectionsId);
            this.invertedDirectionsId = null;
        }
        this.score = 0;
        this.gameSpeed = settings.gameSpeed;
        this.invertedDirections = false;
        this.isGameOver = false;
        this.isPaused = true;
        this.frameLastUpdateTime = 0;

        this.snake.reset(settings.startingPosition, BaseDirections.Up);
        this.foodManager.refresh();
        this.gameOverDialog.classList.add('hidden');
        this.resume();
    }

    private loop(timestamp: number): void {
        if (this.isPaused || this.isGameOver) return;

        const tickDuration = 1 / this.gameSpeed; // seconds per tick
        const elapsed = (timestamp - this.frameLastUpdateTime) / timeUnit;

        if (elapsed >= tickDuration) {
            // Snapshot BEFORE advancing so getInterpolated() can lerp from old → new.
            this.snake.snapshot();
            this.frameLastUpdateTime = timestamp;
            this.update();
            if (this.isGameOver) return; // stop rAF chain after collision
        }

        // alpha: 0 = just ticked (show previous positions), 1 = next tick due (show new positions)
        const alpha = Math.min((timestamp - this.frameLastUpdateTime) / timeUnit / tickDuration, 1);
        this.renderer.render(this.snake.getInterpolated(alpha), this.foodManager.item, this.score, this.gameSpeed);
        this.afId = requestAnimationFrame(ts => this.loop(ts));
    }

    private update(): void {
        this.snake.prepareMove();

        if (this.snake.hasCollision()) {
            this.stop();
            return;
        }

        const ate = this.snake.hasEaten(this.foodManager.item);
        this.snake.confirmMove(ate);

        if (ate) {
            this.score += this.foodManager.item.points;
            this.applyEffect(this.foodManager.item.effect);
            this.foodManager.refresh();
        }
    }

    private applyEffect(effect?: SideEffects): void {
        switch (effect) {
            case SideEffects.InvertedDirections:
                this.invertedDirections = true;
                if (this.invertedDirectionsId !== null) clearTimeout(this.invertedDirectionsId);
                this.invertedDirectionsId = setTimeout(() => {
                    this.invertedDirections = false;
                    this.invertedDirectionsId = null;
                }, settings.inverseDirectionsTimeout);
                break;

            case SideEffects.SpeedBoost:
                this.gameSpeed = Math.min(this.gameSpeed + settings.gameSpeedBoostValue, settings.maxGameSpeed);
                break;
        }
    }

    private handleDirectionInput(dir: TPosition): void {
        if (this.isGameOver) return;
        // When directions are inverted, negate the requested vector instead of
        // dispatching separate inverted-direction functions like the original did.
        const effective = this.invertedDirections ? { x: -dir.x, y: -dir.y } : dir;
        this.snake.setDirection(effective);
    }

    destroy(): void {
        this.inputHandler.destroy();
        if (this.afId !== null) cancelAnimationFrame(this.afId);
        if (this.invertedDirectionsId !== null) clearTimeout(this.invertedDirectionsId);
    }
}
