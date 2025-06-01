
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SharedDataProvider } from "./context/SharedDataContext";
import ProtectedRoute from "./components/admin/ProtectedRoute";

import Index from "./pages/Index";
import Videos from "./pages/Videos";
import Tutorials from "./pages/Tutorials";
import Patents from "./pages/Patents";
import Contact from "./pages/Contact";
import Login from "./pages/Login";

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
      <BrowserRouter>
        <AuthProvider>
          <SharedDataProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Main Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/videos" element={<Videos />} />
              <Route path="/tutorials" element={<Tutorials />} />
              <Route path="/patents" element={<Patents />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              
              {/* Protected Admin Routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/videos" element={
                <ProtectedRoute>
                  <AdminVideos />
                </ProtectedRoute>
              } />
              <Route path="/admin/tutorials" element={
                <ProtectedRoute>
                  <AdminTutorials />
                </ProtectedRoute>
              } />
              <Route path="/admin/patents" element={
                <ProtectedRoute>
                  <AdminPatents />
                </ProtectedRoute>
              } />
              <Route path="/admin/settings" element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              } />
              
              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SharedDataProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
