import { Circle, Line, Rect, Textbox } from "fabric";

export function drawRectangle() {
  const rect = new Rect({
    width: 100,
    height: 100,
    label: "Rectangle",
  });

  return rect;
}

export function drawCircle() {
  const circle = new Circle({
    radius: 50,
    label: "Circle",
  });

  return circle;
}

export function drawLine() {
  const line = new Line([50, 50, 200, 50], {
    stroke: "black",
    perPixelTargetFind: true,
    label: "Line",
  });

  return line;
}

export function drawText() {
  const text = new Textbox("Text", {
    fontSize: 18,
    label: "Text",
    fontFamily: "Roboto",
    fontWeight: 400,
  });

  return text;
}
