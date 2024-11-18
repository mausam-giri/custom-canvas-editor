import { useState, useEffect, useRef } from "react";
import ToolbarIcon from "./ToolbarIcon";
import { TransparentColorIcon } from "./icons";
import { TFiller } from "fabric";

interface ColorpickerProps {
  fill: string | TFiller | null;
  onColorChange: (color: string) => void;
}
export default function ColorPicker({ fill, onColorChange }: ColorpickerProps) {
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const [showColorpicker, setShowColorpicker] = useState<boolean>(false);
  const [selectedColor, setSelectedColor] = useState<string | TFiller | null>(
    fill || "transparent"
  );

  const colorSwatches = [
    "#B80000",
    "#DB3E00",
    "#FCCB00",
    "#008B02",
    "#006B76",
    "#1273DE",
    "#004DCF",
    "#5300EB",
    "#EB9694",
    "#FAD0C3",
    "#FEF3BD",
    "#C1E1C5",
    "#BEDADC",
    "#C4DEF6",
    "#BED3F3",
  ];
  const [recentColors, setRecentColors] = useState<string[]>([]);

  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    onColorChange(color);
  };

  const handleHexChange = (event: React.FocusEvent<HTMLInputElement>) => {
    const hexValue = event.target.value;
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
      handleColorSelect(hexValue);
      recentColorChange(hexValue);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^#[0-9A-F]{6}$/i.test(value) || value === "transparent") {
      return;
    } else {
      if (selectedColor) event.target.value = selectedColor.toString();
    }
  };

  const toggleColorpicker = () => {
    setShowColorpicker(!showColorpicker);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      colorPickerRef.current &&
      !colorPickerRef.current.contains(event.target as Node | null)
    ) {
      setShowColorpicker(false);
    }
  };

  useEffect(() => {
    if (recentColors.length == 0) setRecentColors(colorSwatches.slice(0, 5));
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function recentColorChange(color: string) {
    if (!recentColors.includes(color)) {
      const updatedRecentColors = [color, ...recentColors].slice(0, 5);
      setRecentColors(updatedRecentColors);
    }
  }

  return (
    <div className="relative flex items-center">
      <div className="relative flex gap-1">
        {recentColors.map((color) => (
          <div
            key={color}
            title={color}
            className="selected-color w-5 h-5 rounded cursor-pointer"
            style={{ backgroundColor: color }}
            onClick={() => handleColorSelect(color)}
          ></div>
        ))}
      </div>
      <span className="px-2 text-gray-500">|</span>
      <div className="flex items-center cursor-pointer" ref={colorPickerRef}>
        <div
          title="Custom color"
          onClick={toggleColorpicker}
          className="inline-block relative p-px rounded border border-blue-300"
        >
          <div
            className="selected-color w-6 h-6 rounded "
            style={{
              backgroundColor: selectedColor?.toString(),
            }}
          ></div>
        </div>
        {showColorpicker && (
          <div className="absolute right-[105%] bottom-0">
            <div className="relative z-50 text-sm space-y-2 border shadow bg-white px-4 py-3 rounded-md">
              <div className="space-y-1">
                <p>Colors</p>
                <input
                  type="color"
                  className="w-full outline-none border-none border border-gray-600 overflow-hidden"
                  value={selectedColor?.toString()}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowColorpicker(true);
                  }}
                />
              </div>
              <div className="space-y-1">
                <p>Color Swatches</p>
                <div className="flex flex-wrap gap-2">
                  {colorSwatches.map((color, idx) => (
                    <div
                      key={idx}
                      className="selected-color w-6 h-6 rounded-md cursor-pointer"
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                    ></div>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <p>Hex code</p>
                <div className="border py-1 flex items-center rounded-md">
                  <span className="px-4">#</span>
                  <input
                    type="text"
                    className="border-none outline-none px-2 w-28"
                    maxLength={11}
                    value={selectedColor?.toString().replace("#", "")}
                    onChange={handleInputChange}
                    onBlur={handleHexChange}
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToolbarIcon
        icon={TransparentColorIcon}
        title="No color"
        name="transparent"
        className="w-8 h-8 rounded cursor-pointer border p-1 ml-2"
        onClick={() => {
          setSelectedColor("transparent");
          onColorChange("transparent");
        }}
      />
    </div>
  );
}
