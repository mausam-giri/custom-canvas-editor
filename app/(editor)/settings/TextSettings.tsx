"use client";
import { FontFamilyIcon, FontWeightIcon } from "@/components/icons";
import StringSetting from "./StringSetting";
import {
  ActiveObjectProps,
  KeyOfActiveObject,
  UpdateFunction,
} from "./interfaces";
import { ChangeEvent, useEffect, useState } from "react";
import fonts from "@/lib/fonts";

interface ObjectSettingProps<T extends Partial<KeyOfActiveObject>> {
  activeObjectProps: ActiveObjectProps;
  updateObjectProps: UpdateFunction<T>;
  updateObjectSetting: UpdateFunction<T>;
}

export default function TextSettings(
  props: ObjectSettingProps<KeyOfActiveObject>
) {
  const fontWeight = [100, 200, 300, 400, 500, 600, 800];
  const handleFontFamilyChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const fontName = event.target.value;
    const fontFamily = fonts[fontName].style.fontFamily;

    props.updateObjectProps("fontFamily", fontFamily);
    props.updateObjectSetting("fontFamily", fontFamily);
  };

  const handleWeightChange = (event: ChangeEvent<HTMLSelectElement>) => {
    // setSelectedWeight(event.target.value);
    props.updateObjectProps("fontWeight", event.target.value);
    props.updateObjectSetting("fontWeight", event.target.value);
  };

  return (
    <>
      <div className="space-y-3">
        <div title="Font Family" className="flex gap-2 items-center">
          <label
            htmlFor={"fontFamily"}
            className="w-5 h-5 opacity-60 relative flex items-center justify-center"
          >
            <FontFamilyIcon className="w-4 h-4" />
          </label>
          <div className="flex-1">
            <select
              name="fontFamily"
              // defaultValue={props.activeObjectProps.fontFamily}
              onChange={handleFontFamilyChange}
              className="w-full min-w-10 py-1 bg-white border px-2 rounded-md  outline-none focus:outline-blue-500"
            >
              {Object.keys(fonts).map((fontName) => (
                <option
                  key={fontName}
                  value={fontName}
                  style={{ fontFamily: fonts[fontName].style.fontFamily }}
                >
                  {fontName}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div title="Font Weight" className="flex items-center gap-2">
          <label
            htmlFor={"fontWeight"}
            className="w-5 h-5 opacity-60 relative flex items-center justify-center"
          >
            <FontWeightIcon className="w-4 h-4" />
          </label>
          <div className="flex-1">
            <select
              name="fontWeight"
              value={props.activeObjectProps.fontWeight}
              onChange={handleWeightChange}
              className="w-full min-w-10 py-1 bg-white border px-2 rounded-md  outline-none focus:outline-blue-500"
            >
              {fontWeight.map((weight) => (
                <option key={weight} value={weight}>
                  {weight}
                </option>
              ))}
            </select>
          </div>
          {/* <div style={{fontFamily: Object.keys(fonts)[0]}}> 
            Mausam
          </div> */}
        </div>
      </div>
    </>
  );
}
