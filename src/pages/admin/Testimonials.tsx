import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Plus, Quote } from "lucide-react";
import { SortableTestimonial } from "@/components/admin/SortableTestimonial";

interface TestimonialDB {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  initials: string;
  sort_order: number;
  published: boolean;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState<TestimonialDB | null>(null);
  const [editData, setEditData] = useState<TestimonialDB | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error("Failed to fetch testimonials:", error);
      toast({
        title: "Error",
        description: "Failed to load testimonials",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const openEditor = (testimonial: TestimonialDB) => {
    setSelectedTestimonial(testimonial);
    setEditData({ ...testimonial });
    setIsNew(false);
  };

  const openNewEditor = () => {
    const newTestimonial: TestimonialDB = {
      id: "",
      name: "",
      role: "",
      content: "",
      rating: 5,
      initials: "",
      sort_order: testimonials.length,
      published: true,
    };
    setSelectedTestimonial(newTestimonial);
    setEditData(newTestimonial);
    setIsNew(true);
  };

  const closeEditor = () => {
    setSelectedTestimonial(null);
    setEditData(null);
    setIsNew(false);
  };

  // Auto-generate initials from name
  const generateInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = testimonials.findIndex((t) => t.id === active.id);
      const newIndex = testimonials.findIndex((t) => t.id === over.id);

      const newTestimonials = arrayMove(testimonials, oldIndex, newIndex).map((t, idx) => ({
        ...t,
        sort_order: idx,
      }));

      setTestimonials(newTestimonials);

      // Update sort orders in database
      try {
        const updates = newTestimonials.map((t) =>
          supabase
            .from("testimonials")
            .update({ sort_order: t.sort_order })
            .eq("id", t.id)
        );

        await Promise.all(updates);
        toast({ title: "Order updated" });
      } catch (error) {
        console.error("Failed to update order:", error);
        toast({
          title: "Error",
          description: "Failed to save new order",
          variant: "destructive",
        });
        fetchTestimonials(); // Revert on error
      }
    }
  };

  const handleSave = async () => {
    if (!editData || !editData.name.trim() || !editData.content.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and content are required",
        variant: "destructive",
      });
      return;
    }

    // Auto-generate initials if empty
    const initials = editData.initials.trim() || generateInitials(editData.name);

    setSaving(true);

    try {
      if (isNew) {
        const { data, error } = await supabase
          .from("testimonials")
          .insert({
            name: editData.name,
            role: editData.role,
            content: editData.content,
            rating: editData.rating,
            initials,
            sort_order: editData.sort_order,
            published: editData.published,
          })
          .select()
          .single();

        if (error) throw error;

        setTestimonials((prev) => [...prev, data]);
        toast({ title: "Testimonial added" });
      } else {
        const { error } = await supabase
          .from("testimonials")
          .update({
            name: editData.name,
            role: editData.role,
            content: editData.content,
            rating: editData.rating,
            initials,
            sort_order: editData.sort_order,
            published: editData.published,
          })
          .eq("id", editData.id);

        if (error) throw error;

        setTestimonials((prev) =>
          prev.map((t) => (t.id === editData.id ? { ...editData, initials } : t))
        );
        toast({ title: "Testimonial updated" });
      }
      closeEditor();
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save testimonial",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const { error } = await supabase
        .from("testimonials")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setTestimonials((prev) => prev.filter((t) => t.id !== deleteId));
      toast({ title: "Testimonial deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete testimonial",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Testimonials">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">
            Manage client testimonials displayed on the homepage.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            💡 Drag and drop to reorder testimonials
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchTestimonials}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openNewEditor}>
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : testimonials.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No testimonials yet. Click "Add Testimonial" to create one.
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={testimonials.map((t) => t.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-4 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <SortableTestimonial
                  key={testimonial.id}
                  testimonial={testimonial}
                  onEdit={openEditor}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Edit Sheet */}
      <Sheet open={!!selectedTestimonial} onOpenChange={(open) => !open && closeEditor()}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {editData && (
            <>
              <SheetHeader>
                <SheetTitle className="font-heading">
                  {isNew ? "Add Testimonial" : "Edit Testimonial"}
                </SheetTitle>
                <SheetDescription>
                  {isNew
                    ? "Add a new client testimonial."
                    : "Update testimonial information."}
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

                {/* Preview */}
                <div className="p-4 bg-muted/50 rounded-lg">
                  <Quote className="w-6 h-6 text-secondary/30 mb-2" />
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="font-heading font-bold text-sm text-primary-foreground">
                        {editData.initials || generateInitials(editData.name) || "??"}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{editData.name || "Client Name"}</p>
                      <p className="text-xs text-muted-foreground">{editData.role || "Role"}</p>
                    </div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Client Name *</Label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="e.g., Engr. Chukwuma Okonkwo"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role / Title</Label>
                    <Input
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      placeholder="e.g., Estate Developer, Abuja"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Testimonial Content *</Label>
                    <Textarea
                      value={editData.content}
                      onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                      placeholder="What did the client say about STIL?"
                      rows={4}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Rating</Label>
                      <Select
                        value={editData.rating.toString()}
                        onValueChange={(value) =>
                          setEditData({ ...editData, rating: parseInt(value) })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 4, 3, 2, 1].map((r) => (
                            <SelectItem key={r} value={r.toString()}>
                              {r} Star{r > 1 ? "s" : ""}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Initials</Label>
                      <Input
                        value={editData.initials}
                        onChange={(e) =>
                          setEditData({ ...editData, initials: e.target.value.toUpperCase() })
                        }
                        placeholder="Auto-generated"
                        maxLength={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        Leave empty to auto-generate
                      </p>
                    </div>
                  </div>
                </div>

                {/* Save */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : isNew ? "Add Testimonial" : "Save Changes"}
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

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Testimonial?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The testimonial will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
