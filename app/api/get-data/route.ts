import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
    
    const res = await request.json()
    console.log("get-data",res)
    const template = await fetch("http://localhost:3001/api/editor/get-data", {

        method: "POST", 
        body: JSON.stringify(res)
        
    });
    if(template.ok){
        const templateResponse = await template.json();
        console.log("response", templateResponse.message)
        return Response.json({
            message: templateResponse,
            success: true
        });
    }else{
        return NextResponse.json({
            message: "",
            success: false
        })
    }

}