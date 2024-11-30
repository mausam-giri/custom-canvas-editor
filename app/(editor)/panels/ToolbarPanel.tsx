"use client";

import { CanvasContext } from "@/context/CanvasContext";
import { useContext, useEffect, useState } from "react";
import ToolbarIcon from "@/components/ToolbarIcon";
import {
  CircleIcon,
  CloneIcon,
  DeleteIcon,
  ExportIcon,
  LineIcon,
  RectangleIcon,
  SaveIcon,
  TextIcon,
} from "@/components/icons";
import ImageTool from "../tools/ImageTool";
import ToolbarComponent from "../tools/ToolbarComponent";
import { ActiveSelection } from "fabric";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { saveAs } from "file-saver";

const TOOL_TYPE_MAPPER: Record<string, string> = {
  rect: "Rectangle",
  circle: "Circle",
  line: "Line",
  textbox: "Text",
  image: "Image",
};

export default function ToolbarPanel() {
  const router = useRouter();
  const params = useSearchParams();
  const userId = params.get("_p");
  const name = params.get("_r");
  const id = params.get("_m");

  const canvas = useContext(CanvasContext);
  const [canvasJson, setCanvasJson] = useState("{}");

  async function fetchCanvasData() {
    try {
      const fetchPromise = fetch(
        "http://localhost:3001/api/editor/get-template",
        {
          method: "POST",
          body: JSON.stringify({
            userId: userId,
            id: id,
          }),
        }
      ).then(async (response) => {
        if (response.ok) {
          const result = await response.json();
          const templateData = result.data;
          const { canvasWidth, canvasHeight, canvasObjectData } = templateData;
          if (!canvasHeight || !canvasWidth || !canvasObjectData)
            throw Error("Invalid template data");
          canvas?.setDimensions({ width: canvasWidth, height: canvasHeight });
          setCanvasJson(templateData.canvasObjectData);
          return result;
        } else {
          throw new Error("Failed to fetch data");
        }
      });

      toast.promise(fetchPromise, {
        loading: "Fetching canvas data...",
        success: "Canvas data loaded successfully!",
        error: "Failed to load canvas data.",
      });
    } catch (error) {
      console.error("Error fetching canvas data:", error);
    }
  }
  useEffect(() => {
    fetchCanvasData();
  }, [userId, id]);

  useEffect(() => {
    if (canvasJson) {
      canvas?.loadFromJSON(canvasJson, () => {
        canvas.renderAll();
      });
    }
  }, [canvasJson]);

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

  // Save template
  async function saveTemplate() {
    try {
      const jsonData = canvas?.toJSON();
      const requestData = {
        userId: userId,
        id: id,
        templateData: {
          canvasWidth: canvas?.getWidth(),
          canvasHeight: canvas?.getHeight(),
          canvasObjectData: jsonData,
        },
      };
      const response = await toast.promise(
        fetch("/api/save-template", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        }),
        {
          loading: "Saving template...",
          success: "Template saved successfully!",
          error: "Failed to save the template. Please try again.",
        }
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error saving template:", error);
    }
  }

  // Save Template and Close
  async function saveTemplateAndClose() {
    try {
      await saveTemplate();

      toast("Template saved successfully! Redirecting to templates...", {
        icon: "➡️",
      });

      setTimeout(() => {
        router.push("/dashboard/templates");
      }, 1000);
    } catch (error) {
      console.error("Error during save and close:", error);
    }
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

  function exportToImage() {
    if (canvas) {
      const dataUrl = canvas.toDataURL({
        format: "png",
        quality: 1.0,
        multiplier: 1.5,
      });
      // format: format === "jpg" ? "jpeg" : "png",
      // quality: 1.0,
      saveAs(
        dataUrl,
        `${name}-${new Date().toLocaleDateString()}-Pramman-Patra.png`
      );
      toast.success("Exported to PNG");
    }
  }

  return (
    <div className="bg-white select-none mt-1 mx-auto border border-gray-300 w-fit px-2 py-1 rounded-lg shadow-md flex items-center">
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
          className="text-red-500 hover:text-red-500 hover:bg-red-100"
          title="Delete"
          onClick={deleteObject}
        />
      </div>
      <span className="px-2 text-gray-500">|</span>
      <div className="flex gap-2 items-center text-gray-700">
        <ToolbarIcon
          icon={SaveIcon}
          className="text-blue-500 bg-blue-50 hover:text-blue-500 hover:bg-blue-100"
          title="Save"
          onClick={saveTemplate}
        />
        <button
          onClick={saveTemplateAndClose}
          className="text-sm font-medium px-2.5 py-2 rounded-md text-blue-500 bg-blue-50 hover:text-blue-500 hover:bg-blue-100"
        >
          Save & Close
        </button>
      </div>
      <span className="px-2 text-gray-500">|</span>
      <div className="flex gap-2 items-center text-gray-700">
        <ToolbarIcon
          icon={ExportIcon}
          // className="text-blue-500 bg-blue-50 hover:text-blue-500 hover:bg-blue-100"
          title="Export to PNG"
          onClick={exportToImage}
        />
      </div>
    </div>
  );
}
