import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Plus, Zap, Home, Clock, Users, Shield, Sun, Tv, Phone, Award, TrendingUp, Target, CheckCircle, Star, Heart } from "lucide-react";
import { SortableStat } from "@/components/admin/SortableStat";

// Available icons for stats
const ICON_OPTIONS = [
  { value: "Home", icon: Home, label: "Home" },
  { value: "Users", icon: Users, label: "Users" },
  { value: "Clock", icon: Clock, label: "Clock" },
  { value: "Zap", icon: Zap, label: "Zap" },
  { value: "Shield", icon: Shield, label: "Shield" },
  { value: "Sun", icon: Sun, label: "Sun" },
  { value: "Tv", icon: Tv, label: "TV" },
  { value: "Phone", icon: Phone, label: "Phone" },
  { value: "Award", icon: Award, label: "Award" },
  { value: "TrendingUp", icon: TrendingUp, label: "Trending Up" },
  { value: "Target", icon: Target, label: "Target" },
  { value: "CheckCircle", icon: CheckCircle, label: "Check Circle" },
  { value: "Star", icon: Star, label: "Star" },
  { value: "Heart", icon: Heart, label: "Heart" },
];

const getIconComponent = (iconName: string) => {
  const iconOption = ICON_OPTIONS.find((i) => i.value === iconName);
  return iconOption?.icon || Zap;
};

interface StatDB {
  id: string;
  icon: string;
  value: number;
  suffix: string;
  label: string;
  subtext: string | null;
  sort_order: number;
  published: boolean;
}

export default function AdminStats() {
  const [stats, setStats] = useState<StatDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedStat, setSelectedStat] = useState<StatDB | null>(null);
  const [editData, setEditData] = useState<StatDB | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchStats = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("stats")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setStats(data || []);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
      toast({
        title: "Error",
        description: "Failed to load stats",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const openEditor = (stat: StatDB) => {
    setSelectedStat(stat);
    setEditData({ ...stat });
    setIsNew(false);
  };

  const openNewEditor = () => {
    const newStat: StatDB = {
      id: "",
      icon: "Zap",
      value: 100,
      suffix: "+",
      label: "",
      subtext: "",
      sort_order: stats.length,
      published: true,
    };
    setSelectedStat(newStat);
    setEditData(newStat);
    setIsNew(true);
  };

  const closeEditor = () => {
    setSelectedStat(null);
    setEditData(null);
    setIsNew(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = stats.findIndex((s) => s.id === active.id);
      const newIndex = stats.findIndex((s) => s.id === over.id);

      const newStats = arrayMove(stats, oldIndex, newIndex).map((s, idx) => ({
        ...s,
        sort_order: idx,
      }));

      setStats(newStats);

      // Update sort orders in database
      try {
        const updates = newStats.map((s) =>
          supabase
            .from("stats")
            .update({ sort_order: s.sort_order })
            .eq("id", s.id)
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
        fetchStats(); // Revert on error
      }
    }
  };

  const handleSave = async () => {
    if (!editData || !editData.label.trim()) {
      toast({
        title: "Validation Error",
        description: "Label is required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      if (isNew) {
        const { data, error } = await supabase
          .from("stats")
          .insert({
            icon: editData.icon,
            value: editData.value,
            suffix: editData.suffix,
            label: editData.label,
            subtext: editData.subtext,
            sort_order: editData.sort_order,
            published: editData.published,
          })
          .select()
          .single();

        if (error) throw error;

        setStats((prev) => [...prev, data]);
        toast({ title: "Stat added" });
      } else {
        const { error } = await supabase
          .from("stats")
          .update({
            icon: editData.icon,
            value: editData.value,
            suffix: editData.suffix,
            label: editData.label,
            subtext: editData.subtext,
            sort_order: editData.sort_order,
            published: editData.published,
          })
          .eq("id", editData.id);

        if (error) throw error;

        setStats((prev) =>
          prev.map((s) => (s.id === editData.id ? editData : s))
        );
        toast({ title: "Stat updated" });
      }
      closeEditor();
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save stat",
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
        .from("stats")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setStats((prev) => prev.filter((s) => s.id !== deleteId));
      toast({ title: "Stat deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete stat",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Stats Counter">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">
            Manage the statistics displayed on the homepage counter section.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            💡 Drag and drop to reorder stats
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchStats}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openNewEditor}>
            <Plus className="h-4 w-4 mr-2" />
            Add Stat
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : stats.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No stats yet. Click "Add Stat" to create one.
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={stats.map((s) => s.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <SortableStat
                  key={stat.id}
                  stat={stat}
                  onEdit={openEditor}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Edit Sheet */}
      <Sheet open={!!selectedStat} onOpenChange={(open) => !open && closeEditor()}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {editData && (
            <>
              <SheetHeader>
                <SheetTitle className="font-heading">
                  {isNew ? "Add Stat" : "Edit Stat"}
                </SheetTitle>
                <SheetDescription>
                  {isNew
                    ? "Add a new statistic to the counter."
                    : "Update statistic information."}
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
                <div className="p-4 bg-primary rounded-lg text-center">
                  <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-2">
                    {(() => {
                      const IconComponent = getIconComponent(editData.icon);
                      return <IconComponent className="w-6 h-6 text-secondary" />;
                    })()}
                  </div>
                  <p className="text-3xl font-bold text-secondary">
                    {editData.value.toLocaleString()}{editData.suffix}
                  </p>
                  <p className="text-primary-foreground font-medium">{editData.label || "Label"}</p>
                  <p className="text-primary-foreground/60 text-sm">{editData.subtext || "Subtext"}</p>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Icon</Label>
                    <Select
                      value={editData.icon}
                      onValueChange={(value) => setEditData({ ...editData, icon: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ICON_OPTIONS.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <opt.icon className="w-4 h-4" />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Value *</Label>
                      <Input
                        type="number"
                        value={editData.value}
                        onChange={(e) =>
                          setEditData({ ...editData, value: parseInt(e.target.value) || 0 })
                        }
                        placeholder="e.g., 500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Suffix</Label>
                      <Input
                        value={editData.suffix}
                        onChange={(e) => setEditData({ ...editData, suffix: e.target.value })}
                        placeholder="e.g., + or /7"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Label *</Label>
                    <Input
                      value={editData.label}
                      onChange={(e) => setEditData({ ...editData, label: e.target.value })}
                      placeholder="e.g., Projects Delivered"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Subtext</Label>
                    <Input
                      value={editData.subtext || ""}
                      onChange={(e) => setEditData({ ...editData, subtext: e.target.value })}
                      placeholder="e.g., since 2014"
                    />
                  </div>
                </div>

                {/* Save */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : isNew ? "Add Stat" : "Save Changes"}
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
            <AlertDialogTitle>Delete Stat?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The stat will be permanently removed.
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
