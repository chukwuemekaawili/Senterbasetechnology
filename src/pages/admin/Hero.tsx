import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface HeroData {
  id: string;
  title: string;
  subtitle: string;
  body_text: string;
  image_asset_id: string | null;
  image_url: string | null;
}

export default function AdminHero() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchHero = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("page_sections")
        .select(`
          id,
          title,
          subtitle,
          body_text,
          image_asset_id,
          media_assets!page_sections_image_asset_id_fkey (
            public_url
          )
        `)
        .eq("page_slug", "home")
        .eq("section_key", "hero")
        .single();

      if (error && error.code !== "PGRST116") throw error;

      if (data) {
        setHeroData({
          id: data.id,
          title: data.title || "",
          subtitle: data.subtitle || "",
          body_text: data.body_text || "",
          image_asset_id: data.image_asset_id,
          image_url: (data as any).media_assets?.public_url || null,
        });
      } else {
        // Create default hero section
        const { data: newData, error: insertError } = await supabase
          .from("page_sections")
          .insert({
            page_slug: "home",
            section_key: "hero",
            title: "Powering Secure, Modern Living",
            subtitle: "STIL Nigeria",
            body_text: "From solar energy to smart security—STIL delivers sustainable solutions across Abuja (FCT) and surrounding FCT areas.",
            published: true,
          })
          .select()
          .single();

        if (insertError) throw insertError;

        setHeroData({
          id: newData.id,
          title: newData.title || "",
          subtitle: newData.subtitle || "",
          body_text: newData.body_text || "",
          image_asset_id: null,
          image_url: null,
        });
      }
    } catch (error) {
      console.error("Failed to fetch hero:", error);
      toast({
        title: "Error",
        description: "Failed to load hero content",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHero();
  }, []);

  const handleSave = async () => {
    if (!heroData) return;

    setSaving(true);

    try {
      const { error } = await supabase
        .from("page_sections")
        .update({
          title: heroData.title,
          subtitle: heroData.subtitle,
          body_text: heroData.body_text,
          image_asset_id: heroData.image_asset_id,
        })
        .eq("id", heroData.id);

      if (error) throw error;

      toast({ title: "Hero content saved" });
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save hero content",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Hero Section">
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Edit the hero section displayed on the homepage.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchHero}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Link to="/" target="_blank">
            <Button variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : heroData ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Editor */}
          <Card>
            <CardHeader>
              <CardTitle>Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Badge / Subtitle</Label>
                <Input
                  value={heroData.subtitle}
                  onChange={(e) => setHeroData({ ...heroData, subtitle: e.target.value })}
                  placeholder="e.g., STIL Nigeria"
                />
                <p className="text-xs text-muted-foreground">
                  Small text shown above the main title
                </p>
              </div>

              <div className="space-y-2">
                <Label>Main Title</Label>
                <Textarea
                  value={heroData.title}
                  onChange={(e) => setHeroData({ ...heroData, title: e.target.value })}
                  placeholder="e.g., Powering Secure, Modern Living"
                  rows={2}
                />
                <p className="text-xs text-muted-foreground">
                  The headline text. Use a comma to split into two lines.
                </p>
              </div>

              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  value={heroData.body_text}
                  onChange={(e) => setHeroData({ ...heroData, body_text: e.target.value })}
                  placeholder="Brief description of your services..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label>Background Image Asset ID</Label>
                <Input
                  value={heroData.image_asset_id || ""}
                  onChange={(e) =>
                    setHeroData({
                      ...heroData,
                      image_asset_id: e.target.value || null,
                    })
                  }
                  placeholder="UUID from Media Library (optional)"
                />
                <p className="text-xs text-muted-foreground">
                  Upload an image in Media Library and paste its ID here.
                </p>
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-primary rounded-lg p-6 text-center">
                {heroData.subtitle && (
                  <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs text-primary-foreground mb-4">
                    {heroData.subtitle}
                  </span>
                )}
                <h1 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
                  {heroData.title.split(",").map((part, i) => (
                    <span key={i}>
                      {part.trim()}
                      {i === 0 && heroData.title.includes(",") && <br />}
                    </span>
                  ))}
                </h1>
                <p className="text-primary-foreground/80 text-sm">
                  {heroData.body_text}
                </p>
                <div className="flex gap-2 justify-center mt-6">
                  <div className="px-4 py-2 bg-secondary rounded text-secondary-foreground text-sm font-medium">
                    Call Now
                  </div>
                  <div className="px-4 py-2 bg-green-600 rounded text-white text-sm font-medium">
                    WhatsApp
                  </div>
                </div>
              </div>
              {heroData.image_url && (
                <div className="mt-4">
                  <Label className="text-sm text-muted-foreground">Background Image:</Label>
                  <img
                    src={heroData.image_url}
                    alt="Hero background"
                    className="w-full h-32 object-cover rounded-lg mt-2"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Failed to load hero content. Please try refreshing.
          </CardContent>
        </Card>
      )}
    </AdminLayout>
  );
}
