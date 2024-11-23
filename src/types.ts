export type Position = {
    x: number,
    y: number,
}

export type Direction = {
    Left: { [key in keyof Position]: Position[key] },
    Right: { [key in keyof Position]: Position[key] },
    Up: { [key in keyof Position]: Position[key] },
    Down: { [key in keyof Position]: Position[key] },
}

export type BaseSettings = {
    frameWidth: number, // number of cells horizontally
    frameHeight: number, // number of cells vertically
    cellSize: number, // cell size in pixels
    startingPosition: Position,
    direction: Position,
    color: string,
}