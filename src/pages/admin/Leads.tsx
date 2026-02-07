import { useEffect, useState, useMemo, useCallback } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDataState } from "@/components/admin/AdminDataState";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Phone, 
  Mail, 
  MapPin, 
  Copy, 
  Download,
  RefreshCw,
  Loader2
} from "lucide-react";
import { format } from "date-fns";

interface Lead {
  id: string;
  created_at: string;
  updated_at: string | null;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  location: string;
  message: string;
  source_page: string;
  preferred_contact_time: string | null;
  status: string;
  admin_note: string | null;
}

const STATUS_OPTIONS = ["new", "contacted", "quoted", "closed"];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-secondary/20 text-secondary border-secondary/30",
  contacted: "bg-primary/20 text-primary border-primary/30",
  quoted: "bg-accent/20 text-accent border-accent/30",
  closed: "bg-muted text-muted-foreground border-muted",
};

export default function AdminLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("[AdminLeads] Fetching leads...");
      
      const { data, error: fetchError } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (fetchError) {
        console.error("[AdminLeads] Fetch error:", fetchError);
        throw new Error(fetchError.message);
      }
      
      setLeads(data || []);
      console.log("[AdminLeads] Loaded", data?.length || 0, "leads");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load leads";
      console.error("[AdminLeads] Error:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Get unique services for filter
  const uniqueServices = useMemo(() => {
    const services = new Set(leads.map((l) => l.service));
    return Array.from(services).sort();
  }, [leads]);

  // Filtered leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        searchQuery === "" ||
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery) ||
        lead.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === "all" || lead.status === statusFilter;
      const matchesService = serviceFilter === "all" || lead.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [leads, searchQuery, statusFilter, serviceFilter]);

  const handleStatusChange = async (leadId: string, newStatus: string) => {
    try {
      const { error: updateError } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", leadId);

      if (updateError) throw new Error(updateError.message);

      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );

      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }

      toast({ title: "Status updated" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  const handleSaveNote = async () => {
    if (!selectedLead) return;
    setSaving(true);

    try {
      const { error: updateError } = await supabase
        .from("leads")
        .update({ admin_note: adminNote })
        .eq("id", selectedLead.id);

      if (updateError) throw new Error(updateError.message);

      setLeads((prev) =>
        prev.map((l) =>
          l.id === selectedLead.id ? { ...l, admin_note: adminNote } : l
        )
      );
      setSelectedLead({ ...selectedLead, admin_note: adminNote });

      toast({ title: "Note saved" });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save note";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: `${label} copied` });
  };

  const exportToCSV = () => {
    const headers = [
      "Date",
      "Name",
      "Phone",
      "Email",
      "Service",
      "Location",
      "Message",
      "Status",
      "Source",
      "Admin Note",
    ];

    const rows = filteredLeads.map((lead) => [
      format(new Date(lead.created_at), "yyyy-MM-dd HH:mm"),
      lead.name,
      lead.phone,
      lead.email || "",
      lead.service,
      lead.location,
      lead.message.replace(/"/g, '""'),
      lead.status,
      lead.source_page,
      lead.admin_note?.replace(/"/g, '""') || "",
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({ title: "Export complete" });
  };

  const openLeadDetails = (lead: Lead) => {
    setSelectedLead(lead);
    setAdminNote(lead.admin_note || "");
  };

  return (
    <AdminLayout title="Leads Inbox">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, phone, email, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {STATUS_OPTIONS.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Services</SelectItem>
              {uniqueServices.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={fetchLeads} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>

          <Button variant="outline" onClick={exportToCSV} disabled={filteredLeads.length === 0}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground mb-4">
        Showing {filteredLeads.length} of {leads.length} leads
      </p>

      <AdminDataState
        isLoading={loading}
        error={error}
        onRetry={fetchLeads}
        isEmpty={!loading && !error && leads.length === 0}
        emptyMessage="No leads yet. Leads will appear here when visitors submit inquiries."
      >
        {/* Leads Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLeads.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No leads match your filters
                  </TableCell>
                </TableRow>
              ) : (
                filteredLeads.map((lead) => (
                  <TableRow
                    key={lead.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openLeadDetails(lead)}
                  >
                    <TableCell className="whitespace-nowrap">
                      {format(new Date(lead.created_at), "MMM d, HH:mm")}
                    </TableCell>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.phone}</TableCell>
                    <TableCell>{lead.service}</TableCell>
                    <TableCell className="max-w-[150px] truncate">{lead.location}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={STATUS_COLORS[lead.status]}>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                        <a href={`tel:${lead.phone}`}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </a>
                        {lead.email && (
                          <a href={`mailto:${lead.email}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </AdminDataState>

      {/* Lead Details Sheet */}
      <Sheet open={!!selectedLead} onOpenChange={(open) => !open && setSelectedLead(null)}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          {selectedLead && (
            <>
              <SheetHeader>
                <SheetTitle className="font-heading">{selectedLead.name}</SheetTitle>
                <SheetDescription>
                  Lead from {selectedLead.source_page} •{" "}
                  {format(new Date(selectedLead.created_at), "PPpp")}
                </SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                {/* Contact Info */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Contact</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedLead.phone}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => copyToClipboard(selectedLead.phone, "Phone")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <a href={`tel:${selectedLead.phone}`}>
                          <Button size="sm">Call Now</Button>
                        </a>
                      </div>
                    </div>

                    {selectedLead.email && (
                      <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span>{selectedLead.email}</span>
                        </div>
                        <a href={`mailto:${selectedLead.email}`}>
                          <Button variant="outline" size="sm">
                            Email
                          </Button>
                        </a>
                      </div>
                    )}

                    <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedLead.location}</span>
                    </div>
                  </div>
                </div>

                {/* Service & Message */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Inquiry</h4>
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <Badge variant="secondary" className="mb-2">
                      {selectedLead.service}
                    </Badge>
                    <p className="text-sm whitespace-pre-wrap">{selectedLead.message}</p>
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Status</h4>
                  <Select
                    value={selectedLead.status}
                    onValueChange={(value) => handleStatusChange(selectedLead.id, value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_OPTIONS.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Admin Note */}
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground">Admin Note</h4>
                  <Textarea
                    value={adminNote}
                    onChange={(e) => setAdminNote(e.target.value)}
                    placeholder="Add internal notes about this lead..."
                    rows={4}
                  />
                  <Button
                    onClick={handleSaveNote}
                    disabled={saving || adminNote === (selectedLead.admin_note || "")}
                  >
                    {saving ? "Saving..." : "Save Note"}
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
