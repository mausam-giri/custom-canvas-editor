"use client";
import EditorProvider from "@/context/Provider";
import EditorCanvas from "./Canvas";
import { useEffect, useState } from "react";
import { Canvas, FabricObject } from "fabric";
import { useCanvasContext } from "@/context/_CanvasContext";
import { MapInteractionCSS } from "react-map-interaction";
import ToolbarIcon from "@/components/ToolbarIcon";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";

export default function CertificateEditor() {
  const { canvas, activeObject, setActiveObject } = useCanvasContext();
  function handleObjectSelection(layer: FabricObject | null | undefined) {
    if (!layer) return;
    setActiveObject(layer);
    canvas?.requestRenderAll();
  }

  function selectionListener(props: { selected?: FabricObject[] }) {
    if (!props.selected || props.selected?.length == 0) {
      setActiveObject(null);
      return;
    }
    handleObjectSelection(props.selected?.[0]);
  }

  function selectionClearListener() {
    setActiveObject(null);
    // canvas.focus()
  }

  useEffect(() => {
    if (!canvas) {
      console.error("Failed to get canvas element");
      return;
    }
    // canvas listeners
    canvas.on("selection:created", selectionListener);
    canvas.on("selection:updated", selectionListener);
    canvas.on("selection:cleared", selectionClearListener);
    canvas.on("object:modified", (event) =>
      handleObjectSelection(event.target)
    );
    canvas.on("object:scaling", (event) => handleObjectSelection(event.target));

    // cleaup function
    return () => {
      canvas.off("selection:created", selectionListener);
      canvas.off("selection:updated", selectionListener);
      canvas.off("selection:cleared", selectionClearListener);
      canvas.off("object:modified", (event) =>
        handleObjectSelection(event.target)
      );
      canvas.off("object:scaling", (event) =>
        handleObjectSelection(event.target)
      );
    };
  }, [canvas, selectionListener, selectionClearListener]);

  const [isPanningEnabled, setIsPanningEnabled] = useState(false);
  const [scale, setScale] = useState(1);
  const [translation, setTranslation] = useState({ x: 0, y: 0 });

  const zoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const zoomOut = () => {
    setScale((prevScale) => Math.max(prevScale - 0.1, 0.1));
  };

  const resetZoom = () => {
    setScale(1);
    setTranslation({ x: 0, y: 0 });
  };
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "h") {
        setIsPanningEnabled(true);
        document.body.style.cursor = "grab";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "h") {
        setIsPanningEnabled(false);
        document.body.style.cursor = "default";
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isPanningEnabled) {
        document.body.style.cursor = "grabbing";
      }

      (document.activeElement as HTMLElement)?.blur();
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isPanningEnabled) {
        document.body.style.cursor = "grab";
      } else {
        document.body.style.cursor = "default";
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isPanningEnabled]);
  return (
    <EditorProvider>
      <div></div>

      <MapInteractionCSS
        disablePan={!isPanningEnabled}
        disableZoom={false}
        value={{ scale, translation }}
        onChange={({ scale, translation }) => {
          setScale(scale);
          setTranslation(translation);
        }}
        minScale={0.5}
        maxScale={2}
      >
        <EditorCanvas />
      </MapInteractionCSS>

      <aside className="absolute bottom-2 right-0 mr-2">
        <div className="bg-white py-1 px-2 rounded-md flex items-center gap-2">
          <ToolbarIcon icon={LuZoomIn} onClick={zoomIn} />
          <ToolbarIcon icon={LuZoomOut} onClick={zoomOut} />
          <button
            onClick={resetZoom}
            className="px-2.5 py-2 text-sm rounded-md hover:bg-blue-100"
          >
            Reset
          </button>
          <span className="px-2 text-gray-500">|</span>
          <p className="text-sm font-medium">{Math.round(scale * 100)}%</p>
        </div>
      </aside>
    </EditorProvider>
  );
}
