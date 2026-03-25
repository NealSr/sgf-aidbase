import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

/**
 * POST /api/feedback — Insert community feedback into Supabase.
 * Includes honeypot spam prevention and basic validation.
 */
export async function POST(request: NextRequest) {
  let body: {
    message?: string;
    email?: string | null;
    page_url?: string | null;
    website?: string; // Honeypot field
  };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  // Honeypot check — bots fill this hidden field, humans never see it.
  // Silently return success so the bot thinks it worked.
  if (body.website) {
    return NextResponse.json({ success: true });
  }

  // Validate message
  const message = body.message?.trim();
  if (!message) {
    return NextResponse.json(
      { error: "Message is required" },
      { status: 400 }
    );
  }
  if (message.length > 2000) {
    return NextResponse.json(
      { error: "Message must be under 2000 characters" },
      { status: 400 }
    );
  }

  // Insert into Supabase feedback table
  const { error } = await supabase.from("feedback").insert({
    message,
    email: body.email || null,
    page_url: body.page_url || null,
  });

  if (error) {
    console.error("Failed to insert feedback:", error);
    return NextResponse.json(
      { error: "Unable to save feedback. Please try again later." },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
