import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, GripVertical, Link2 } from "lucide-react";

export interface CTAButton {
  label: string;
  href: string;
  variant: "primary" | "secondary" | "outline" | "ghost";
}

interface CTAEditorProps {
  value: CTAButton[];
  onChange: (ctas: CTAButton[]) => void;
  maxButtons?: number;
}

const VARIANT_OPTIONS = [
  { value: "primary", label: "Primary (filled)" },
  { value: "secondary", label: "Secondary" },
  { value: "outline", label: "Outline" },
  { value: "ghost", label: "Ghost (text only)" },
];

export function CTAEditor({ value, onChange, maxButtons = 3 }: CTAEditorProps) {
  const ctas = Array.isArray(value) ? value : [];

  const addCTA = () => {
    if (ctas.length >= maxButtons) return;
    onChange([...ctas, { label: "Call Now", href: "tel:+2348064398669", variant: "primary" }]);
  };

  const updateCTA = (index: number, field: keyof CTAButton, newValue: string) => {
    const updated = [...ctas];
    updated[index] = { ...updated[index], [field]: newValue };
    onChange(updated);
  };

  const removeCTA = (index: number) => {
    onChange(ctas.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">Call-to-Action Buttons</Label>
        {ctas.length < maxButtons && (
          <Button type="button" variant="outline" size="sm" onClick={addCTA}>
            <Plus className="h-3 w-3 mr-1" />
            Add Button
          </Button>
        )}
      </div>

      {ctas.length === 0 && (
        <p className="text-sm text-muted-foreground py-2">
          No CTA buttons configured. Add one to show a call-to-action.
        </p>
      )}

      <div className="space-y-3">
        {ctas.map((cta, index) => (
          <div
            key={index}
            className="flex items-start gap-2 p-3 border rounded-lg bg-muted/30"
          >
            <div className="text-muted-foreground mt-2">
              <GripVertical className="h-4 w-4" />
            </div>

            <div className="flex-1 grid gap-3 sm:grid-cols-3">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Label</Label>
                <Input
                  value={cta.label}
                  onChange={(e) => updateCTA(index, "label", e.target.value)}
                  placeholder="Call Now"
                  className="h-9"
                />
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Link / Action</Label>
                <div className="relative">
                  <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    value={cta.href}
                    onChange={(e) => updateCTA(index, "href", e.target.value)}
                    placeholder="tel:+234... or /contact"
                    className="h-9 pl-8"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Style</Label>
                <Select
                  value={cta.variant}
                  onValueChange={(val) => updateCTA(index, "variant", val)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {VARIANT_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-destructive hover:text-destructive h-9 w-9 mt-5"
              onClick={() => removeCTA(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {ctas.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Tip: Use <code className="bg-muted px-1 rounded">tel:+234...</code> for phone links, 
          or <code className="bg-muted px-1 rounded">/contact</code> for internal pages.
        </p>
      )}
    </div>
  );
}
