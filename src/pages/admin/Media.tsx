import { useEffect, useState, useCallback, useRef } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDataState } from "@/components/admin/AdminDataState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Upload, 
  RefreshCw, 
  Trash2, 
  Copy, 
  Image as ImageIcon,
  Search,
  FileImage
} from "lucide-react";

interface MediaAsset {
  id: string;
  created_at: string;
  title: string;
  alt: string | null;
  category: string | null;
  tags: string[];
  storage_path: string;
  public_url: string;
  width: number | null;
  height: number | null;
  bytes: number | null;
  is_stock: boolean;
  source: string | null;
}

const MEDIA_CATEGORIES = [
  "Hero",
  "Security", 
  "Solar",
  "Electrical",
  "Coverage",
  "Service",
  "Gallery",
  "Logo",
  "Icon",
  "Other",
];

export default function AdminMedia() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [showUploadDialog, setShowUploadDialog] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadForm, setUploadForm] = useState({
    title: "",
    alt: "",
    category: "other",
    file: null as File | null,
  });

  const { toast } = useToast();

  const fetchAssets = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("[AdminMedia] Fetching media assets...");
      
      const { data, error: fetchError } = await supabase
        .from("media_assets")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("[AdminMedia] Fetch error:", fetchError);
        throw new Error(fetchError.message);
      }
      
      setAssets(data || []);
      console.log("[AdminMedia] Loaded", data?.length || 0, "assets");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load media";
      console.error("[AdminMedia] Error:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [fetchAssets]);

  const filteredAssets = assets.filter((asset) => {
    const matchesSearch =
      searchQuery === "" ||
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.alt?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || asset.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadForm({
        ...uploadForm,
        file,
        title: file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " "),
      });
    }
  };

  const handleUpload = async () => {
    if (!uploadForm.file || !uploadForm.title) {
      toast({
        title: "Missing fields",
        description: "Please select a file and provide a title",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    try {
      console.log("[AdminMedia] Starting upload...");
      
      const file = uploadForm.file;
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file);

      if (uploadError) {
        console.error("[AdminMedia] Storage upload error:", uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from("media")
        .getPublicUrl(filePath);

      // Get image dimensions if it's an image
      let width: number | null = null;
      let height: number | null = null;
      if (file.type.startsWith("image/")) {
        const dimensions = await getImageDimensions(file);
        width = dimensions.width;
        height = dimensions.height;
      }

      // Create media asset record
      const { data, error: insertError } = await supabase
        .from("media_assets")
        .insert({
          title: uploadForm.title,
          alt: uploadForm.alt || null,
          category: uploadForm.category,
          storage_path: filePath,
          public_url: urlData.publicUrl,
          width,
          height,
          bytes: file.size,
          source: "admin upload",
        })
        .select()
        .single();

      if (insertError) {
        console.error("[AdminMedia] DB insert error:", insertError);
        throw new Error(`Database error: ${insertError.message}`);
      }

      setAssets((prev) => [data, ...prev]);
      setShowUploadDialog(false);
      setUploadForm({ title: "", alt: "", category: "other", file: null });
      toast({ title: "File uploaded successfully" });
      console.log("[AdminMedia] Upload complete");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload file";
      console.error("[AdminMedia] Upload error:", message);
      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.onerror = () => {
        resolve({ width: 0, height: 0 });
      };
      img.src = URL.createObjectURL(file);
    });
  };

  const handleDelete = async (asset: MediaAsset) => {
    if (!confirm("Are you sure you want to delete this file? This cannot be undone.")) return;

    try {
      console.log("[AdminMedia] Deleting asset:", asset.id);
      
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from("media")
        .remove([asset.storage_path]);

      if (storageError) {
        console.warn("[AdminMedia] Storage delete warning:", storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from("media_assets")
        .delete()
        .eq("id", asset.id);

      if (dbError) {
        console.error("[AdminMedia] DB delete error:", dbError);
        throw new Error(dbError.message);
      }

      setAssets((prev) => prev.filter((a) => a.id !== asset.id));
      setSelectedAsset(null);
      toast({ title: "File deleted" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete file";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({ title: "URL copied to clipboard" });
  };

  const formatBytes = (bytes: number | null): string => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <AdminLayout title="Media Library">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {MEDIA_CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={fetchAssets} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button onClick={() => setShowUploadDialog(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredAssets.length} of {assets.length} files
      </p>

      <AdminDataState
        isLoading={loading}
        error={error}
        onRetry={fetchAssets}
        isEmpty={!loading && !error && filteredAssets.length === 0}
        emptyMessage="No media files found. Upload images to use in your website content."
      >
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {filteredAssets.map((asset) => (
            <Card
              key={asset.id}
              className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
              onClick={() => setSelectedAsset(asset)}
            >
              <div className="aspect-square relative bg-muted">
                <img
                  src={asset.public_url}
                  alt={asset.alt || asset.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {asset.category && (
                  <Badge className="absolute top-2 right-2" variant="secondary">
                    {asset.category}
                  </Badge>
                )}
              </div>
              <CardContent className="p-3">
                <p className="font-medium truncate text-sm">{asset.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(asset.bytes)}
                  {asset.width && asset.height && ` • ${asset.width}×${asset.height}`}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </AdminDataState>

      {/* Empty state with upload button */}
      {!loading && !error && filteredAssets.length === 0 && (
        <Card className="mt-4">
          <CardContent className="py-12 text-center">
            <FileImage className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium mb-2">No media files</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload images to use in your website content
            </p>
            <Button onClick={() => setShowUploadDialog(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Upload First File
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Media</DialogTitle>
            <DialogDescription>
              Upload images to use across your website
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div
              className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              {uploadForm.file ? (
                <div className="space-y-2">
                  <ImageIcon className="h-8 w-8 mx-auto text-primary" />
                  <p className="font-medium">{uploadForm.file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatBytes(uploadForm.file.size)}
                  </p>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Click or drag to upload an image
                  </p>
                </>
              )}
            </div>

            <div className="space-y-2">
              <Label>Title *</Label>
              <Input
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="Image title"
              />
            </div>

            <div className="space-y-2">
              <Label>Alt Text</Label>
              <Input
                value={uploadForm.alt}
                onChange={(e) => setUploadForm({ ...uploadForm, alt: e.target.value })}
                placeholder="Describe the image for accessibility"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={uploadForm.category}
                onValueChange={(value) => setUploadForm({ ...uploadForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MEDIA_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowUploadDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploading || !uploadForm.file}>
              {uploading ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Asset Details Dialog */}
      <Dialog open={!!selectedAsset} onOpenChange={(open) => !open && setSelectedAsset(null)}>
        <DialogContent className="max-w-2xl">
          {selectedAsset && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedAsset.title}</DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  <img
                    src={selectedAsset.public_url}
                    alt={selectedAsset.alt || selectedAsset.title}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">File URL</Label>
                    <div className="flex gap-2 mt-1">
                      <Input value={selectedAsset.public_url} readOnly className="text-xs" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => copyUrl(selectedAsset.public_url)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <Label className="text-muted-foreground">Size</Label>
                      <p>{formatBytes(selectedAsset.bytes)}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Dimensions</Label>
                      <p>
                        {selectedAsset.width && selectedAsset.height
                          ? `${selectedAsset.width} × ${selectedAsset.height}`
                          : "Unknown"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Category</Label>
                      <p>{selectedAsset.category || "None"}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Source</Label>
                      <p>{selectedAsset.source || "Unknown"}</p>
                    </div>
                  </div>

                  {selectedAsset.alt && (
                    <div>
                      <Label className="text-muted-foreground">Alt Text</Label>
                      <p className="text-sm">{selectedAsset.alt}</p>
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <Button
                      variant="destructive"
                      onClick={() => handleDelete(selectedAsset)}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete File
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
