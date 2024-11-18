import ColorPicker from "@/components/ColorPicker";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AngleIcon,
  BoldIcon,
  CornerRadiusIcon,
  FontSizeIcon,
  ItalicIcon,
  LineHeightIcon,
  LineThroughIcon,
  OpacityIcon,
  StrokeWidthIcon,
  UnderlineIcon,
} from "@/components/icons";
import { CanvasContext } from "@/context/CanvasContext";
import {
  BasicTransformEvent,
  FabricObject,
  ModifiedEvent,
  TPointerEvent,
} from "fabric";
import { useContext, useEffect, useState } from "react";
import {
  ActiveObjectProps,
  CanvasObject,
  KeyOfActiveObject,
  UpdateFunction,
} from "../settings/interfaces";
import NumericSetting from "../settings/NumericSetting";
import TextSettings from "../settings/TextSettings";
import ToolbarIcon from "@/components/ToolbarIcon";

export default function SettingsPanel(props: { activeObject: FabricObject }) {
  const canvas = useContext(CanvasContext);
  const { activeObject } = props;
  const [activeObjectProps, setActiveObjectProps] = useState<ActiveObjectProps>(
    {
      left: Math.round(activeObject.left),
      top: Math.round(activeObject.top),
      width: activeObject.width,
      height: activeObject.height,
      scaledWidth: Math.round(activeObject.getScaledWidth()),
      scaledHeight: Math.round(activeObject.getScaledHeight()),
      radius: Math.round(activeObject.get("radius") || 0),
      rx: Math.round(activeObject.get("rx")),
      ry: Math.round(activeObject.get("ry")),
      opacity: activeObject.opacity * 100,
      angle: activeObject.angle,
      strokeWidth: activeObject.strokeWidth,
      stroke: activeObject.stroke,
      fill: activeObject.fill,
      scaleX: activeObject.scaleX,
      scaleY: activeObject.scaleY,
      fontSize: activeObject.get("fontSize"),
      fontStyle: activeObject.get("fontStyle"),
      fontFamily: activeObject.get("fontFamily"),
      fontWeight: activeObject.get("fontWeight"),
      lineHeight: activeObject.get("lineHeight"),
      linethrough: activeObject.get("linethrough"),
      textAlign: activeObject.get("textAlign"),
      underline: activeObject.get("underline"),
    }
  );

  function updateActiveObjectProps<T extends KeyOfActiveObject>(
    key: T,
    value: ActiveObjectProps[T]
  ) {
    setActiveObjectProps((p) => ({
      ...p,
      [key]: value,
    }));
  }

  function updateActiveObjectPropsFromCanvas(modifiedObject: CanvasObject) {
    setActiveObjectProps({
      width: modifiedObject.width,
      height: modifiedObject.height,
      scaledWidth: Math.round(modifiedObject.getScaledWidth()),
      scaledHeight: Math.round(modifiedObject.getScaledHeight()),
      left: Math.round(modifiedObject.left),
      top: Math.round(modifiedObject.top),
      rx: Math.round(modifiedObject.get("rx") || 0),
      ry: Math.round(modifiedObject.get("ry") || 0),
      opacity: modifiedObject.opacity * 100,
      angle: modifiedObject.angle,
      stroke: modifiedObject.stroke,
      strokeWidth: modifiedObject.strokeWidth,
      fill: modifiedObject.fill,
      radius: Math.round(modifiedObject.get("radius") || 0),
      scaleX: modifiedObject.scaleX,
      scaleY: modifiedObject.scaleY,
      fontSize: modifiedObject.get("fontSize"),
      fontStyle: modifiedObject.get("fontStyle"),
      fontFamily: modifiedObject.get("fontFamily"),
      fontWeight: modifiedObject.get("fontWeight"),
      lineHeight: modifiedObject.get("lineHeight"),
      linethrough: modifiedObject.get("linethrough"),
      textAlign: modifiedObject.get("textAlign"),
      underline: modifiedObject.get("underline"),
    });
  }

  function updateObjectSetting<T extends KeyOfActiveObject>(
    name: T,
    value: ActiveObjectProps[T]
  ) {
    activeObject.set(name, value);
    activeObject.setCoords();
    canvas?.renderAll();
  }

  const updateSetting: UpdateFunction<KeyOfActiveObject> = (name, value) => {
    updateObjectSetting(name, value);
    updateActiveObjectProps(name, value);
  };

  function handleObjectModified(event: ModifiedEvent<TPointerEvent>) {
    const modifiedObject = event.target;
    updateActiveObjectPropsFromCanvas(modifiedObject);
  }

  function handleObjectScaling(event: BasicTransformEvent<TPointerEvent>) {
    const modifiedObject = event.transform.target;

    updateActiveObjectPropsFromCanvas(modifiedObject);
  }

  useEffect(() => {
    activeObject.on("modified", handleObjectModified);
    activeObject.on("scaling", handleObjectScaling);
    activeObject.on("moving", handleObjectScaling);
    activeObject.on("skewing", handleObjectScaling);
    activeObject.on("rotating", handleObjectScaling);

    return () => {
      activeObject.off("scaling", handleObjectModified);
      activeObject.off("scaling", handleObjectScaling);
      activeObject.off("moving", handleObjectScaling);
      activeObject.off("skewing", handleObjectScaling);
      activeObject.off("rotating", handleObjectScaling);
    };
  }, [activeObject, handleObjectModified, handleObjectScaling]);

  const isRectangle = activeObject?.type == "rect";
  const isCircle = activeObject?.type == "circle";
  const isLine = activeObject?.type == "line";
  const isText = activeObject?.type == "textbox";
  const isImage = activeObject?.type == "image";

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-3 border-b pb-3">
        <p className="font-medium">Rectangle</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <NumericSetting
            property={"left"}
            propertyValue={activeObjectProps.left}
            updateSetting={updateSetting}
            label="X"
            title="X coordinate of top left corner"
          />

          <NumericSetting
            property={"top"}
            propertyValue={activeObjectProps.top}
            updateSetting={updateSetting}
            label="Y"
            title="Y coordinate of top left corner"
          />

          <NumericSetting
            label={isLine ? "S" : "W"}
            property="width"
            title="Width"
            propertyValue={activeObjectProps.scaledWidth}
            update={(value) => {
              const newWidth = value / activeObjectProps.scaleX;
              updateActiveObjectProps("scaledWidth", value);
              return newWidth;
            }}
            updateSetting={updateObjectSetting}
            // visible={isRectangle || isImage || isLine}
          />

          <NumericSetting
            label={"H"}
            property="height"
            title="height"
            propertyValue={activeObjectProps.scaledHeight}
            update={(value) => {
              const newHeight = value / activeObjectProps.scaleY;
              updateActiveObjectProps("scaledHeight", value);
              return newHeight;
            }}
            updateSetting={updateObjectSetting}
            visible={isRectangle || isImage || isLine}
          />

          <NumericSetting
            label="R"
            property="radius"
            title="Radius"
            propertyValue={Math.round(
              activeObjectProps.radius * activeObjectProps.scaleX
            )}
            update={(value) => {
              updateActiveObjectProps("radius", value);
              return value / activeObjectProps.scaleX;
            }}
            updateSetting={updateObjectSetting}
            visible={isCircle}
          />

          <NumericSetting
            property="rx"
            title="Corner Radius"
            propertyValue={activeObjectProps.rx || activeObjectProps.ry}
            update={(value) => {
              updateSetting("rx", value);
              updateSetting("ry", value);
            }}
            visible={isRectangle}
          >
            <CornerRadiusIcon />
          </NumericSetting>

          <NumericSetting
            property="opacity"
            title="Opacity"
            propertyValue={activeObjectProps.opacity}
            update={(value) => {
              updateActiveObjectProps("opacity", value);
              return parseFloat((value / 100).toFixed(1));
            }}
            min={0}
            max={100}
            updateSetting={updateObjectSetting}
          >
            <OpacityIcon />
          </NumericSetting>

          <NumericSetting
            property="angle"
            title="Angle"
            propertyValue={activeObjectProps.angle}
            parser={parseFloat}
            update={(value) => {
              const val = parseFloat(value.toFixed(2));
              activeObject.rotate(val);
              activeObject.setCoords();
              canvas?.requestRenderAll();

              updateActiveObjectProps("angle", val);
            }}
            step=".01"
          >
            <AngleIcon />
          </NumericSetting>
        </div>
      </div>

      {isText && (
        <div className="space-y-3 border-b pb-3">
          <div className="grid grid-cols-4 gap-x-4 gap-y-2">
            <ToolbarIcon
              className="opacity-60"
              icon={AlignLeftIcon}
              title="Align text left"
              onClick={() => {
                updateSetting("textAlign", "left");
              }}
            />
            <ToolbarIcon
              className="opacity-60"
              icon={AlignCenterIcon}
              title="Align text center"
              onClick={() => {
                updateSetting("textAlign", "center");
              }}
            />
            <ToolbarIcon
              className="opacity-60"
              icon={AlignRightIcon}
              title="Align text right"
              onClick={() => {
                updateSetting("textAlign", "right");
              }}
            />
            <ToolbarIcon
              className="opacity-60"
              icon={AlignJustifyIcon}
              title="Align text justify"
              onClick={() => {
                updateSetting("textAlign", "justify");
              }}
            />

            <ToolbarIcon
              className="opacity-60"
              icon={BoldIcon}
              title="Bold"
              onClick={() => {
                const curr = activeObject.get("fontWeight");
                if (curr != "bold") updateSetting("fontWeight", "bold");
                else updateSetting("fontWeight", "normal");
              }}
            />
            <ToolbarIcon
              className="opacity-60"
              icon={ItalicIcon}
              title="Italic"
              onClick={() => {
                const curr = activeObject.get("fontStyle");
                if (curr != "italic") updateSetting("fontStyle", "italic");
                else updateSetting("fontStyle", "normal");
              }}
            />
            <ToolbarIcon
              className="opacity-60"
              icon={UnderlineIcon}
              title="Italic"
              onClick={() => {
                const curr = activeObject.get("underline");
                if (!curr) updateSetting("underline", true);
                else updateSetting("underline", false);
              }}
            />
            <ToolbarIcon
              className="opacity-60"
              icon={LineThroughIcon}
              title="Strikethrough"
              onClick={() => {
                const curr = activeObject.get("linethrough");
                if (!curr) updateSetting("linethrough", true);
                else updateSetting("linethrough", false);
              }}
            />
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <NumericSetting
              property="fontSize"
              title="Font Size"
              propertyValue={activeObject.get("fontSize")}
              updateSetting={updateSetting}
            >
              <FontSizeIcon className="w-4 h-4" />
            </NumericSetting>
            <NumericSetting
              property="lineHeight"
              title="Line Height"
              propertyValue={activeObject.get("lineHeight")}
              updateSetting={updateSetting}
            >
              <LineHeightIcon className="w-4 h-4" />
            </NumericSetting>
          </div>

          <TextSettings
            activeObjectProps={activeObjectProps}
            updateObjectProps={updateActiveObjectProps}
            updateObjectSetting={updateObjectSetting}
          />
        </div>
      )}

      <div className="space-y-3 border-b pb-3">
        <NumericSetting
          property="strokeWidth"
          title={"Stroke/Border Width"}
          propertyValue={activeObjectProps.strokeWidth}
          updateSetting={updateSetting}
          min={0}
        >
          <StrokeWidthIcon />
        </NumericSetting>

        <div className="space-y-0.5">
          <p>Stroke color</p>
          <ColorPicker
            fill={activeObjectProps.stroke}
            onColorChange={(color) => {
              const newColor = color || "transparent";
              updateSetting("stroke", newColor);
            }}
          />
        </div>

        <div className="space-y-0.5" hidden={isImage && isLine}>
          <p>Background color</p>
          <ColorPicker
            fill={activeObjectProps.fill}
            onColorChange={(color) => {
              const newColor = color || "transparent";
              updateSetting("fill", newColor);
            }}
          />
        </div>
      </div>
    </div>
  );
}
