import { NextRequest, NextResponse } from "next/server";

/**
 * POST /api/admin/verify — Check the admin password.
 * Compares against ADMIN_PASSWORD env var (server-side only).
 * Returns { valid: true/false } — no token, no session.
 */
export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const valid = password === process.env.ADMIN_PASSWORD;
  return NextResponse.json({ valid });
}
