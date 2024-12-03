// pages/api/export-canvas.ts

import { type NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Canvas } from "fabric";

// API Route to handle canvas export
export async function POST(req: NextRequest) {
  const { canvasJson, fileName } = await req.json();

  if (!canvasJson || !fileName) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }

  try {
    // Create a fabric canvas
    const canvasElem = document.createElement("canvas");
    const canvas = new Canvas(canvasElem, {
      width: 800, // Set canvas width or pass dynamically
      height: 600, // Set canvas height or pass dynamically
    });

    // Load the canvas JSON to the fabric canvas
    canvas.loadFromJSON(canvasJson, () => {
      // Convert canvas to PNG data URL
      const dataUrl = canvas.toDataURL({ format: "png", multiplier: 1.5 });
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");

      // Define the static folder and image path
      const staticFolder = path.join(process.cwd(), "public", "static");
      if (!fs.existsSync(staticFolder)) {
        fs.mkdirSync(staticFolder);
      }

      // Path where the PNG image will be saved
      const filePath = path.join(staticFolder, `${fileName}.png`);

      // Write the PNG file to disk
      fs.writeFileSync(filePath, base64Data, "base64");

      // Respond with the file path
      return NextResponse.json(
        {
          message: "Canvas exported successfully",
          imagePath: `/static/${fileName}.png`, // This will be the URL to access the image
        },
        { status: 200 }
      );
    });
  } catch (error) {
    console.error("Error exporting canvas:", error);
    return NextResponse.json(
      { error: "Error exporting canvas" },
      { status: 500 }
    );
  }
  //  else {
  //   res.status(405).json({ error: "Method not allowed" });
}
