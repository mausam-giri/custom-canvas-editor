declare module "react-map-interaction" {
  export type Translation = {
    x: number;
    y: number;
  };

  export type ScaleTranslation = {
    scale: number;
    translation: Translation;
  };

  export type MapInteractionProps = {
    children?: (
      scaleTranslation: ScaleTranslation
    ) => import("react").ReactNode;

    value?: ScaleTranslation;

    defaultValue?: ScaleTranslation;

    disableZoom?: boolean;

    disablePan?: boolean;

    translationBounds?: {
      xMin?: number;
      xMax?: number;
      yMin?: number;
      yMax?: number;
    };

    onChange?: (scaleTranslation: ScaleTranslation) => void;

    minScale?: number;
    maxScale?: number;

    showControls?: boolean;

    plusBtnContents?: import("react").ReactNode;
    minusBtnContents?: import("react").ReactNode;

    controlsClass?: string;

    btnClass?: string;

    plusBtnClass?: string;
    minusBtnClass?: string;
  };
  export const MapInteraction: import("react").FC<MapInteractionProps>;

  export type MapInteractionCSSProps = import("react").PropsWithChildren<
    Omit<MapInteractionProps, "children">
  >;
  export const MapInteractionCSS: import("react").FC<MapInteractionCSSProps>;

  export default MapInteraction;
}
