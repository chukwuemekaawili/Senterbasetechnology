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
import { Save, RefreshCw, Plus, User } from "lucide-react";
import { SortableTeamMember } from "@/components/admin/SortableTeamMember";

interface TeamMemberDB {
  id: string;
  name: string;
  role: string;
  image_asset_id: string | null;
  image_url?: string | null;
  sort_order: number;
  published: boolean;
}

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMemberDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMemberDB | null>(null);
  const [editData, setEditData] = useState<TeamMemberDB | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("team_members")
        .select(`
          id,
          name,
          role,
          image_asset_id,
          sort_order,
          published,
          media_assets!team_members_image_asset_id_fkey (
            public_url
          )
        `)
        .order("sort_order", { ascending: true });

      if (error) throw error;

      setMembers(
        (data || []).map((m: any) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          image_asset_id: m.image_asset_id,
          image_url: m.media_assets?.public_url || null,
          sort_order: m.sort_order,
          published: m.published,
        }))
      );
    } catch (error) {
      console.error("Failed to fetch team members:", error);
      toast({
        title: "Error",
        description: "Failed to load team members",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const openEditor = (member: TeamMemberDB) => {
    setSelectedMember(member);
    setEditData({ ...member });
    setIsNew(false);
  };

  const openNewEditor = () => {
    const newMember: TeamMemberDB = {
      id: "",
      name: "",
      role: "",
      image_asset_id: null,
      image_url: null,
      sort_order: members.length,
      published: true,
    };
    setSelectedMember(newMember);
    setEditData(newMember);
    setIsNew(true);
  };

  const closeEditor = () => {
    setSelectedMember(null);
    setEditData(null);
    setIsNew(false);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = members.findIndex((m) => m.id === active.id);
      const newIndex = members.findIndex((m) => m.id === over.id);

      const newMembers = arrayMove(members, oldIndex, newIndex).map((m, idx) => ({
        ...m,
        sort_order: idx,
      }));

      setMembers(newMembers);

      // Update sort orders in database
      try {
        const updates = newMembers.map((m) =>
          supabase
            .from("team_members")
            .update({ sort_order: m.sort_order })
            .eq("id", m.id)
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
        fetchMembers(); // Revert on error
      }
    }
  };

  const handleSave = async () => {
    if (!editData || !editData.name.trim() || !editData.role.trim()) {
      toast({
        title: "Validation Error",
        description: "Name and role are required",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      if (isNew) {
        const { data, error } = await supabase
          .from("team_members")
          .insert({
            name: editData.name,
            role: editData.role,
            image_asset_id: editData.image_asset_id,
            sort_order: editData.sort_order,
            published: editData.published,
          })
          .select()
          .single();

        if (error) throw error;

        setMembers((prev) => [...prev, { ...data, image_url: editData.image_url }]);
        toast({ title: "Team member added" });
      } else {
        const { error } = await supabase
          .from("team_members")
          .update({
            name: editData.name,
            role: editData.role,
            image_asset_id: editData.image_asset_id,
            sort_order: editData.sort_order,
            published: editData.published,
          })
          .eq("id", editData.id);

        if (error) throw error;

        setMembers((prev) =>
          prev.map((m) => (m.id === editData.id ? editData : m))
        );
        toast({ title: "Team member updated" });
      }
      closeEditor();
    } catch (error) {
      console.error("Save error:", error);
      toast({
        title: "Error",
        description: "Failed to save team member",
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
        .from("team_members")
        .delete()
        .eq("id", deleteId);

      if (error) throw error;

      setMembers((prev) => prev.filter((m) => m.id !== deleteId));
      toast({ title: "Team member deleted" });
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete team member",
        variant: "destructive",
      });
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <AdminLayout title="Team Members">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-muted-foreground">
            Manage the leadership team displayed on the About page.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            💡 Drag and drop to reorder team members
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={fetchMembers}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button onClick={openNewEditor}>
            <Plus className="h-4 w-4 mr-2" />
            Add Member
          </Button>
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : members.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No team members yet. Click "Add Member" to add your first team member.
          </CardContent>
        </Card>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={members.map((m) => m.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {members.map((member) => (
                <SortableTeamMember
                  key={member.id}
                  member={member}
                  onEdit={openEditor}
                  onDelete={setDeleteId}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {/* Edit Sheet */}
      <Sheet open={!!selectedMember} onOpenChange={(open) => !open && closeEditor()}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {editData && (
            <>
              <SheetHeader>
                <SheetTitle className="font-heading">
                  {isNew ? "Add Team Member" : "Edit Team Member"}
                </SheetTitle>
                <SheetDescription>
                  {isNew
                    ? "Add a new member to the leadership team."
                    : "Update team member information."}
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

                {/* Avatar preview */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                    {editData.image_url ? (
                      <img
                        src={editData.image_url}
                        alt={editData.name || "Member"}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>To change the photo, upload an image in</p>
                    <p className="font-medium text-foreground">Media Library</p>
                    <p>and paste the asset ID below.</p>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Name *</Label>
                    <Input
                      value={editData.name}
                      onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                      placeholder="e.g., Engr. Idris Saliu"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Role / Title *</Label>
                    <Input
                      value={editData.role}
                      onChange={(e) => setEditData({ ...editData, role: e.target.value })}
                      placeholder="e.g., Founder"
                    />
                  </div>

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
                      placeholder="UUID from Media Library"
                    />
                    <p className="text-xs text-muted-foreground">
                      Copy the ID from Media Library after uploading a photo.
                    </p>
                  </div>
                </div>

                {/* Save */}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleSave} disabled={saving} className="flex-1">
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Saving..." : isNew ? "Add Member" : "Save Changes"}
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
            <AlertDialogTitle>Delete Team Member?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. The team member will be permanently removed.
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
