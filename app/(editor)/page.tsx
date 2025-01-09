"use client";

import {
  CanvasContext,
  // CanvasContextProvider,
  useCanvasContext,
} from "@/context/CanvasContext";
import { Canvas, FabricObject, InteractiveFabricObject } from "fabric";
import { useEffect, useRef, useState } from "react";
import ToolbarPanel from "./panels/ToolbarPanel";
import { v4 as getUniqueId } from "uuid";

import fonts from "@/lib/fonts";
import CanvasPanel from "./panels/CanvasPanel";
import ToolbarIcon from "@/components/ToolbarIcon";
import { FaHome } from "react-icons/fa";
import Link from "next/link";
import { MapInteractionCSS } from "react-map-interaction";
import { LuZoomIn, LuZoomOut } from "react-icons/lu";

export default function CertificateEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas>();
  // const { canvas, setCanvas } = useCanvasContext();
  const [activeObject, setActiveObject] = useState<FabricObject | null>(null);

  function initializeCanvas() {
    const initialCanvas = new Canvas(canvasRef.current!, {
      width: 750,
      height: 500,
      backgroundColor: "#ffffff",
    });

    // initialCanvas.backgroundColor = "#ffffff";
    initialCanvas.preserveObjectStacking = true;

    InteractiveFabricObject.ownDefaults = {
      ...InteractiveFabricObject.ownDefaults,
      cornerStrokeColor: "blue",
      cornerColor: "lightblue",
      cornerStyle: "circle",
      padding: 1,
      transparentCorners: false,
    };

    initialCanvas.on("object:added", (event) => {
      event.target.id = getUniqueId();
      initialCanvas.setActiveObject(event.target);
      initialCanvas.requestRenderAll();
    });

    initialCanvas.renderAll();

    setCanvas(initialCanvas);

    // add guideline support
    // const guideline = new AlignGuidelines({ canvas: initialCanvas });
    // guideline.init();

    return () => {
      initialCanvas.removeListeners();
      initialCanvas.dispose();
    };
  }

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
    handleObjectSelection(props.selected[0]);
  }

  function selectionClearListener() {
    setActiveObject(null);
    // canvas.focus()
  }

  useEffect(() => {
    if (canvasRef.current) return initializeCanvas();
  }, [canvasRef.current]);

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", selectionListener);
      canvas.on("selection:updated", selectionListener);
      canvas.on("selection:cleared", selectionClearListener);
      canvas.on("object:modified", (event) =>
        handleObjectSelection(event.target)
      );
      canvas.on("object:scaling", (event) =>
        handleObjectSelection(event.target)
      );
    }

    return () => {
      canvas?.off("selection:created", selectionListener);
      canvas?.off("selection:updated", selectionListener);
      canvas?.off("selection:cleared", selectionClearListener);
      canvas?.off("object:modified", (event) =>
        handleObjectSelection(event.target)
      );
      canvas?.off("object:scaling", (event) =>
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
      if (e.key === "alt" || e.key === "h") {
        setIsPanningEnabled(true);
        document.body.style.cursor = "grab";
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === "alt " || e.key === "h") {
        setIsPanningEnabled(false);
        document.body.style.cursor = "default";
      }
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (isPanningEnabled) {
        document.body.style.cursor = "grabbing";
      }

      // Set focus to null to prevent triggering the last pressed button
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
    <CanvasContext.Provider value={canvas}>
      <div
        className={`${Object.keys(fonts).map(
          (font) => fonts[font].style.fontFamily
        )}`}
      >
        <div>
          {/* Toolbar Region */}
{/* Dashboard isn't available to access */}
{/* <div className=" absolute top-0 left-0 mt-1 px-2 py-1 pb-3 z-[51]">
            {/* <div className="select-none mt-1 border border-gray-300 w-fit px-2 py-1 rounded-lg shadow-md flex items-center"> */}
            <Link
              href="/dashboard/templates"
              className="bg-white flex items-center text-sm rounded-lg hover:bg-blue-50 hover:text-blue-500 cursor-pointer  border border-gray-300 w-fit px-1 !pr-4 py-1 shadow-md"
            >
              <ToolbarIcon
                icon={FaHome}
                // className="text-red-500 hover:text-red-500 hover:bg-red-100 "
                className="hover:!bg-blue-50"
                title="Delete"
                // onClick={goBackToTemplate}
              />{" "}
              Go Back
            </Link>
            {/* </div> */}
          </div> */}

          <div
            className=" absolute top-0 left-0 w-full px-2 py-1 pb-3 z-[50]"
            id="toolbar-panel"
          >
            {canvasRef.current && <ToolbarPanel />}
          </div>

          {/* Layers Region */}
          <aside
            className="absolute left-0 top-1/2 -translate-y-1/2 w-64 px-3  z-50"
            id="layers-panel"
          >
            <div className="border border-gray-300 rounded-md shadow-md bg-white max-h-[720px]">
              <CanvasPanel activeObject={activeObject} />
            </div>
          </aside>

          {/* Canvas Editor Region */}

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
            <div style={{ width: "100vw", height: "100vh" }}>
              <div
                className="h-full w-full flex items-center justify-center focus-visible:outline-none focus-visible:border-none"
                id="workspace"
                tabIndex={1000}
              >
                <canvas
                  className="border shadow "
                  id="editor-canvas"
                  ref={canvasRef}
                ></canvas>
              </div>
            </div>
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
        </div>
      </div>
    </CanvasContext.Provider>
  );
}
