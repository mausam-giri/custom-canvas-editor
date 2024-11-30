import { Canvas, FabricObject, CanvasOptions } from "fabric";
import { createContext, useCallback, useContext, useState } from "react";

export const CanvasContext = createContext<Canvas | undefined>(undefined);

export interface CanvasTemplateDataOptions {
  canvasObjectData: string;
  canvasWidth: string;
  canvasHeight: string;
}
interface CanvasContextOptions {
  canvas: Canvas | undefined;
  initCanvas: (canvasEl: HTMLCanvasElement) => void;
  loadFromJSON: (
    canvasEl: HTMLCanvasElement,
    templateJson: CanvasTemplateDataOptions
  ) => void;
  setActiveObject: (obj: FabricObject | null) => void;
  activeObject: FabricObject | null;
}

const CanvasContext2 = createContext<CanvasContextOptions | undefined>(
  undefined
);

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

  const initCanvas = useCallback((canvasEl: HTMLCanvasElement) => {
    const canvasOptions: Partial<CanvasOptions> = {
      preserveObjectStacking: true,
      backgroundColor: "#ffffff",
      defaultCursor: "default",
      selection: true,
    };
    const initialCanvas = new Canvas(canvasEl, canvasOptions);
    // initAligningGuidelines(initialCanvas)
    initialCanvas.renderAll();
    setCanvas(initialCanvas);
  }, []);

  const loadFromJSON = useCallback(
    (canvasEl: HTMLCanvasElement, templateJson: CanvasTemplateDataOptions) => {
      const initialCanvas = new Canvas(canvasEl);
      initialCanvas.loadFromJSON(templateJson.canvasObjectData, () => {
        initialCanvas?.renderAll.bind(initialCanvas);
        initialCanvas.setDimensions({
          width: templateJson.canvasWidth,
          height: templateJson.canvasHeight,
        });
      });
      initialCanvas.renderAll();
      setCanvas(initialCanvas);
    },
    []
  );

  return (
    <CanvasContext2.Provider
      value={{
        canvas,
        initCanvas,
        loadFromJSON,
        activeObject,
        setActiveObject,
      }}
    >
      {children}
    </CanvasContext2.Provider>
  );
};
