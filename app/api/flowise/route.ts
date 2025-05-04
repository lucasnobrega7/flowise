import { NextResponse } from "next/server"

// This is a placeholder route that will be used to check if the server is running
export async function GET() {
  return NextResponse.json({
    status: "Flowise is running",
    message: "Please access the Flowise UI directly at the root URL",
  })
}
