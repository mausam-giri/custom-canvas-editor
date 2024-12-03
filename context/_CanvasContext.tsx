"use client";
import { Canvas, FabricObject, CanvasOptions } from "fabric";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

export const CanvasContext = createContext<Canvas | undefined>(undefined);

export interface CanvasTemplateDataOptions {
  canvasObjectData: string;
  canvasWidth: string;
  canvasHeight: string;
}
export interface CanvasContextOptions {
  canvas: Canvas | undefined;
  initCanvas: (
    canvasElementId: HTMLCanvasElement,
    options: Partial<CanvasOptions>
  ) => void;
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
  initCanvas: () => {},
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

  const initCanvas = useCallback(
    (canvasElement: HTMLCanvasElement, options: Partial<CanvasOptions>) => {
      if (canvas) {
        console.warn("Canvas is already initialized. Skipping initialization.");
        return; // Skip reinitialization if canvas is already created
      }

      // Set up canvas options
      const canvasOptions: Partial<CanvasOptions> = {
        preserveObjectStacking: true,
        backgroundColor: "#ffffff",
        selection: true,
        ...options,
      };

      // Create the fabric.js canvas instance
      const newCanvas = new Canvas(canvasElement, canvasOptions);
      setCanvasState(newCanvas);

      return () => {
        // Cleanup: remove listeners and dispose of the canvas
        if (newCanvas) {
          newCanvas.dispose();
        }
      };
    },
    [canvas]
  );

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

  useEffect(() => {
    // Cleanup canvas on component unmount or canvas state change
    return () => {
      if (canvas) {
        canvas.dispose();
      }
    };
  }, [canvas]);

  return (
    <CanvasContext2.Provider
      value={{
        canvas,
        initCanvas,
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
