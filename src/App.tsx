
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Videos from "./pages/Videos";
import Tutorials from "./pages/Tutorials";
import Patents from "./pages/Patents";
import Contact from "./pages/Contact";
import Dashboard from "./pages/admin/Dashboard";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminTutorials from "./pages/admin/AdminTutorials";
import AdminPatents from "./pages/admin/AdminPatents";
import AdminSettings from "./pages/admin/AdminSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Main Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/patents" element={<Patents />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<Dashboard />} />
          <Route path="/admin/videos" element={<AdminVideos />} />
          <Route path="/admin/tutorials" element={<AdminTutorials />} />
          <Route path="/admin/patents" element={<AdminPatents />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
