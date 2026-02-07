import { useEffect, useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Save, RefreshCw, Edit, Plus, Trash2, X } from "lucide-react";
import { categories } from "@/data/services";

interface ServiceDB {
  id: string;
  slug: string;
  title: string;
  category: string;
  short_description: string;
  hero_description: string;
  what_we_do: string[];
  benefits: string[];
  faqs: any; // JSON from database
  related_slugs: string[];
  published: boolean;
  updated_at: string;
}

export default function AdminServices() {
  const [services, setServices] = useState<ServiceDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceDB | null>(null);
  const [editData, setEditData] = useState<ServiceDB | null>(null);
  const { toast } = useToast();

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });

      if (error) throw error;
      setServices(data || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      toast({
        title: "Error",
        description: "Failed to load services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const openEditor = (service: ServiceDB) => {
    setSelectedService(service);
    setEditData({ ...service });
  };

  const closeEditor = () => {
    setSelectedService(null);
    setEditData(null);
  };

  const handleSave = async () => {
    if (!editData) return;
    setSaving(true);

    try {
      const { error } = await supabase
        .from("services")
        .update({
          title: editData.title,
          short_description: editData.short_description,
          hero_description: editData.hero_description,
          what_we_do: editData.what_we_do,
          benefits: editData.benefits,
          faqs: editData.faqs,
          published: editData.published,
        })
        .eq("id", editData.id);

      if (error) throw error;

      setServices((prev) =>
        prev.map((s) => (s.id === editData.id ? editData : s))
      );
      toast({ title: "Service saved" });
      closeEditor();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const addListItem = (field: "what_we_do" | "benefits") => {
    if (!editData) return;
    setEditData({
      ...editData,
      [field]: [...editData[field], ""],
    });
  };

  const updateListItem = (field: "what_we_do" | "benefits", index: number, value: string) => {
    if (!editData) return;
    const updated = [...editData[field]];
    updated[index] = value;
    setEditData({ ...editData, [field]: updated });
  };

  const removeListItem = (field: "what_we_do" | "benefits", index: number) => {
    if (!editData) return;
    const updated = editData[field].filter((_, i) => i !== index);
    setEditData({ ...editData, [field]: updated });
  };

  const addFaq = () => {
    if (!editData) return;
    setEditData({
      ...editData,
      faqs: [...editData.faqs, { question: "", answer: "" }],
    });
  };

  const updateFaq = (index: number, field: "question" | "answer", value: string) => {
    if (!editData) return;
    const updated = [...editData.faqs];
    updated[index] = { ...updated[index], [field]: value };
    setEditData({ ...editData, faqs: updated });
  };

  const removeFaq = (index: number) => {
    if (!editData) return;
    const updated = editData.faqs.filter((_, i) => i !== index);
    setEditData({ ...editData, faqs: updated });
  };

  // Group services by category
  const servicesByCategory = services.reduce((acc, service) => {
    if (!acc[service.category]) acc[service.category] = [];
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, ServiceDB[]>);

  return (
    <AdminLayout title="Services Manager">
      <div className="flex items-center justify-between mb-6">
        <p className="text-muted-foreground">
          Edit service content. Services are pre-defined—you can refine wording but not add new ones.
        </p>
        <Button variant="outline" size="icon" onClick={fetchServices}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : services.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No services found. Services are seeded from the default data.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
            <div key={category}>
              <h3 className="font-heading font-bold text-lg mb-4">{category}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryServices.map((service) => (
                  <Card
                    key={service.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => openEditor(service)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">{service.title}</CardTitle>
                        <Badge variant={service.published ? "default" : "secondary"}>
                          {service.published ? "Live" : "Draft"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {service.short_description}
                      </p>
                      <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Sheet */}
      <Sheet open={!!selectedService} onOpenChange={(open) => !open && closeEditor()}>
        <SheetContent className="sm:max-w-2xl overflow-y-auto">
          {editData && (
            <>
              <SheetHeader>
                <SheetTitle className="font-heading">{editData.title}</SheetTitle>
                <SheetDescription>
                  Category: {editData.category} • Slug: {editData.slug}
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

                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input
                      value={editData.title}
                      onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Textarea
                      value={editData.short_description}
                      onChange={(e) =>
                        setEditData({ ...editData, short_description: e.target.value })
                      }
                      rows={2}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Hero Description</Label>
                    <Textarea
                      value={editData.hero_description}
                      onChange={(e) =>
                        setEditData({ ...editData, hero_description: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </div>

                {/* What We Do */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="what_we_do">
                    <AccordionTrigger>What We Do ({editData.what_we_do.length} items)</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {editData.what_we_do.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateListItem("what_we_do", index, e.target.value)}
                            placeholder="Service item"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeListItem("what_we_do", index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addListItem("what_we_do")}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </Button>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="benefits">
                    <AccordionTrigger>Benefits ({editData.benefits.length} items)</AccordionTrigger>
                    <AccordionContent className="space-y-2">
                      {editData.benefits.map((item, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={item}
                            onChange={(e) => updateListItem("benefits", index, e.target.value)}
                            placeholder="Benefit"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeListItem("benefits", index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={() => addListItem("benefits")}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </Button>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="faqs">
                    <AccordionTrigger>FAQs ({editData.faqs.length} items)</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      {editData.faqs.map((faq, index) => (
                        <div key={index} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                          <div className="flex gap-2">
                            <Input
                              value={faq.question}
                              onChange={(e) => updateFaq(index, "question", e.target.value)}
                              placeholder="Question"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFaq(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          <Textarea
                            value={faq.answer}
                            onChange={(e) => updateFaq(index, "answer", e.target.value)}
                            placeholder="Answer"
                            rows={2}
                          />
                        </div>
                      ))}
                      <Button variant="outline" size="sm" onClick={addFaq}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add FAQ
                      </Button>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

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
