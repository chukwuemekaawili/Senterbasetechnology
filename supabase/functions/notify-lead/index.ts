import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LeadNotification {
  name: string;
  phone: string;
  email?: string;
  service: string;
  location: string;
  message: string;
  source_page: string;
  created_at: string;
}

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const lead: LeadNotification = await req.json();
    console.log("Received lead notification request:", { name: lead.name, service: lead.service });

    // Check if RESEND_API_KEY exists
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.warn("RESEND_API_KEY not configured - email notification skipped. Lead was still saved to database.");
      return new Response(
        JSON.stringify({ 
          success: true, 
          emailSent: false, 
          message: "Lead saved. Email notification skipped (RESEND_API_KEY not configured)." 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Send email via Resend
    const emailSubject = `New Lead — ${lead.service} — ${lead.name}`;
    const emailBody = `
New Lead Submission
====================

Name: ${lead.name}
Phone: ${lead.phone}
Email: ${lead.email || "Not provided"}
Service: ${lead.service}
Location: ${lead.location}
Source Page: ${lead.source_page}
Submitted At: ${new Date(lead.created_at).toLocaleString("en-NG", { timeZone: "Africa/Lagos" })}

Message:
${lead.message}

---
This is an automated notification from STIL website.
    `.trim();

    const resendResponse = await fetch("https://api.resend.com/emails", {
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

    if (!resendResponse.ok) {
      const errorText = await resendResponse.text();
      console.error("Failed to send email via Resend:", errorText);
      // Don't fail the request - lead is already saved
      return new Response(
        JSON.stringify({ 
          success: true, 
          emailSent: false, 
          message: "Lead saved. Email notification failed but lead is recorded." 
        }),
        { 
          status: 200, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    const resendData = await resendResponse.json();
    console.log("Email sent successfully:", resendData);

    return new Response(
      JSON.stringify({ success: true, emailSent: true, emailId: resendData.id }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    console.error("Error in notify-lead function:", error);
    // Still return success since lead was saved before this function was called
    return new Response(
      JSON.stringify({ 
        success: true, 
        emailSent: false, 
        message: "Lead saved. Email notification encountered an error." 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
