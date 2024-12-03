import {
  DownIcon,
  EyeCloseIcon,
  EyeOpenIcon,
  LockIcon,
  UnlockIcon,
  UpIcon,
} from "@/components/icons";
import ToolbarIcon from "@/components/ToolbarIcon";
import { CanvasContext } from "@/context/CanvasContext";
import { ActiveSelection, FabricObject } from "fabric";
import { useContext, useEffect, useState } from "react";

export default function LayersPanel() {
  const canvas = useContext(CanvasContext);
  // const { canvas } = useCanvasContext();
  const [layers, setLayers] = useState(canvas?.getObjects());

  function handleObjectSelected() {
    setLayers([]);
    setLayers(canvas?.getObjects());
  }

  function selectObjectInCanvas(layer: FabricObject) {
    canvas?.discardActiveObject();
    canvas?.setActiveObject(layer);
    canvas?.requestRenderAll();
  }

  function isLayerActive(layer: FabricObject) {
    const activeObject = canvas?.getActiveObject();

    if (!activeObject) return false;

    if (activeObject instanceof ActiveSelection) {
      return activeObject.getObjects().some((x) => x.id === layer.id);
    } else {
      return activeObject.id == layer.id;
    }
  }

  // function sendToBack() {
  //   const activeObject = canvas?.getActiveObject();
  //   if (activeObject) canvas?.sendObjectToBack(activeObject);
  //   setLayers(canvas?.getObjects());
  // }

  function sendBackwards() {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) canvas?.sendObjectBackwards(activeObject);
    setLayers(canvas?.getObjects());
  }
  // function bringToFront() {
  //   const activeObject = canvas?.getActiveObject();
  //   if (activeObject) canvas?.bringObjectToFront(activeObject);
  //   setLayers(canvas?.getObjects());
  // }

  function bringForward() {
    const activeObject = canvas?.getActiveObject();
    if (activeObject) canvas?.bringObjectForward(activeObject);
    setLayers(canvas?.getObjects());
  }

  useEffect(() => {
    if (canvas) {
      canvas.on("object:added", () => setLayers(canvas?.getObjects()));
      canvas.on("object:removed", () => setLayers(canvas?.getObjects()));
      canvas.on("object:modified", () => setLayers(canvas?.getObjects()));
      // canvas.on("object:modified", updateObjects);

      canvas.on("selection:created", handleObjectSelected);
      canvas.on("selection:updated", handleObjectSelected);
      canvas.on("selection:cleared", handleObjectSelected);

      return () => {
        canvas.off("selection:created", handleObjectSelected);
        canvas.off("selection:updated", handleObjectSelected);
        canvas.off("selection:cleared", () => handleObjectSelected);
      };
    }
  }, [canvas, handleObjectSelected]);

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-3 pb-2">
        <div className="pb-2 border-b flex gap-4 justify-between items-center">
          <p className="font-medium">Layers</p>
          <div className="flex gap-1">
            <ToolbarIcon
              icon={UpIcon}
              title="Move layer up"
              className="p-1.5 w-7 h-7"
              onClick={bringForward}
            />
            <ToolbarIcon
              icon={DownIcon}
              title="Move layer down"
              className="p-1.5 w-7 h-7"
              onClick={sendBackwards}
            />
          </div>
        </div>
        <ul className="space-y-1">
          {layers
            ?.map((layer, index) => (
              <li
                key={index}
                onClick={() => selectObjectInCanvas(layer)}
                className={`cursor-default py-2 px-3 rounded ${
                  isLayerActive(layer) ? "selected-layer bg-gray-300" : ""
                }`}
              >
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-x-1">
                    {/* <span className="">{index}</span> */}
                    <span>{layer.label}</span>
                  </div>

                  <div className="layer-action flex items-center justify-end">
                    <ObjectVisibilityComponent layer={layer} />
                    <ObjectLockComponent layer={layer} />
                  </div>
                </div>
              </li>
            ))
            .reverse()}
          {layers?.length == 0 && (
            <li className="text-center text-gray-500">No object present</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function ObjectVisibilityComponent(props: { layer: FabricObject }) {
  const canvas = useContext(CanvasContext);
  // const { canvas } = useCanvasContext();

  function handleVisibility() {
    canvas?.discardActiveObject();
    const isVisible = props.layer.visible;
    props.layer.set({
      visible: !isVisible,
      hasControls: !isVisible,
      hasBorders: !isVisible,
      lockMovementX: isVisible,
      lockMovementY: isVisible,
    });

    if (!isVisible) canvas?.setActiveObject(props.layer);

    canvas?.requestRenderAll();
  }
  return (
    <>
      {props.layer.visible ? (
        <EyeOpenIcon
          onClick={handleVisibility}
          className="px-1 py-1 w-6 h-6 hover:cursor-pointer"
        />
      ) : (
        <EyeCloseIcon
          onClick={handleVisibility}
          className="px-1 py-1 w-6 h-6 hover:cursor-pointer"
        />
      )}
    </>
  );
}

function ObjectLockComponent(props: { layer: FabricObject }) {
  const canvas = useContext(CanvasContext);
  // const { canvas } = useCanvasContext();

  function handleLockin() {
    const isUnlocked = props.layer.selectable;

    canvas?.discardActiveObject();
    props.layer.set({
      selectable: !isUnlocked,
      hasControls: !isUnlocked,
      hasBorders: !isUnlocked,
      lockMovementX: isUnlocked,
      lockMovementY: isUnlocked,
      hoverCursor: isUnlocked ? "default" : "move",
    });

    if (!isUnlocked) canvas?.setActiveObject(props.layer);

    canvas?.requestRenderAll();
  }

  return (
    <>
      {props.layer.selectable ? (
        <UnlockIcon
          onClick={handleLockin}
          className="px-1 py-1 w-6 h-6 hover:cursor-pointer"
        />
      ) : (
        <LockIcon
          onClick={handleLockin}
          className=" py-1 w-6 h-6 hover:cursor-pointer"
        />
      )}
    </>
  );
}
