import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ChatbotProvider, ChatbotWindow, ChatbotFAB } from "@/components/chatbot";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import Index from "./pages/Index";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import ProjectsGallery from "./pages/ProjectsGallery";
import CoverageAreas from "./pages/CoverageAreas";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

// Admin pages
import AdminLogin from "./pages/admin/Login";
import AdminSetup from "./pages/admin/Setup";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLeads from "./pages/admin/Leads";
import AdminContent from "./pages/admin/Content";
import AdminServices from "./pages/admin/Services";
import AdminGallery from "./pages/admin/Gallery";
import AdminMedia from "./pages/admin/Media";
import AdminSettings from "./pages/admin/Settings";
import AdminTeam from "./pages/admin/Team";
import AdminTestimonials from "./pages/admin/Testimonials";
import AdminStats from "./pages/admin/Stats";
import AdminHero from "./pages/admin/Hero";
import AdminPages from "./pages/admin/Pages";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ChatbotProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:slug" element={<ServiceDetail />} />
            <Route path="/projects-gallery" element={<ProjectsGallery />} />
            <Route path="/coverage-areas" element={<CoverageAreas />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/setup" element={<AdminSetup />} />
            <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
            <Route path="/admin/leads" element={<RequireAdmin><AdminLeads /></RequireAdmin>} />
            <Route path="/admin/content" element={<RequireAdmin><AdminContent /></RequireAdmin>} />
            <Route path="/admin/services" element={<RequireAdmin><AdminServices /></RequireAdmin>} />
            <Route path="/admin/gallery" element={<RequireAdmin><AdminGallery /></RequireAdmin>} />
            <Route path="/admin/media" element={<RequireAdmin><AdminMedia /></RequireAdmin>} />
            <Route path="/admin/settings" element={<RequireAdmin><AdminSettings /></RequireAdmin>} />
            <Route path="/admin/team" element={<RequireAdmin><AdminTeam /></RequireAdmin>} />
            <Route path="/admin/testimonials" element={<RequireAdmin><AdminTestimonials /></RequireAdmin>} />
            <Route path="/admin/stats" element={<RequireAdmin><AdminStats /></RequireAdmin>} />
            <Route path="/admin/hero" element={<RequireAdmin><AdminHero /></RequireAdmin>} />
            <Route path="/admin/pages" element={<RequireAdmin><AdminPages /></RequireAdmin>} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Global Chatbot */}
          <ChatbotWindow />
          <ChatbotFAB />
        </BrowserRouter>
      </ChatbotProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
