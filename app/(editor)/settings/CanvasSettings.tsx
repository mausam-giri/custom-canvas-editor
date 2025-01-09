import { Input } from "@/components/CustomInput";
import { CanvasContext } from "@/context/CanvasContext";
import { FabricImage, TFiller } from "fabric";
import { useSearchParams } from "next/navigation";
import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";

export default function CanvasSettings() {
  const canvas = useContext(CanvasContext);
  // const { canvas } = useCanvasContext();

  const params = useSearchParams();
  const userId = params.get("_p");

  const inputColorRef = useRef<HTMLLabelElement>(null);
  const inputBackgroundImageRef = useRef<HTMLInputElement>(null);

  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState<
    string | TFiller
  >("#ffffff");

  useEffect(() => {
    if (canvas) {
      setCanvasWidth(canvas?.width);
      setCanvasHeight(canvas?.height);
      setCanvasBackgroundColor(canvas?.backgroundColor);
    }
  }, [canvas]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const parser = e.target.getAttribute("data-parse");
    const name = e.target.name;

    let value = 0;
    if (parser == "number") value = parseInt(e.target.value);
    if (parser == "float") value = parseFloat(e.target.value);

    if (name)
      switch (name) {
        case "width":
          setCanvasWidth(value);
          break;
        case "height":
          setCanvasHeight(value);
          break;
      }
  }

  function handleResize() {
    if (canvasWidth < 200 || canvasHeight < 200) return;

    if (canvas) {
      // console.log(canvasWidth, canvasHeight);
      canvas.setDimensions({
        width: canvasWidth,
        height: canvasHeight,
      });
      canvas.requestRenderAll();
    }
  }

  function handleColorChange(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e.target.value);
  }

  function handleCustomColorClick() {
    inputColorRef.current?.click();
  }

  // function uploadBackgroundImage(e: ChangeEvent<HTMLInputElement>) {
  //   if (!e.target.files) return;

  //   const file = e.target.files[0];
  //   if (file.type.startsWith("image")) {
  //     const url = URL.createObjectURL(file);
  //     const imgElem = document.createElement("img");
  //     imgElem.src = url;
  //     imgElem.onload = () => {
  //       const img = new FabricImage(imgElem, {
  //         scaleX: canvas!.width / imgElem.width,
  //         scaleY: canvas!.height / imgElem.height,
  //       });
  //       canvas?.set("backgroundImage", img);
  //       canvas?.requestRenderAll();
  //     };
  //   } else {
  //     alert("Invalid file chosen for background image. File must be an image.");
  //   }
  // }

  async function uploadBackgroundImage(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.files) return;
    console.log("file selected");

    const file = e.target.files[0];
    if (file.type.startsWith("image")) {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", userId as string);
      try {
        const response = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload the image.");
        }

        const data = await response.json();
        // console.log(data, "imagepath");
        const imageUrl = data.filePath;

        const imgElem = document.createElement("img");
        imgElem.src = imageUrl;
        imgElem.crossOrigin = "anonymous";
        imgElem.onload = () => {
          const img = new FabricImage(imgElem, {
            scaleX: canvas!.width / imgElem.width,
            scaleY: canvas!.height / imgElem.height,
          });
          canvas?.set("backgroundImage", img);
          canvas?.requestRenderAll();
        };
      } catch (error) {
        alert("Error uploading the image: " + error);
      }
    } else {
      alert("Invalid file chosen for background image. File must be an image.");
    }
  }

  useEffect(() => {
    if (canvas) {
      canvas.backgroundColor = canvasBackgroundColor;
      canvas.requestRenderAll();
    }
  }, [canvas, canvasBackgroundColor]);

  return (
    <div className="space-y-3 text-sm">
      <div className="space-y-3 border-b pb-3">
        <p className="font-medium">Canvas Settings</p>
        <div className="grid gap-x-4 gap-y-2 grid-cols-2">
          <Input
            label="W"
            name="width"
            title={"Canvas width"}
            data-parse="number"
            value={canvasWidth}
            onChange={handleInputChange}
            onKeyDown={(event) =>
              event.code.toLowerCase().indexOf("enter") > -1 && handleResize()
            }
            type="number"
          />
          <Input
            label="H"
            name="height"
            title={"Canvas height"}
            data-parse="number"
            value={canvasHeight}
            onChange={handleInputChange}
            onKeyDown={(event) =>
              event.code.toLowerCase().indexOf("enter") > -1 && handleResize()
            }
            type="number"
          />
        </div>
        <div className="text-center">
          <button
            className="px-3 py-1 bg-slate-700 text-white rounded-md hover:shadow-md"
            onClick={handleResize}
          >
            Apply
          </button>
        </div>
      </div>
      <div className="space-y-3 pb-3">
        <div className="space-y-3 pb-3 border-b">
          <p className="">Background Color</p>
          <div>
            <div className="relative flex items-center gap-2 ">
              <div
                className="selected-color flex-shrink-0 border shadow w-6 h-6 rounded-md "
                style={{
                  backgroundColor: canvasBackgroundColor.toString(),
                }}
                onClick={handleCustomColorClick}
              ></div>
              <label htmlFor="backgroundColorText" className="relative flex-1">
                <span className="absolute top-1/2 -translate-y-1/2 left-3">
                  #
                </span>
                <input
                  type="text"
                  name="backgroundColorText"
                  id="backgroundColorText"
                  className="border rounded-md py-1.5 pl-6 w-full focus:outline-blue-500"
                  maxLength={11}
                  value={canvasBackgroundColor.toString().replace("#", "")}
                  onChange={handleColorChange}
                  onBlur={(e) => setCanvasBackgroundColor("#" + e.target.value)}
                />
              </label>
              <label htmlFor="backgroundColor" ref={inputColorRef}></label>
              <input
                type="color"
                name="backgroundColor"
                id="backgroundColor"
                value={canvasBackgroundColor.toString()}
                onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                className="absolute left-3 top-full opacity-0 w-1 h-1"
              />
            </div>
          </div>
        </div>
{/*         Background Image upload removed */}
{/*         <div className="space-y-3">
          <p className="">Background Image</p>
          <div className="text-center">
            <input
              type="file"
              hidden
              name="inputBackgroundImage"
              ref={inputBackgroundImageRef}
              onChange={uploadBackgroundImage}
              accept="image/*"
            />
            <button
              onClick={() => inputBackgroundImageRef.current?.click()}
              className="w-full px-3 py-2 bg-slate-700 text-white rounded-md hover:shadow-md"
            >
              Upload Image
            </button>
            <button
              onClick={() => {
                canvas?.set("backgroundImage", undefined);
                canvas?.requestRenderAll();
              }}
              className="w-full px-3 py-2 bg-red-700 text-white rounded-md hover:shadow-md mt-2"
            >
              Remove Background Image
            </button>
          </div>
        </div> */}
      </div>
    </div>
  );
}
