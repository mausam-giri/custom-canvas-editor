import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

const ensureUploadsDirectory = async (destinationPath: string) => {
  const uploadDir = path.join(process.cwd(), destinationPath);
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (err) {
    console.error("Error creating uploads directory", err);
    throw new Error("Error creating uploads directory");
  }
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("image");
    const userId = formData.get("userId") as string;

    if (!file || !(file instanceof File) || !userId) {
      return NextResponse.json(
        {
          message: "Invalid data found.",
          success: false,
        },
        { status: 400 }
      );
    }
    const destinationPath = `public/${userId}/uploads`;
    await ensureUploadsDirectory(destinationPath);

    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = uuidv4() + "." + file.name.split(".").pop();
    const filePath = `${process.env.BASE_URL}/${userId}/uploads/${filename}`;

    await writeFile(
      path.join(process.cwd(), destinationPath, filename),
      buffer
    );
    return NextResponse.json(
      { data: filePath, success: true },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save uploaded image:", error);
    return NextResponse.json(
      {
        message: "Failed to save uploaded image",
        details: error,
        success: false,
      },
      { status: 500 }
    );
  }
}
