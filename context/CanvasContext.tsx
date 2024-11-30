"use client";
import { Canvas, FabricObject, CanvasOptions } from "fabric";
import { createContext, useCallback, useContext, useState } from "react";

export const CanvasContext = createContext<Canvas | undefined>(undefined);

export interface CanvasTemplateDataOptions {
  canvasObjectData: string;
  canvasWidth: string;
  canvasHeight: string;
}
export interface CanvasContextOptions {
  canvas: Canvas | undefined;
  // initCanvas: (
  //   options: Partial<CanvasOptions>
  //   // canvasEl: HTMLCanvasElement,
  // ) => void;
  // loadFromJSON: (
  //   templateJson: CanvasTemplateDataOptions
  //   // canvasEl: HTMLCanvasElement,
  // ) => void;
  setCanvasState: (canvas: Canvas | undefined) => void;
  setActiveObject: (obj: FabricObject | null) => void;
  activeObject: FabricObject | null;
}

export const CanvasContext2 = createContext<CanvasContextOptions>({
  canvas: undefined,
  // initCanvas: () => {},
  // loadFromJSON: () => {},
  setCanvasState: () => {},
  setActiveObject: () => {},
  activeObject: null,
});

export const useCanvasContext = () => {
  return useContext(CanvasContext2);
};

export const CanvasContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [canvas, setCanvas] = useState<Canvas>();
  const [activeObject, setActiveObject] = useState<FabricObject | null>(null);

  const setCanvasState = (canvas: Canvas | undefined) => {
    setCanvas(canvas);
  };

  const initCanvas = useCallback((options: Partial<CanvasOptions>) => {
    const canvasOptions: Partial<CanvasOptions> = {
      preserveObjectStacking: true,
      backgroundColor: "#ffffff",
      defaultCursor: "default",
      selection: true,
    };
    const initialCanvas = new Canvas("canvas", {
      ...canvasOptions,
      ...options,
    });
    // initAligningGuidelines(initialCanvas)
    initialCanvas.renderAll();
    setCanvas(initialCanvas);

    // () => {
    //   initialCanvas.removeListeners();
    //   initialCanvas.dispose();
    // };
  }, []);

  const loadFromJSON = useCallback(
    (templateJson: CanvasTemplateDataOptions) => {
      const initialCanvas = new Canvas("canvas");
      initialCanvas.loadFromJSON(templateJson.canvasObjectData, () => {
        initialCanvas?.renderAll.bind(initialCanvas);
        initialCanvas.setDimensions({
          width: templateJson.canvasWidth,
          height: templateJson.canvasHeight,
        });
      });
      initialCanvas.renderAll();
      setCanvas(initialCanvas);

      () => {
        initialCanvas.removeListeners();
        initialCanvas.dispose();
      };
    },
    []
  );

  return (
    <CanvasContext2.Provider
      value={{
        canvas,
        // initCanvas,
        // loadFromJSON,
        setCanvasState,
        activeObject,
        setActiveObject,
      }}
    >
      {children}
    </CanvasContext2.Provider>
  );
};
