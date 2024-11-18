import { Input } from "@/components/CustomInput";
import { NumericKeysOfActiveObject, SettingProps } from "./interfaces";

export default function NumericSetting<T extends NumericKeysOfActiveObject>({
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
      type="number"
      onChange={(event) => {
        const val = event.target.value;
        if (!val) return;
        let parserFn = parser || parseInt;
        const parsedValue = parserFn(val);
        const updatedValue = update?.(parsedValue);
        updateSetting?.(property, updatedValue || parsedValue);
      }}
      {...inputProps}
    />
  );
}
