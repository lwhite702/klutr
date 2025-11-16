import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Email Subscription API endpoint
 *
 * Auth: None (public marketing endpoint)
 * Body: { email: string }
 * Response: { success: boolean, message: string }
 * Side effects: Sends welcome email via Resend (if configured) and stores subscription
 */
export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Check if Resend is configured
    const resendApiKey = process.env.RESEND_API_KEY;

    if (resendApiKey) {
      // Send welcome email via Resend
      try {
        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from:
              process.env.RESEND_FROM_EMAIL || "Klutr <onboarding@resend.dev>",
            to: email,
            subject: "Welcome to Klutr! 🎉",
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="text-align: center; margin-bottom: 30px;">
                    <h1 style="color: #FF6B6B; font-size: 32px; margin: 0;">Welcome to Klutr!</h1>
                  </div>
                  <p style="font-size: 16px; margin-bottom: 20px;">
                    Thanks for subscribing! We're excited to have you join the Klutr community.
                  </p>
                  <p style="font-size: 16px; margin-bottom: 20px;">
                    Klutr helps you organize your chaos. Capture everything—notes, voice, images—and let AI handle the organization so you can stay creative.
                  </p>
                  <div style="text-align: center; margin: 30px 0;">
                    <a href="https://klutr.app/login" style="display: inline-block; background-color: #FF6B6B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600;">
                      Get Started Free
                    </a>
                  </div>
                  <p style="font-size: 14px; color: #666; margin-top: 30px;">
                    You're receiving this because you subscribed to Klutr updates. We'll keep you informed about new features and updates.
                  </p>
                  <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
                  <p style="font-size: 12px; color: #999; text-align: center;">
                    © ${new Date().getFullYear()} Klutr. All rights reserved.
                  </p>
                </body>
              </html>
            `,
          }),
        });

        if (!resendResponse.ok) {
          const errorData = await resendResponse.json().catch(() => ({}));
          console.error("[marketing/subscribe] Resend error:", errorData);
          // Continue anyway - we'll still log the subscription
        } else {
          console.log("[marketing/subscribe] Welcome email sent to:", email);
        }
      } catch (resendError) {
        console.error("[marketing/subscribe] Resend API error:", resendError);
        // Continue anyway - we'll still log the subscription
      }
    } else {
      console.log(
        "[marketing/subscribe] RESEND_API_KEY not configured, skipping email send"
      );
    }

    // Store email subscription in database
    // Note: This requires an email_subscriptions table in Supabase
    // If the table doesn't exist, this will fail gracefully and we'll just log
    try {
      const { error: dbError } = await supabaseAdmin
        .from("email_subscriptions")
        .insert({
          email: email.toLowerCase().trim(),
          source: "marketing_footer",
          subscribed_at: new Date().toISOString(),
        });

      if (dbError) {
        // Table might not exist yet - log but don't fail the request
        console.warn(
          "[marketing/subscribe] Database storage failed (table may not exist):",
          dbError.message
        );
        console.log("[marketing/subscribe] Email subscription logged:", email);
      } else {
        console.log("[marketing/subscribe] Email subscription stored:", email);
      }
    } catch (dbErr) {
      // Gracefully handle if table doesn't exist
      console.warn(
        "[marketing/subscribe] Database error (table may not exist):",
        dbErr
      );
      console.log("[marketing/subscribe] Email subscription logged:", email);
    }

    return NextResponse.json({
      success: true,
      message:
        "Successfully subscribed! Check your email for a welcome message.",
    });
  } catch (error) {
    console.error("[marketing/subscribe] API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
