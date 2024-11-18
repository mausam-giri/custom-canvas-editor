"use client";

import { CanvasContext } from "@/context/CanvasContext";
import { useContext, useEffect } from "react";
import ToolbarIcon from "@/components/ToolbarIcon";
import {
  CircleIcon,
  CloneIcon,
  DeleteIcon,
  LineIcon,
  RectangleIcon,
  TextIcon,
} from "@/components/icons";
import ImageTool from "./tools/ImageTool";
import ToolbarComponent from "./tools/ToolbarComponent";
import { ActiveSelection } from "fabric";

const TOOL_TYPE_MAPPER: Record<string, string> = {
  rect: "Rectangle",
  circle: "Circle",
  line: "Line",
  textbox: "Text",
  image: "Image",
};

export default function ToolbarPanel() {
  const canvas = useContext(CanvasContext);

  function deleteObject() {
    const activeObject = canvas?.getActiveObject();

    if (!canvas || !activeObject) {
      console.log("No active objects to delete");
      return;
    }
    if (activeObject instanceof ActiveSelection) {
      activeObject.forEachObject((obj) => canvas.remove(obj));
    } else {
      canvas.remove(activeObject);
    }

    canvas.discardActiveObject();
    canvas.requestRenderAll();
  }

  async function cloneObject() {
    const activeObject = canvas?.getActiveObject();
    if (!canvas || !activeObject) return;

    const clonedObject = await activeObject.clone();
    canvas.discardActiveObject();
    clonedObject.set({
      left: clonedObject.left + 10,
      top: clonedObject.top + 10,
      evented: true,
    });

    if (clonedObject instanceof ActiveSelection) {
      clonedObject.canvas = canvas;
      clonedObject.forEachObject((obj) => {
        obj.label = TOOL_TYPE_MAPPER[obj.type];
        canvas.add(obj);
      });
      clonedObject.setCoords();
    } else {
      clonedObject.label = activeObject.label;
      canvas.add(clonedObject);
    }

    canvas.setActiveObject(clonedObject);
    canvas.requestRenderAll();
  }

  function canvasKeyboardListener(event: KeyboardEvent) {
    console.log("delting from keyboard");
    if (event.code == "Delete") deleteObject();
  }

  useEffect(() => {
    if (canvas) {
      const canvasWrapper: HTMLDivElement | null =
        document.querySelector("#workspace");
      if (canvasWrapper) {
        canvasWrapper.focus();
        canvasWrapper.addEventListener("keydown", canvasKeyboardListener);
      }

      return () => {
        canvasWrapper?.removeEventListener("keydown", canvasKeyboardListener);
      };
    }
  }, [canvas, canvasKeyboardListener]);

  return (
    <div className="select-none mt-1 mx-auto border border-gray-300 w-fit px-2 py-1 rounded-lg shadow-md flex items-center">
      <div className="flex gap-1 items-center text-gray-700">
        <ToolbarComponent
          toolType="rectangle"
          icon={RectangleIcon}
          title="Rectangle"
        />
        <ToolbarComponent toolType="circle" icon={CircleIcon} title="Circle" />
        <ToolbarComponent toolType="line" icon={LineIcon} title="Line" />
        <ToolbarComponent toolType="text" icon={TextIcon} title="Text" />
        <ImageTool />
      </div>
      <span className="px-2 text-gray-500">|</span>
      <div className="flex gap-1 items-center text-gray-700">
        <ToolbarIcon icon={CloneIcon} title="Clone" onClick={cloneObject} />
        <ToolbarIcon
          icon={DeleteIcon}
          className="text-red-500 bg-red-100 hover:text-red-500 hover:bg-red-100"
          title="Delete"
          onClick={deleteObject}
        />
      </div>
    </div>
  );
}
