import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "aureole-wedding-albums",
    timestamp: new Date().toISOString()
  });
}
