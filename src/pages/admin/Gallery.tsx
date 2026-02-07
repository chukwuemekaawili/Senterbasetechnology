import { useEffect, useState, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDataState } from "@/components/admin/AdminDataState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Plus, RefreshCw, Trash2, Star, Edit, Save } from "lucide-react";

interface GalleryItem {
  id: string;
  category: string;
  title: string;
  alt: string | null;
  image_asset_id: string;
  sort_order: number;
  featured: boolean;
  published: boolean;
  media_asset?: {
    public_url: string;
    title: string;
  };
}

interface MediaAsset {
  id: string;
  title: string;
  public_url: string;
  category: string | null;
}

const GALLERY_CATEGORIES = [
  "Security",
  "Solar",
  "Electrical",
  "Gates/Fencing",
  "Inverter",
  "Interiors/Partitioning",
  "Carports",
  "Satellite",
  "Street Lights",
];

export default function AdminGallery() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editItem, setEditItem] = useState<GalleryItem | null>(null);
  
  // New item form
  const [newItem, setNewItem] = useState({
    category: "",
    title: "",
    alt: "",
    image_asset_id: "",
    featured: false,
  });

  const { toast } = useToast();

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("[AdminGallery] Fetching gallery data...");
      
      // Fetch gallery items with media asset info
      const { data: galleryData, error: galleryError } = await supabase
        .from("gallery_items")
        .select(`
          *,
          media_asset:media_assets(public_url, title)
        `)
        .order("category")
        .order("sort_order");

      if (galleryError) {
        console.error("[AdminGallery] Gallery fetch error:", galleryError);
        throw new Error(`Gallery items: ${galleryError.message}`);
      }

      // Fetch media assets for selection
      const { data: mediaData, error: mediaError } = await supabase
        .from("media_assets")
        .select("id, title, public_url, category")
        .order("created_at", { ascending: false });

      if (mediaError) {
        console.error("[AdminGallery] Media fetch error:", mediaError);
        throw new Error(`Media assets: ${mediaError.message}`);
      }

      setItems(galleryData || []);
      setMediaAssets(mediaData || []);
      console.log("[AdminGallery] Loaded", galleryData?.length || 0, "items,", mediaData?.length || 0, "assets");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load gallery";
      console.error("[AdminGallery] Error:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredItems = categoryFilter === "all" 
    ? items 
    : items.filter((item) => item.category === categoryFilter);

  const handleAddItem = async () => {
    if (!newItem.category || !newItem.title || !newItem.image_asset_id) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const { data, error: insertError } = await supabase
        .from("gallery_items")
        .insert({
          category: newItem.category,
          title: newItem.title,
          alt: newItem.alt || null,
          image_asset_id: newItem.image_asset_id,
          featured: newItem.featured,
          published: true,
          sort_order: items.filter((i) => i.category === newItem.category).length,
        })
        .select(`
          *,
          media_asset:media_assets(public_url, title)
        `)
        .single();

      if (insertError) throw new Error(insertError.message);

      setItems((prev) => [...prev, data]);
      setShowAddDialog(false);
      setNewItem({ category: "", title: "", alt: "", image_asset_id: "", featured: false });
      toast({ title: "Gallery item added" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add gallery item";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateItem = async () => {
    if (!editItem) return;
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("gallery_items")
        .update({
          title: editItem.title,
          alt: editItem.alt,
          category: editItem.category,
          featured: editItem.featured,
          published: editItem.published,
        })
        .eq("id", editItem.id);

      if (updateError) throw new Error(updateError.message);

      setItems((prev) =>
        prev.map((item) => (item.id === editItem.id ? editItem : item))
      );
      setEditItem(null);
      toast({ title: "Gallery item updated" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update gallery item";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm("Are you sure you want to delete this gallery item?")) return;

    try {
      const { error: deleteError } = await supabase
        .from("gallery_items")
        .delete()
        .eq("id", itemId);

      if (deleteError) throw new Error(deleteError.message);

      setItems((prev) => prev.filter((item) => item.id !== itemId));
      toast({ title: "Gallery item deleted" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete gallery item";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const toggleFeatured = async (item: GalleryItem) => {
    try {
      const { error: updateError } = await supabase
        .from("gallery_items")
        .update({ featured: !item.featured })
        .eq("id", item.id);

      if (updateError) throw new Error(updateError.message);

      setItems((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, featured: !i.featured } : i))
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update featured status";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <AdminLayout title="Gallery Manager">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {GALLERY_CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2 ml-auto">
          <Button variant="outline" size="icon" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredItems.length} of {items.length} gallery items
      </p>

      <AdminDataState
        isLoading={loading}
        error={error}
        onRetry={fetchData}
        isEmpty={!loading && !error && items.length === 0}
        emptyMessage="No gallery items found. Upload images to the Media Library first, then add them here."
      >
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="aspect-square relative">
                <img
                  src={item.media_asset?.public_url || "/placeholder.svg"}
                  alt={item.alt || item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => setEditItem(item)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    onClick={() => toggleFeatured(item)}
                  >
                    <Star className={`h-4 w-4 ${item.featured ? "fill-yellow-500 text-yellow-500" : ""}`} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDeleteItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                {item.featured && (
                  <Badge className="absolute top-2 right-2 bg-yellow-500">
                    Featured
                  </Badge>
                )}
                {!item.published && (
                  <Badge variant="secondary" className="absolute top-2 left-2">
                    Draft
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <p className="font-medium truncate">{item.title}</p>
                <p className="text-sm text-muted-foreground">{item.category}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminDataState>

      {/* Add Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Gallery Image</DialogTitle>
            <DialogDescription>
              Select an image from the Media Library to add to the gallery.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Category *</Label>
              <Select
                value={newItem.category}
                onValueChange={(value) => setNewItem({ ...newItem, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {GALLERY_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Image *</Label>
              <Select
                value={newItem.image_asset_id}
                onValueChange={(value) => setNewItem({ ...newItem, image_asset_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select image" />
                </SelectTrigger>
                <SelectContent>
                  {mediaAssets.map((asset) => (
                    <SelectItem key={asset.id} value={asset.id}>
                      {asset.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {mediaAssets.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No media assets available. Upload images to the Media Library first.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                placeholder="Image title"
              />
            </div>

            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={newItem.alt}
                onChange={(e) => setNewItem({ ...newItem, alt: e.target.value })}
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={newItem.featured}
                onCheckedChange={(checked) => setNewItem({ ...newItem, featured: checked })}
              />
              <Label>Featured on homepage</Label>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem} disabled={saving}>
              {saving ? "Adding..." : "Add to Gallery"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editItem} onOpenChange={(open) => !open && setEditItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Gallery Item</DialogTitle>
          </DialogHeader>

          {editItem && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={editItem.category}
                  onValueChange={(value) => setEditItem({ ...editItem, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {GALLERY_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Title</Label>
                <Input
                  value={editItem.title}
                  onChange={(e) => setEditItem({ ...editItem, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Alt Text</Label>
                <Input
                  value={editItem.alt || ""}
                  onChange={(e) => setEditItem({ ...editItem, alt: e.target.value })}
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editItem.featured}
                    onCheckedChange={(checked) => setEditItem({ ...editItem, featured: checked })}
                  />
                  <Label>Featured</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={editItem.published}
                    onCheckedChange={(checked) => setEditItem({ ...editItem, published: checked })}
                  />
                  <Label>Published</Label>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditItem(null)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateItem} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
