import './styles.css';
import { Game } from './Game';
import { Renderer } from './Renderer';

document.addEventListener('DOMContentLoaded', async () => {
    const canvas       = document.getElementById('game-board')          as HTMLCanvasElement;
    const scoreEl      = document.getElementById('score-value')         as HTMLElement;
    const gameSpeedEl  = document.getElementById('game-speed-value')    as HTMLElement;
    const welcomeDlg   = document.querySelector<HTMLElement>('.dialog.welcome-message')!;
    const gameOverDlg  = document.querySelector<HTMLElement>('.dialog.gameover-message')!;
    const restartBtn   = document.getElementById('restart-game-btn')    as HTMLElement;
    const spriteDefs   = document.querySelector<SVGDefsElement>('svg#sprites defs')!;

    const renderer = new Renderer(canvas, scoreEl, gameSpeedEl);
    await renderer.loadSprites(spriteDefs);

    new Game(renderer, welcomeDlg, gameOverDlg, restartBtn);
});
