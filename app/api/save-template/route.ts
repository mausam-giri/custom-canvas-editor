import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqJson = await request.json();
    const template = await fetch(
      "http://localhost:3001/api/editor/save-template",
      {
        method: "POST",
        body: JSON.stringify(reqJson),
      }
    );
    if (template.ok) {
      const templateResponse = await template.json();
      return NextResponse.json(
        {
          data: templateResponse,
          success: true,
        },
        { status: 200 }
      );
    } else {
      throw new Error("Template saving failed.");
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: error,
        success: false,
      },
      { status: 500 }
    );
  }
}
