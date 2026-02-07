import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDataState, AdminErrorBanner } from "@/components/admin/AdminDataState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Phone, Globe, Lock, Image as ImageIcon, X } from "lucide-react";

interface SiteSettings {
  id: string;
  phone: string;
  email: string;
  address: string;
  primary_cta_label: string;
  coverage_statement: string;
  site_title: string;
  meta_description: string | null;
  social_facebook: string | null;
  social_instagram: string | null;
  social_twitter: string | null;
  logo_url: string | null;
  logo_dark_url: string | null;
  og_image_url: string | null;
  hero_image_url: string | null;
  whatsapp_number: string | null;
  updated_at: string;
}

interface MediaAsset {
  id: string;
  title: string;
  public_url: string;
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [showMediaPicker, setShowMediaPicker] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("[AdminSettings] Fetching settings...");
      
      const { data, error: fetchError } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .maybeSingle();

      if (fetchError) {
        console.error("[AdminSettings] Fetch error:", fetchError);
        throw new Error(fetchError.message);
      }

      if (!data) {
        throw new Error("No site settings found. Please contact support.");
      }

      setSettings(data);
      console.log("[AdminSettings] Settings loaded successfully");
      
      // Also fetch media assets for picker
      const { data: mediaData } = await supabase
        .from("media_assets")
        .select("id, title, public_url")
        .order("created_at", { ascending: false });
      
