import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Edit, FileText, Home, Phone, MapPin, Shield, ScrollText } from "lucide-react";

interface PageSectionDB {
  id: string;
  page_slug: string;
  section_key: string;
  title: string | null;
  subtitle: string | null;
  body_text: string | null;
  body_json: any;
  image_asset_id: string | null;
  sort_order: number;
  published: boolean;
}

const PAGE_CONFIG = [
  { slug: "home", label: "Homepage", icon: Home },
  { slug: "about", label: "About", icon: FileText },
  { slug: "contact", label: "Contact", icon: Phone },
  { slug: "coverage", label: "Coverage Areas", icon: MapPin },
  { slug: "privacy", label: "Privacy Policy", icon: Shield },
  { slug: "terms", label: "Terms of Service", icon: ScrollText },
];

export default function AdminPages() {
  const [sections, setSections] = useState<PageSectionDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedSection, setSelectedSection] = useState<PageSectionDB | null>(null);
  const [editData, setEditData] = useState<PageSectionDB | null>(null);
  const [activeTab, setActiveTab] = useState("home");
  const { toast } = useToast();

  const fetchSections = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("page_sections")
        .select("*")
        .order("page_slug")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error("Failed to fetch sections:", error);
      toast({
        title: "Error",
        description: "Failed to load page sections",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const openEditor = (section: PageSectionDB) => {
    setSelectedSection(section);
    setEditData({ ...section });
  };

  const closeEditor = () => {
    setSelectedSection(null);
    setEditData(null);
  };

  const handleSave = async () => {
    if (!editData) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("page_sections")
        .update({
          title: editData.title,
          subtitle: editData.subtitle,
          body_text: editData.body_text,
          body_json: editData.body_json,
          image_asset_id: editData.image_asset_id,
          published: editData.published,
        })
        .eq("id", editData.id);

      if (error) throw error;

      setSections((prev) =>
        prev.map((s) => (s.id === editData.id ? editData : s))
      );
      toast({ title: "Section updated" });
      closeEditor();
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save section",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getSectionsForPage = (pageSlug: string) => {
    return sections.filter((s) => s.page_slug === pageSlug);
  };

  const formatSectionName = (key: string) => {
    return key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <AdminLayout title="Page Content">
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Edit text content across all pages of your website.
        </p>
        <Button variant="outline" size="icon" onClick={fetchSections}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 flex-wrap h-auto gap-1">
            {PAGE_CONFIG.map((page) => (
              <TabsTrigger key={page.slug} value={page.slug} className="gap-2">
                <page.icon className="h-4 w-4" />
                {page.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {PAGE_CONFIG.map((page) => (
            <TabsContent key={page.slug} value={page.slug}>
              <div className="grid gap-4">
                {getSectionsForPage(page.slug).length === 0 ? (
                  <Card>
                    <CardContent className="py-8 text-center text-muted-foreground">
                      No editable sections found for this page.
                    </CardContent>
                  </Card>
                ) : (
                  getSectionsForPage(page.slug).map((section) => (
                    <Card
                      key={section.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => openEditor(section)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">
                              {formatSectionName(section.section_key)}
                            </CardTitle>
                            {section.title && (
                              <CardDescription className="mt-1">
                                {section.title}
                              </CardDescription>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={section.published ? "default" : "secondary"}>
                              {section.published ? "Live" : "Draft"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {section.body_text && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {section.body_text}
                          </p>
                        )}
                        {section.body_json && !section.body_text && (
                          <p className="text-sm text-muted-foreground">
                            Contains structured data ({Array.isArray(section.body_json) ? section.body_json.length : 1} items)
                          </p>
                        )}
                        <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      )}

      {/* Edit Sheet */}
      <Sheet open={!!selectedSection} onOpenChange={(open) => !open && closeEditor()}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {editData && (
            <>
              <SheetHeader>
                <SheetTitle className="font-heading">
                  Edit {formatSectionName(editData.section_key)}
                </SheetTitle>
                <SheetDescription>
                  Update content for the {editData.page_slug} page.
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Published toggle */}
                <div className="flex items-center gap-3">
                  <Switch
                    checked={editData.published}
                    onCheckedChange={(checked) =>
                      setEditData({ ...editData, published: checked })
                    }
                  />
                  <Label>{editData.published ? "Published" : "Draft"}</Label>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editData.title || ""}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value || null })}
                      placeholder="Section title"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subtitle</Label>
                    <Input
                      value={editData.subtitle || ""}
                      onChange={(e) => setEditData({ ...editData, subtitle: e.target.value || null })}
                      placeholder="Section subtitle"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Body Text</Label>
                    <Textarea
                      value={editData.body_text || ""}
                      onChange={(e) => setEditData({ ...editData, body_text: e.target.value || null })}
                      placeholder="Main content text..."
                      rows={8}
                    />
                    <p className="text-xs text-muted-foreground">
                      Use line breaks to create paragraphs.
                    </p>
                  </div>

                  {editData.body_json && (
                    <div className="space-y-2">
                      <Label>Structured Data (JSON)</Label>
                      <Textarea
                        value={JSON.stringify(editData.body_json, null, 2)}
                        onChange={(e) => {
                          try {
                            const parsed = JSON.parse(e.target.value);
                            setEditData({ ...editData, body_json: parsed });
                          } catch {
                            // Invalid JSON, don't update
                          }
                        }}
                        placeholder="JSON data..."
                        rows={10}
                        className="font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        Edit structured content like values, client types, etc.
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Image Asset ID</Label>
                    <Input
                      value={editData.image_asset_id || ""}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          image_asset_id: e.target.value || null,
                        })
                      }
                      placeholder="UUID from Media Library (optional)"
                    />
                  </div>
                </div>

                {/* Save */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button variant="outline" onClick={closeEditor}>
                    Cancel
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </AdminLayout>
  );
}
