import { getLoggedInUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getLoggedInUser();
  return NextResponse.json({ user });
}