      setMediaAssets(mediaData || []);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load site settings";
      console.error("[AdminSettings] Error:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    if (!settings) return;
    setSaving(true);

    try {
      console.log("[AdminSettings] Saving settings...");
      
      const { error: updateError } = await supabase
        .from("site_settings")
        .update({
          phone: settings.phone,
          email: settings.email,
          address: settings.address,
          primary_cta_label: settings.primary_cta_label,
          site_title: settings.site_title,
          meta_description: settings.meta_description,
          social_facebook: settings.social_facebook,
          social_instagram: settings.social_instagram,
          social_twitter: settings.social_twitter,
          logo_url: settings.logo_url,
          logo_dark_url: settings.logo_dark_url,
          og_image_url: settings.og_image_url,
          hero_image_url: settings.hero_image_url,
          whatsapp_number: settings.whatsapp_number,
        })
        .eq("id", settings.id);

      if (updateError) {
        console.error("[AdminSettings] Update error:", updateError);
        throw new Error(updateError.message);
      }

      toast({ title: "Settings saved successfully" });
      console.log("[AdminSettings] Settings saved");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save settings";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: keyof SiteSettings, value: string | null) => {
    if (!settings) return;
    setSettings({ ...settings, [field]: value });
  };

  const selectImage = (field: string, url: string) => {
    updateField(field as keyof SiteSettings, url);
    setShowMediaPicker(null);
  };

  const clearImage = (field: keyof SiteSettings) => {
    updateField(field, null);
  };

  return (
    <AdminLayout title="Site Settings">
      <AdminDataState
        isLoading={loading}
        error={error}
        onRetry={fetchSettings}
      >
        {settings && (
          <div className="max-w-3xl space-y-6">
            {/* Brand & Logo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Brand & Logo
                </CardTitle>
                <CardDescription>
                  Manage your site logo and branding images
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Site Logo */}
                <div className="space-y-2">
                  <Label>Site Logo</Label>
                  <div className="flex items-center gap-4">
                    {settings.logo_url ? (
                      <div className="relative">
                        <img 
                          src={settings.logo_url} 
                          alt="Site Logo" 
                          className="h-16 w-auto max-w-[200px] object-contain bg-muted rounded p-2"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => clearImage("logo_url")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="h-16 w-32 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                        No logo
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => setShowMediaPicker("logo_url")}
                    >
                      Choose from Media Library
                    </Button>
                  </div>
                </div>

                {/* Dark Logo */}
                <div className="space-y-2">
                  <Label>Logo (Dark Version) - Optional</Label>
                  <div className="flex items-center gap-4">
                    {settings.logo_dark_url ? (
                      <div className="relative">
                        <img 
                          src={settings.logo_dark_url} 
                          alt="Dark Logo" 
                          className="h-16 w-auto max-w-[200px] object-contain bg-gray-900 rounded p-2"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => clearImage("logo_dark_url")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="h-16 w-32 bg-gray-900 rounded flex items-center justify-center text-gray-500 text-sm">
                        No dark logo
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => setShowMediaPicker("logo_dark_url")}
                    >
                      Choose from Media Library
                    </Button>
                  </div>
                </div>

                {/* Hero Image */}
                <div className="space-y-2">
                  <Label>Hero Background Image</Label>
                  <div className="flex items-center gap-4">
                    {settings.hero_image_url ? (
                      <div className="relative">
                        <img 
                          src={settings.hero_image_url} 
                          alt="Hero Background" 
                          className="h-20 w-36 object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => clearImage("hero_image_url")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="h-20 w-36 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                        Default hero
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => setShowMediaPicker("hero_image_url")}
                    >
                      Choose from Media Library
                    </Button>
                  </div>
                </div>

                {/* OG Image */}
                <div className="space-y-2">
                  <Label>Open Graph Image (Social Share)</Label>
                  <div className="flex items-center gap-4">
                    {settings.og_image_url ? (
                      <div className="relative">
                        <img 
                          src={settings.og_image_url} 
                          alt="OG Image" 
                          className="h-16 w-28 object-cover rounded"
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={() => clearImage("og_image_url")}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="h-16 w-28 bg-muted rounded flex items-center justify-center text-muted-foreground text-sm">
                        Default OG
                      </div>
                    )}
                    <Button 
                      variant="outline" 
                      onClick={() => setShowMediaPicker("og_image_url")}
                    >
                      Choose from Media Library
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Recommended: 1200×630px for best social media display
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Information
                </CardTitle>
                <CardDescription>
                  Primary contact details displayed across the website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone Number</Label>
                    <Input
                      value={settings.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      placeholder="+234..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>WhatsApp Number</Label>
                    <Input
                      value={settings.whatsapp_number || ""}
                      onChange={(e) => updateField("whatsapp_number", e.target.value)}
                      placeholder="+234..."
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input
                    type="email"
                    value={settings.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="info@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    value={settings.address}
                    onChange={(e) => updateField("address", e.target.value)}
                    placeholder="Business address"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Site Identity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  Site Identity & SEO
                </CardTitle>
                <CardDescription>
                  How your site appears in search results
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Site Title</Label>
                  <Input
                    value={settings.site_title}
                    onChange={(e) => updateField("site_title", e.target.value)}
                    placeholder="Your Company Name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Meta Description</Label>
                  <Input
                    value={settings.meta_description || ""}
                    onChange={(e) => updateField("meta_description", e.target.value)}
                    placeholder="Brief description of your business (for search engines)"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Primary CTA Label</Label>
                  <Input
                    value={settings.primary_cta_label}
                    onChange={(e) => updateField("primary_cta_label", e.target.value)}
                    placeholder="Call Now"
                  />
                  <p className="text-xs text-muted-foreground">
                    The main call-to-action button text used site-wide
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Coverage Statement (Locked) */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Coverage Statement
                </CardTitle>
                <CardDescription>
                  This is locked for compliance and cannot be edited
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="font-medium">{settings.coverage_statement}</p>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  To change coverage areas, contact the development team.
                </p>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card>
              <CardHeader>
                <CardTitle>Social Media Links</CardTitle>
                <CardDescription>
                  Optional social media profile URLs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Facebook</Label>
                  <Input
                    value={settings.social_facebook || ""}
                    onChange={(e) => updateField("social_facebook", e.target.value)}
                    placeholder="https://facebook.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Instagram</Label>
                  <Input
                    value={settings.social_instagram || ""}
                    onChange={(e) => updateField("social_instagram", e.target.value)}
                    placeholder="https://instagram.com/yourpage"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Twitter / X</Label>
                  <Input
                    value={settings.social_twitter || ""}
                    onChange={(e) => updateField("social_twitter", e.target.value)}
                    placeholder="https://twitter.com/yourhandle"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex gap-4">
              <Button onClick={handleSave} disabled={saving} size="lg">
                <Save className="h-4 w-4 mr-2" />
                {saving ? "Saving..." : "Save All Settings"}
              </Button>
              <Button variant="outline" onClick={fetchSettings} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
            </div>
          </div>
        )}
      </AdminDataState>

      {/* Media Picker Dialog */}
      <Dialog open={!!showMediaPicker} onOpenChange={(open) => !open && setShowMediaPicker(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Select Image</DialogTitle>
            <DialogDescription>
              Choose an image from your media library
            </DialogDescription>
          </DialogHeader>
          
          {mediaAssets.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              No media assets available. Upload images to the Media Library first.
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {mediaAssets.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => showMediaPicker && selectImage(showMediaPicker, asset.public_url)}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors focus:outline-none focus:border-primary"
                >
                  <img
                    src={asset.public_url}
                    alt={asset.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
