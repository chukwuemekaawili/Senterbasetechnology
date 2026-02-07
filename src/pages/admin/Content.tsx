import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDataState } from "@/components/admin/AdminDataState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Plus, Trash2, ExternalLink, GripVertical } from "lucide-react";
import { ImageField } from "@/components/admin/MediaPicker";
import { CTAEditor, CTAButton } from "@/components/admin/CTAEditor";

// DnD Kit
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PageSection {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body_text: string | null;
  body_json: any | null;
  ctas_json: any | null; // JSON type from DB, cast to CTAButton[] in component
  image_asset_id: string | null;
  image_url?: string | null;
  published: boolean;
  sort_order: number | null;
  updated_at: string;
}

// All site pages with their default sections
const PAGE_OPTIONS = [
  { 
    value: "home", 
    label: "Home Page",
    route: "/",
    defaultSections: ["hero", "trust_strip", "services_grid", "featured_highlights", "project_showcase", "stats", "testimonials", "how_we_work", "coverage_preview", "gallery_preview", "chatbot_promo", "cta_banner"]
  },
  { 
    value: "about", 
    label: "About Page",
    route: "/about",
    defaultSections: ["intro", "mission", "values", "clients", "team", "cta"]
  },
  { 
    value: "services", 
    label: "Services Page",
    route: "/services",
    defaultSections: ["intro", "categories"]
  },
  { 
    value: "contact", 
    label: "Contact Page",
    route: "/contact",
    defaultSections: ["intro", "form", "coverage", "faq"]
  },
  { 
    value: "coverage", 
    label: "Coverage Areas",
    route: "/coverage-areas",
    defaultSections: ["intro", "areas", "confirm", "cta"]
  },
  { 
    value: "gallery", 
    label: "Projects Gallery",
    route: "/projects-gallery",
    defaultSections: ["intro", "categories"]
  },
  { 
    value: "privacy", 
    label: "Privacy Policy",
    route: "/privacy",
    defaultSections: ["content"]
  },
  { 
    value: "terms", 
    label: "Terms of Service",
    route: "/terms",
    defaultSections: ["content"]
  },
];

// Human-readable section names
const SECTION_LABELS: Record<string, string> = {
  hero: "Hero Section",
  trust_strip: "Trust Strip / Why Choose Us",
  services_grid: "Services Grid",
  featured_highlights: "Featured Highlights",
  project_showcase: "Project Showcase Banner",
  stats: "Stats Counter",
  testimonials: "Testimonials",
  how_we_work: "How We Work",
  coverage_preview: "Coverage Preview",
  gallery_preview: "Gallery Preview",
  chatbot_promo: "Chatbot Promo",
  cta_banner: "Call-to-Action Banner",
  intro: "Introduction",
  mission: "Mission Statement",
  values: "Core Values",
  clients: "Clients / Who We Serve",
  team: "Team Members",
  cta: "Call-to-Action",
  categories: "Categories",
  form: "Contact Form",
  coverage: "Coverage Info",
  faq: "FAQ Section",
  areas: "Service Areas",
  confirm: "Confirm Availability",
  content: "Main Content",
};

// Sections that commonly use CTA buttons
const CTA_SECTIONS = ["hero", "cta", "cta_banner", "intro", "project_showcase", "chatbot_promo", "confirm"];

