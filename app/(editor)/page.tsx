"use client";

import { CanvasContext } from "@/context/CanvasContext";
import {
  Canvas,
  FabricObject,
  InteractiveFabricObject,
  TPointerEventInfo,
  Point,
} from "fabric";
import { useEffect, useRef, useState } from "react";
import ToolbarPanel from "./ToolbarPanel";
import { v4 as getUniqueId } from "uuid";

import fonts from "@/lib/fonts";
import CanvasPanel from "./CanvasPanel";
import ToolbarIcon from "@/components/ToolbarIcon";
import { FaHome } from "react-icons/fa";
import Link from "next/link";

export default function CertificateEditor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<Canvas>();
  const [activeObject, setActiveObject] = useState<FabricObject | null>(null);

  function initializeCanvas() {
    const initialCanvas = new Canvas("editor-canvas", {
      width: 778,
      height: 550,
    });

    initialCanvas.backgroundColor = "#fff";
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
  }

  function zoomInListener(event: TPointerEventInfo<WheelEvent>) {
    if (canvas) {
      console.log(event, event.e.deltaY);
      const currentVP = canvas.viewportTransform;
      const delta: number = event.e.deltaY;
      const currentZoom: number = canvas.getZoom();
      const zoomDelta: number = 0.05;
      const minAllowedZoom: number = 0.1; // 10 %
      const maxAllowedZoom: number = 3; // 300 %

      // new zoom
      let zoom: number = currentZoom;

      if (delta > 0) {
        zoom -= zoomDelta;
      } else {
        zoom += zoomDelta;
      }

      // prevent label from going out of the canvas
      const label: Object = canvas
        .getObjects()
        .filter((q: FabricObject) => q.type === "label")[0];

      // if within allow range, zoom to point otherwise skip event
      if (zoom >= minAllowedZoom && zoom <= maxAllowedZoom) {
        const point: Point = new Point(event.e.offsetX, event.e.offsetY);

        canvas.zoomToPoint(point, zoom);

        // const isOnScreen: boolean = (label as FabricObject).isOnScreen();
        // if (!isOnScreen) {
        //   canvas.setViewportTransform(currentVP);
        // }
      }

      event.e.preventDefault();
      event.e.stopPropagation();
    }
  }

  function zoomInListenerNew(event: TPointerEventInfo) {
    if (canvas) {
      const originalHeight = canvas.height;
      const originalWidth = canvas.width;
      // canvas.setDimensions(originalWidth * canvas.getZoom(), )
      canvas.setWidth(originalWidth * canvas.getZoom());
      canvas.setHeight(originalHeight * canvas.getZoom());
      canvas.renderAll();
    }
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
      // canvas.on("mouse:wheel", zoomInListenerNew);
      // canvas.on("mouse:move", (event) => {
      //   console.log(
      //     event.target?.getBoundingRect(),
      //     event.viewportPoint.x,
      //     event.viewportPoint.y
      //   );
      //   if (!event.target) canvas.setCursor("default");
      // });
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

  return (
    <CanvasContext.Provider value={canvas}>
      <div
        className={`${Object.keys(fonts).map(
          (font) => fonts[font].style.fontFamily
        )}`}
      >
        <div>
          {/* Toolbar Region */}
          <div className="absolute top-0 left-0  px-2 py-1 pb-3 z-[51]">
            <div className="select-none mt-1 border border-gray-300 w-fit px-2 py-1 rounded-lg shadow-md flex items-center">
              <Link
                href="/dashboard/templates"
                className="flex items-center text-sm rounded-md hover:bg-blue-50 hover:text-blue-500 cursor-pointer !px-1 !pr-2.5"
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
            </div>
          </div>
          <div
            className="absolute top-0 left-0 w-full px-2 py-1 pb-3 z-[50]"
            id="toolbar-panel"
          >
            {canvasRef.current && <ToolbarPanel />}
          </div>

          {/* Canvas Editor Region */}
          {/* <Suspense fallback={<Loading />}> */}
          <main className="flex mt-20 pb-10 pr-24">
            <div
              className="flex-1 flex items-center justify-center focus-visible:outline-none focus-visible:border-none"
              id="workspace"
              tabIndex={1000}
            >
              <canvas
                className="border shadow"
                id="editor-canvas"
                ref={canvasRef}
              ></canvas>
            </div>
          </main>
          {/* </Suspense> */}

          {/* Layers Region */}
          <aside
            className="absolute right-0 top-2 w-64 px-3  z-50"
            id="layers-panel"
          >
            <div className="border rounded-md shadow-md bg-white max-h-[720px]">
              <CanvasPanel activeObject={activeObject} />
            </div>
          </aside>
        </div>
      </div>
    </CanvasContext.Provider>
  );
}

{
  /* Settings Region */
}
{
  /* <aside
            className="absolute left-0 top-10 w-64 px-3  z-50"
            id="settings-panel"
          >
            <div className="p-3 pl-4 border rounded-md shadow-md bg-white max-h-[550px]">
              {activeObject && <SettingsPanel activeObject={activeObject} />}{" "}
              {!activeObject && <CanvasSettings />}
            </div>
          </aside> */
}
