import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Simple in-memory rate limiting (resets on cold start)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3;

function getRateLimitKey(req: Request): string {
  // Use forwarded IP or fall back to user agent hash
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "unknown";
  const userAgent = req.headers.get("user-agent") || "unknown";
  return `${ip}_${userAgent.slice(0, 50)}`;
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(key);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }

  entry.count++;
  return false;
}

interface LeadInput {
  name: string;
  phone: string;
  email?: string;
  service: string;
  location: string;
  message: string;
  source_page: string;
  preferred_contact_time?: string;
  honeypot?: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Rate limiting check
    const rateLimitKey = getRateLimitKey(req);
    if (isRateLimited(rateLimitKey)) {
      console.warn("Rate limit exceeded for:", rateLimitKey);
      return new Response(
        JSON.stringify({ success: false, error: "Too many requests. Please wait a moment." }),
        { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const body: LeadInput = await req.json();
    console.log("Received lead submission:", { name: body.name, service: body.service, source: body.source_page });

    // Honeypot check - if filled, silently accept but don't save
    if (body.honeypot && body.honeypot.trim() !== "") {
      console.warn("Honeypot triggered - blocking submission");
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Basic validation
    if (!body.name?.trim() || !body.phone?.trim() || !body.service?.trim() || 
        !body.location?.trim() || !body.message?.trim() || !body.source_page?.trim()) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Phone validation (basic Nigerian format)
    const phoneRegex = /^(\+?234|0)[789]\d{9}$/;
    const cleanPhone = body.phone.replace(/\s/g, "");
    if (!phoneRegex.test(cleanPhone)) {
      return new Response(
        JSON.stringify({ success: false, error: "Please enter a valid Nigerian phone number." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for insert
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Insert lead
    const { data: insertedLead, error } = await supabase
      .from("leads")
      .insert({
        name: body.name.trim(),
        phone: cleanPhone,
        email: body.email?.trim() || null,
        service: body.service.trim(),
        location: body.location.trim(),
        message: body.message.trim(),
        source_page: body.source_page.trim(),
        preferred_contact_time: body.preferred_contact_time?.trim() || null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting lead:", error);
      return new Response(
        JSON.stringify({ success: false, error: "Failed to submit. Please try again or call us directly." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Lead inserted successfully:", insertedLead.id);

    // Try to send email notification (non-blocking)
    try {
      const resendApiKey = Deno.env.get("RESEND_API_KEY");
      if (resendApiKey) {
        const emailSubject = `New Lead — ${insertedLead.service} — ${insertedLead.name}`;
        const emailBody = `
New Lead Submission
====================

Name: ${insertedLead.name}
Phone: ${insertedLead.phone}
Email: ${insertedLead.email || "Not provided"}
Service: ${insertedLead.service}
Location: ${insertedLead.location}
Source Page: ${insertedLead.source_page}
Submitted At: ${new Date(insertedLead.created_at).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}

Message:
${insertedLead.message}

---
This is an automated notification from STIL website.
        `.trim();

        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${resendApiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "STIL Website <onboarding@resend.dev>",
            to: ["senterbase@gmail.com"],
            subject: emailSubject,
            text: emailBody,
          }),
        });
      }
    } catch (emailError) {
      console.warn("Email notification failed:", emailError);
    }

    return new Response(
      JSON.stringify({ success: true, id: insertedLead.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error in insert-lead function:", error);
    return new Response(
      JSON.stringify({ success: false, error: "An unexpected error occurred. Please call us directly." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
