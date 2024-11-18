import { Canvas } from "fabric";
import { createContext } from "react";

export const CanvasContext = createContext<Canvas | undefined>(undefined);
