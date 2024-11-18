import { CustomInputProps } from "@/components/CustomInput";
import {
  FabricObject,
  FabricObjectProps,
  ObjectEvents,
  SerializedObjectProps,
  TFiller,
} from "fabric";

export type ITextAlign = "left" | "right" | "center" | "justify";
export type IFontWeight = "normal" | "medium" | "bold" | "extrabold";
export type IFontStyle = "normal" | "italic";

export interface TextObjectProps {
  fontSize: number;
  lineHeight: number;
  textAlign: ITextAlign;
  fontWeight: IFontWeight;
  fontStyle: IFontStyle;
  underline: boolean;
  linethrough: boolean;
  fontFamily: string;
}

export interface ActiveObjectProps extends TextObjectProps {
  id?: string;
  left: number;
  top: number;
  width: number;
  scaleX: number;
  scaleY: number;
  scaledWidth: number;
  scaledHeight: number;
  height: number;
  radius: number;
  rx: number;
  ry: number;
  opacity: number;
  angle: number;
  strokeWidth: number;
  stroke: string | TFiller | null;
  fill: string | TFiller | null;
}

export type CanvasObject = FabricObject<
  Partial<FabricObjectProps>,
  SerializedObjectProps,
  ObjectEvents
>;

export type KeyOfActiveObject = keyof ActiveObjectProps;

export type NumericKeysOfActiveObject = {
  [K in KeyOfActiveObject]: ActiveObjectProps[K] extends number | undefined
    ? K
    : never;
}[KeyOfActiveObject];

export type StringKeysOfActiveObject = Exclude<
  {
    [K in KeyOfActiveObject]: ActiveObjectProps[K] extends string | undefined
      ? K
      : never;
  }[KeyOfActiveObject],
  never
>;

export type UpdateFunction<T extends KeyOfActiveObject> = (
  name: T,
  value: ActiveObjectProps[T]
) => void;

export interface SettingProps<T extends Partial<KeyOfActiveObject>>
  extends CustomInputProps {
  property: T;
  propertyValue: ActiveObjectProps[T];
  parser?: (value: string) => ActiveObjectProps[T];
  update?: (value: ActiveObjectProps[T]) => ActiveObjectProps[T] | void;
  updateSetting?: UpdateFunction<T>;
}
