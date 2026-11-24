import { NextResponse } from "next/server";
import { createIconChallenge } from "@/lib/icon-captcha";
import { isLeadFormReady } from "@/lib/lead-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  if (!isLeadFormReady()) {
    return NextResponse.json(
      { error: "Форма ещё не подключена." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  return NextResponse.json(createIconChallenge(), {
    headers: { "Cache-Control": "no-store" },
  });
}
