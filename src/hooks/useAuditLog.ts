import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type AuditAction = "create" | "update" | "delete" | "status_change";
export type AuditEntityType = "service" | "gallery_item" | "page_section" | "media_asset" | "lead" | "site_settings";

interface AuditLogParams {
  action: AuditAction;
  entityType: AuditEntityType;
  entityId?: string;
  entityName?: string;
  beforeSummary?: Record<string, unknown>;
  afterSummary?: Record<string, unknown>;
}

export function useAuditLog() {
  const logAction = useCallback(async ({
    action,
    entityType,
    entityId,
    entityName,
    beforeSummary,
    afterSummary,
  }: AuditLogParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.warn("Cannot log audit action: no authenticated user");
        return;
      }

      // Direct insert with type assertion to bypass strict typing
      // The admin_audit table exists but types may not be regenerated yet
      const { error } = await (supabase as any).from("admin_audit").insert({
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        entity_name: entityName || null,
        before_summary: beforeSummary || null,
        after_summary: afterSummary || null,
      });

      if (error) {
        console.error("Failed to log audit action:", error);
      }
    } catch (err) {
      console.error("Audit log error:", err);
    }
  }, []);

  return { logAction };
}
