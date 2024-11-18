import { FabricObject } from "fabric";

declare module "fabric" {
  // to have the properties recognized on the instance and in the constructor
  interface FabricObject {
    id?: string;
    label?: string;
  }
  // to have the properties typed in the exported object
  interface SerializedObjectProps {
    id?: string;
    label?: string;
  }
}

// to actually have the properties added to the serialized object
FabricObject.customProperties = ["id", "label"];
