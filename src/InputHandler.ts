export interface InputCallbacks {
    onTogglePause: () => void;
    onDirectionUp: () => void;
    onDirectionDown: () => void;
    onDirectionLeft: () => void;
    onDirectionRight: () => void;
    onRestart: () => void;
}

export class InputHandler {
    private readonly onKeyDown: (e: KeyboardEvent) => void;
    private readonly onRestart: () => void;
    private readonly restartBtn: HTMLElement;

    constructor(callbacks: InputCallbacks, restartBtn: HTMLElement) {
        this.restartBtn = restartBtn;

        this.onKeyDown = (e: KeyboardEvent) => {
            switch (e.key) {
                case ' ':          callbacks.onTogglePause();    break;
                case 'ArrowUp':
                case 'w':          callbacks.onDirectionUp();    break;
                case 'ArrowDown':
                case 's':          callbacks.onDirectionDown();  break;
                case 'ArrowLeft':
                case 'a':          callbacks.onDirectionLeft();  break;
                case 'ArrowRight':
                case 'd':          callbacks.onDirectionRight(); break;
            }
        };

        this.onRestart = callbacks.onRestart;
        document.addEventListener('keydown', this.onKeyDown);
        restartBtn.addEventListener('click', this.onRestart);
    }

    destroy(): void {
        document.removeEventListener('keydown', this.onKeyDown);
        this.restartBtn.removeEventListener('click', this.onRestart);
    }
}
