import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { writeFile, mkdir } from "fs/promises";
import { v4 as uuidv4 } from "uuid";

// Ensure the uploads directory exists
const ensureUploadsDirectory = async () => {
  const uploadDir = path.join(process.cwd(), "public/uploads");
  try {
    await mkdir(uploadDir, { recursive: true }); // Create the uploads folder if it doesn't exist
  } catch (err) {
    console.log("Error creating uploads directory", err);
    throw new Error("Error creating uploads directory");
  }
};

export async function POST(req: NextRequest) {
  try {
    // Get the form data from the request
    const formData = await req.formData();
    const file = formData.get("image");

    // console.log(file)
    // If no file is received, return an error
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No valid file received." },
        { status: 400 }
      );
    }

    // Ensure the uploads directory exists
    await ensureUploadsDirectory();

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Generate a unique filename using the current timestamp
    const filename = uuidv4() + "." + file.name.split(".").pop();

    // Save the file to the server
    const filePath = `http://localhost:4000/uploads/${filename}`; // Full URL path including base URL
    await writeFile(
      path.join(process.cwd(), "public/uploads", filename),
      buffer
    );
    // console.log(filename, filePath)

    // Return success message with the full file path
    return NextResponse.json({ message: "Success", filePath, status: 201 });
  } catch (error) {
    console.log("Error occurred:", error);
    return NextResponse.json({ message: "Failed", error: error, status: 500 });
  }
}
