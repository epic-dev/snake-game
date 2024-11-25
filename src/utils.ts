import { TPosition } from "./types";

type RectangleAttributes = { position: TPosition; size: number; color: string; };
type UseElementAttributes = { position: TPosition; ref: string; }
export function createRect(attributes: RectangleAttributes): SVGRectElement {
    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", `${attributes.position.x}`);
    rect.setAttribute("y", `${attributes.position.y}`);
    rect.setAttribute("width", `${attributes.size}`);
    rect.setAttribute("height", `${attributes.size}`);
    rect.setAttribute("fill", attributes.color);
    return rect;
}
export function createUseElement(attributes: UseElementAttributes): SVGUseElement {
    const useElement = document.createElementNS("http://www.w3.org/2000/svg", "use");
    useElement.setAttribute('x', `${attributes.position.x}`)
    useElement.setAttribute('y', `${attributes.position.y}`)
    useElement.setAttribute('href', `${attributes.ref}`)
    return useElement;
}