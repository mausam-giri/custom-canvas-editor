import ToolbarIcon, { ToolbarIconProps } from "@/components/ToolbarIcon";
import { CanvasContext } from "@/context/CanvasContext";
import { FabricObject } from "fabric";
import { useContext } from "react";
import { drawCircle, drawLine, drawRectangle, drawText } from "./drawTools";
import { getDefaultProps } from "./defaults";

type ToolType = "rectangle" | "circle" | "line" | "text";

interface ToolbarComponentProps extends ToolbarIconProps {
  toolType: ToolType;
}

const ToolDrawerMapper: Record<ToolType, () => FabricObject> = {
  rectangle: drawRectangle,
  circle: drawCircle,
  line: drawLine,
  text: drawText,
};

export default function ToolbarComponent(props: ToolbarComponentProps) {
  const canvas = useContext(CanvasContext);
  const { toolType, ...iconProps } = props;

  function add() {
    const drawShape = ToolDrawerMapper[props.toolType];
    const shape = drawShape();

    shape.set(getDefaultProps());

    canvas?.add(shape);
  }

  return <ToolbarIcon onClick={add} {...iconProps} />;
}
