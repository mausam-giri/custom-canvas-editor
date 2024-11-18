import { Input } from "@/components/CustomInput";
import {
  ActiveObjectProps,
  SettingProps,
  StringKeysOfActiveObject,
} from "./interfaces";

export default function StringSetting<T extends StringKeysOfActiveObject>({
  property,
  propertyValue,
  update,
  updateSetting,
  parser,
  ...inputProps
}: SettingProps<T>) {
  return (
    <Input
      name={property}
      value={propertyValue}
      type="text"
      onChange={(event) => {
        const val = event.target.value;
        if (!val) return;

        const updatedValue = update?.(val as ActiveObjectProps[T]);
        updateSetting?.(property, updatedValue as ActiveObjectProps[T]);
      }}
      {...inputProps}
    />
  );
}
