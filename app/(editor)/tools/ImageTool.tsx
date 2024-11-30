import { ImageIcon } from "@/components/icons";
import ToolbarIcon from "@/components/ToolbarIcon";
import { CanvasContext } from "@/context/CanvasContext";
import { FabricImage } from "fabric";
import { ChangeEvent, useContext, useRef } from "react";

export default function ImageTool() {
  const fileRef = useRef<HTMLInputElement>(null);
  const canvas = useContext(CanvasContext);

  async function addImage(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) {
      const file = event.target.files[0];

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        const imgUrl = data.filePath;
        console.log(imgUrl);
        const imgElem = document.createElement("img");
        imgElem.src = imgUrl;
        imgElem.crossOrigin = "anonymous";
        imgElem.onload = () => {
          const img = new FabricImage(imgElem, {
            label: "Image",
          });

          const scaleFactor = Math.min(
            canvas?.width! / img.width,
            canvas?.height! / img.height
          );

          img.set({
            scaleX: scaleFactor,
            scaleY: scaleFactor,
          });

          canvas?.add(img);
          canvas?.centerObject(img);
          canvas?.setActiveObject(img);
        };
      } else {
        console.error("Image upload failed");
      }
    }
  }

  return (
    <>
      <input type="file" ref={fileRef} onChange={addImage} hidden />
      <ToolbarIcon
        onClick={() => fileRef.current?.click()}
        icon={ImageIcon}
        title="Image"
      />
    </>
  );
}
