import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const reqJson = await request.json();
    const template = await fetch(
      "http://localhost:3001/api/editor/get-template",
      {
        method: "POST",
        body: JSON.stringify(reqJson),
      }
    );
    if (template.ok) {
      const templateResponse = await template.json();

      return NextResponse.json(
        {
          data: templateResponse.data,
          success: true,
        },
        {
          status: 200,
        }
      );
    } else {
      throw new Error("Failed to fetch template data");
    }
  } catch (error) {
    return NextResponse.json(
      {
        message: "Failed to get template data",
        details: error,
        success: false,
      },
      { status: 500 }
    );
  }
}
