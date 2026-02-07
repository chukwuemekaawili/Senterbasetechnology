import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminErrorBanner } from "@/components/admin/AdminDataState";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Inbox, 
  FileText, 
  Image, 
  FolderOpen, 
  ArrowRight,
  Phone,
  AlertCircle,
  RefreshCw,
  Loader2
} from "lucide-react";

interface DashboardStats {
  totalLeads: number;
  newLeads: number;
  contactedLeads: number;
  totalGalleryItems: number;
  totalMediaAssets: number;
}

interface Lead {
  id: string;
  status: string;
  created_at: string;
  name: string;
  phone: string;
  service: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalLeads: 0,
    newLeads: 0,
    contactedLeads: 0,
    totalGalleryItems: 0,
    totalMediaAssets: 0,
  });
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log("[AdminDashboard] Fetching stats...");
      
      // Fetch leads stats
      const { data: leads, error: leadsError } = await supabase
        .from("leads")
        .select("id, status, created_at, name, phone, service")
        .order("created_at", { ascending: false });

      if (leadsError) {
        console.error("[AdminDashboard] Leads fetch error:", leadsError);
        throw new Error(`Leads: ${leadsError.message}`);
      }

      const leadsData = leads || [];
      const newLeads = leadsData.filter(l => l.status === "new").length;
      const contactedLeads = leadsData.filter(l => l.status === "contacted").length;

      // Fetch gallery items count
      const { count: galleryCount, error: galleryError } = await supabase
        .from("gallery_items")
        .select("*", { count: "exact", head: true });

      if (galleryError) {
        console.error("[AdminDashboard] Gallery fetch error:", galleryError);
        throw new Error(`Gallery: ${galleryError.message}`);
      }

      // Fetch media assets count
      const { count: mediaCount, error: mediaError } = await supabase
        .from("media_assets")
        .select("*", { count: "exact", head: true });

      if (mediaError) {
        console.error("[AdminDashboard] Media fetch error:", mediaError);
        throw new Error(`Media: ${mediaError.message}`);
      }

      setStats({
        totalLeads: leadsData.length,
        newLeads,
        contactedLeads,
        totalGalleryItems: galleryCount || 0,
        totalMediaAssets: mediaCount || 0,
      });

      setRecentLeads(leadsData.slice(0, 5));
      console.log("[AdminDashboard] Stats loaded successfully");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch dashboard data";
      console.error("[AdminDashboard] Error:", message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const statCards = [
    {
      title: "New Leads",
      value: stats.newLeads,
      description: "Awaiting response",
      icon: AlertCircle,
      color: "text-secondary",
      href: "/admin/leads?status=new",
    },
    {
      title: "Total Leads",
      value: stats.totalLeads,
      description: "All time",
      icon: Inbox,
      color: "text-primary",
      href: "/admin/leads",
    },
    {
      title: "Gallery Items",
      value: stats.totalGalleryItems,
      description: "Published photos",
      icon: Image,
      color: "text-accent",
      href: "/admin/gallery",
    },
    {
      title: "Media Assets",
      value: stats.totalMediaAssets,
      description: "Uploaded files",
      icon: FolderOpen,
      color: "text-muted-foreground",
      href: "/admin/media",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      {error && <AdminErrorBanner error={error} onRetry={fetchStats} />}
      
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.title} to={stat.href}>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-heading font-bold">
                  {loading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    stat.value
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions & Recent Leads */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link to="/admin/leads">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Inbox className="h-4 w-4" />
                  View All Leads
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/admin/content">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Edit Page Content
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/admin/gallery">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Manage Gallery
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/admin/media">
              <Button variant="outline" className="w-full justify-between">
                <span className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4" />
                  Upload Media
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Leads */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Leads</CardTitle>
              <CardDescription>Latest inquiries</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={fetchStats} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : recentLeads.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No leads yet</p>
            ) : (
              <div className="space-y-3">
                {recentLeads.map((lead) => (
                  <div
                    key={lead.id}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="min-w-0">
                      <p className="font-medium truncate">{lead.name}</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {lead.service}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          lead.status === "new"
                            ? "bg-secondary/20 text-secondary"
                            : lead.status === "contacted"
                            ? "bg-primary/20 text-primary"
                            : "bg-accent/20 text-accent"
                        }`}
                      >
                        {lead.status}
                      </span>
                      <a href={`tel:${lead.phone}`}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Link to="/admin/leads" className="block mt-4">
              <Button variant="outline" className="w-full">
                View All Leads
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
