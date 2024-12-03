"use client";
import { Canvas } from "fabric";
import { createContext, useContext, useState } from "react";

interface CanvasContextOptions {
  canvas: Canvas | undefined;
  setCanvas: (canvas: Canvas | undefined) => void;
}
export const CanvasContext = createContext<Canvas | undefined>(undefined);

export const useCanvasContext = () => useContext(CanvasContext);

// export const CanvasContextProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const [canvas, setCanvas] = useState<Canvas>();

//   return (
//     <CanvasContext.Provider value={{ canvas, setCanvas }}>
//       {children}
//     </CanvasContext.Provider>
//   );
// };