// Sortable Section Card
function SortableSectionCard({
  section,
  index,
  saving,
  onFieldChange,
  onSave,
  onDelete,
}: {
  section: PageSection;
  index: number;
  saving: string | null;
  onFieldChange: (id: string, field: keyof PageSection, value: any) => void;
  onSave: (section: PageSection) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const showCTAEditor = CTA_SECTIONS.includes(section.section_key);

  return (
    <Card ref={setNodeRef} style={style} className="relative">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
        <div className="flex items-start gap-3 flex-1">
          <button
            type="button"
            className="mt-1 cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
            {...attributes}
            {...listeners}
          >
            <GripVertical className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <CardTitle className="text-lg font-heading flex items-center gap-2">
              <span className="text-muted-foreground text-sm font-normal">
                #{index + 1}
              </span>
              {SECTION_LABELS[section.section_key] || 
                section.section_key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </CardTitle>
            <CardDescription className="mt-1">
              Key: <code className="bg-muted px-1 rounded">{section.section_key}</code>
            </CardDescription>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Switch
              checked={section.published}
              onCheckedChange={(checked) =>
                onFieldChange(section.id, "published", checked)
              }
            />
            <Label className="text-sm whitespace-nowrap">
              {section.published ? "Published" : "Draft"}
            </Label>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-destructive hover:text-destructive hover:bg-destructive/10"
            onClick={() => onDelete(section.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={section.title || ""}
              onChange={(e) =>
                onFieldChange(section.id, "title", e.target.value)
              }
              placeholder="Section title"
            />
          </div>
          <div className="space-y-2">
            <Label>Subtitle</Label>
            <Input
              value={section.subtitle || ""}
              onChange={(e) =>
                onFieldChange(section.id, "subtitle", e.target.value)
              }
              placeholder="Optional subtitle or tagline"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Body Text</Label>
          <Textarea
            value={section.body_text || ""}
            onChange={(e) =>
              onFieldChange(section.id, "body_text", e.target.value)
            }
            placeholder="Main content for this section (supports multiple paragraphs)"
            rows={4}
          />
        </div>

        {/* Image Picker */}
        <ImageField
          value={section.image_url || null}
          assetId={section.image_asset_id}
          onChange={(assetId, url) => {
            onFieldChange(section.id, "image_asset_id", assetId);
            onFieldChange(section.id, "image_url", url);
          }}
          label="Section Image"
        />

        {/* CTA Editor for relevant sections */}
        {showCTAEditor && (
          <CTAEditor
            value={Array.isArray(section.ctas_json) ? section.ctas_json : []}
            onChange={(ctas) => onFieldChange(section.id, "ctas_json", ctas)}
          />
        )}

        {/* JSON editor for complex data */}
        {section.body_json !== null && (
          <div className="space-y-2">
            <Label>Body JSON (Advanced)</Label>
            <Textarea
              value={typeof section.body_json === 'string' 
                ? section.body_json 
                : JSON.stringify(section.body_json, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  onFieldChange(section.id, "body_json", parsed);
                } catch {
                  onFieldChange(section.id, "body_json", e.target.value);
                }
              }}
              placeholder='{"items": [], "config": {}}'
              rows={4}
              className="font-mono text-sm"
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <Button 
            onClick={() => onSave(section)} 
            disabled={saving === section.id}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving === section.id ? "Saving..." : "Save Section"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminContent() {
  const [sections, setSections] = useState<PageSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [activePage, setActivePage] = useState("home");
  const { toast } = useToast();

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const fetchSections = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch sections with joined image URL
      const { data, error: fetchError } = await supabase
        .from("page_sections")
        .select(`
          *,
          media_assets:image_asset_id (public_url)
        `)
        .order("sort_order", { ascending: true });

      if (fetchError) throw new Error(fetchError.message);
      
      // Flatten the joined data
      const sectionsWithImages = (data || []).map((s: any) => ({
        ...s,
        image_url: s.media_assets?.public_url || null,
        media_assets: undefined,
      }));
      
      setSections(sectionsWithImages);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load page sections";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const pageSections = sections
    .filter((s) => s.page_slug === activePage)
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
  
  const currentPage = PAGE_OPTIONS.find((p) => p.value === activePage);

  const handleFieldChange = (sectionId: string, field: keyof PageSection, value: any) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, [field]: value } : s))
    );
  };

  const saveSection = async (section: PageSection) => {
    setSaving(section.id);
    try {
      const { error: updateError } = await supabase
        .from("page_sections")
        .update({
          title: section.title,
          subtitle: section.subtitle,
          body_text: section.body_text,
          body_json: section.body_json,
          ctas_json: section.ctas_json,
          image_asset_id: section.image_asset_id,
          published: section.published,
          sort_order: section.sort_order,
        })
        .eq("id", section.id);

      if (updateError) throw new Error(updateError.message);
      toast({ title: "Section saved successfully" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save section";
      toast({
        title: "Error saving section",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(null);
    }
  };

  const addSection = async (sectionKey?: string) => {
    const key = sectionKey || `section_${Date.now()}`;
    try {
      const { data, error: insertError } = await supabase
        .from("page_sections")
        .insert({
          page_slug: activePage,
          section_key: key,
          title: SECTION_LABELS[key] || "New Section",
          published: false,
          sort_order: pageSections.length,
        })
        .select()
        .single();

      if (insertError) throw new Error(insertError.message);
      setSections((prev) => [...prev, { ...data, image_url: null } as PageSection]);
      toast({ title: "Section added" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add section";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm("Are you sure you want to delete this section? This cannot be undone.")) return;

    try {
      const { error: deleteError } = await supabase
        .from("page_sections")
        .delete()
        .eq("id", sectionId);

      if (deleteError) throw new Error(deleteError.message);
      setSections((prev) => prev.filter((s) => s.id !== sectionId));
      toast({ title: "Section deleted" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete section";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  // Handle drag end for reordering
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = pageSections.findIndex((s) => s.id === active.id);
    const newIndex = pageSections.findIndex((s) => s.id === over.id);

    const reordered = arrayMove(pageSections, oldIndex, newIndex);

    // Update local state immediately
    const updatedSections = sections.map((s) => {
      const newOrderIndex = reordered.findIndex((r) => r.id === s.id);
      if (newOrderIndex !== -1) {
        return { ...s, sort_order: newOrderIndex };
      }
      return s;
    });
    setSections(updatedSections);

    // Persist to database
    try {
      const updates = reordered.map((s, index) => ({
        id: s.id,
        sort_order: index,
      }));

      for (const update of updates) {
        await supabase
          .from("page_sections")
          .update({ sort_order: update.sort_order })
          .eq("id", update.id);
      }
      toast({ title: "Order saved" });
    } catch (err) {
      toast({
        title: "Failed to save order",
        description: "Please try again",
        variant: "destructive",
      });
      fetchSections(); // Revert on error
    }
  };

  // Find missing default sections
  const existingSectionKeys = pageSections.map((s) => s.section_key);
  const missingSections = currentPage?.defaultSections.filter(
    (key) => !existingSectionKeys.includes(key)
  ) || [];

  return (
    <AdminLayout title="Pages & Content">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <ScrollArea className="w-full lg:w-auto">
          <Tabs value={activePage} onValueChange={setActivePage}>
            <TabsList className="inline-flex h-auto p-1">
              {PAGE_OPTIONS.map((page) => (
                <TabsTrigger 
                  key={page.value} 
                  value={page.value}
                  className="whitespace-nowrap text-xs sm:text-sm px-3 py-2"
                >
                  {page.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        <div className="flex gap-2 flex-shrink-0">
          <Button 
            variant="outline" 
            size="icon" 
            onClick={fetchSections} 
            disabled={loading}
            title="Refresh"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          {currentPage && (
            <Button variant="outline" asChild>
              <a href={currentPage.route} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Page
              </a>
            </Button>
          )}
          <Button onClick={() => addSection()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Section
          </Button>
        </div>
      </div>

      {/* Missing sections hint */}
      {missingSections.length > 0 && (
        <Card className="mb-6 border-dashed border-amber-500/50 bg-amber-50/50 dark:bg-amber-950/20">
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground mb-3">
              <strong>Suggested sections for this page:</strong> Add these to enable CMS control.
            </p>
            <div className="flex flex-wrap gap-2">
              {missingSections.map((key) => (
                <Button
                  key={key}
                  variant="outline"
                  size="sm"
                  onClick={() => addSection(key)}
                  className="text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {SECTION_LABELS[key] || key}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <AdminDataState
        isLoading={loading}
        error={error}
        onRetry={fetchSections}
        isEmpty={!loading && !error && pageSections.length === 0}
        emptyMessage={`No sections found for ${currentPage?.label || "this page"}. Click "Add Section" or use the suggested sections above.`}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={pageSections.map((s) => s.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-6">
              {pageSections.map((section, index) => (
                <SortableSectionCard
                  key={section.id}
                  section={section}
                  index={index}
                  saving={saving}
                  onFieldChange={handleFieldChange}
                  onSave={saveSection}
                  onDelete={deleteSection}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </AdminDataState>
    </AdminLayout>
  );
}
