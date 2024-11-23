import { Position } from "./types";

type RectangleAttributes = { position: Position; size: number; color: string; };
export function createRect(attributes: RectangleAttributes): SVGRectElement {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", `${attributes.position.x}`);
    rect.setAttribute("y", `${attributes.position.y}`);
    rect.setAttribute("width", `${attributes.size}`);
    rect.setAttribute("height", `${attributes.size}`);
    rect.setAttribute("fill", attributes.color);
    return rect;
}