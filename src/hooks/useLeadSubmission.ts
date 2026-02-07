import { useState, useRef, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { services } from "@/data/services";

// Rate limiting: 1 submission per 60 seconds (client-side backup)
const RATE_LIMIT_MS = 60000;

interface LeadData {
  name: string;
  phone: string;
  email?: string;
  service: string;
  location: string;
  message: string;
  source_page: string;
  preferred_contact_time?: string;
}

interface SubmissionResult {
  success: boolean;
  error?: string;
}

export function useLeadSubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const lastSubmitTime = useRef<number>(0);

  const submitLead = useCallback(async (data: LeadData, honeypotValue?: string): Promise<SubmissionResult> => {
    // Client-side rate limiting (backup)
    const now = Date.now();
    if (now - lastSubmitTime.current < RATE_LIMIT_MS) {
      const secondsLeft = Math.ceil((RATE_LIMIT_MS - (now - lastSubmitTime.current)) / 1000);
      return { 
        success: false, 
        error: `Please wait ${secondsLeft} seconds before submitting again.` 
      };
    }

    setIsSubmitting(true);

    try {
      // Validate service matches one of our 15 services
      const validService = services.find(s => s.slug === data.service || s.title === data.service);
      const serviceName = validService?.title || data.service;

      // Use edge function for server-side validation and rate limiting
      const { data: result, error } = await supabase.functions.invoke("insert-lead", {
        body: {
          name: data.name.trim(),
          phone: data.phone.trim(),
          email: data.email?.trim() || null,
          service: serviceName,
          location: data.location.trim(),
          message: data.message.trim(),
          source_page: data.source_page,
          preferred_contact_time: data.preferred_contact_time?.trim() || null,
          honeypot: honeypotValue || "",
        },
      });

      if (error) {
        console.error("Error calling insert-lead function:", error);
        return { success: false, error: "Failed to submit. Please try again or call us directly." };
      }

      if (!result?.success) {
        return { success: false, error: result?.error || "Failed to submit. Please try again or call us directly." };
      }

      // Update last submit time for client-side rate limiting
      lastSubmitTime.current = now;

      return { success: true };

    } catch (err) {
      console.error("Unexpected error:", err);
      return { success: false, error: "An unexpected error occurred. Please call us directly." };
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return { submitLead, isSubmitting };
}
