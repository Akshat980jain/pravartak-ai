import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Register from "./pages/Register";
import TrackApplication from "./pages/TrackApplication";
import Grievance from "./pages/Grievance";
import Contact from "./pages/Contact";
import Schemes from "./pages/Schemes";
import ReferenceViewer from "./pages/ReferenceViewer";
import Login from "./pages/Login";
import BeneficiaryDashboard from "./pages/BeneficiaryDashboard";
import DistrictDashboard from "./pages/DistrictDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import NyayBot from "@/components/NyayBot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track" element={<TrackApplication />} />
            <Route path="/grievance" element={<Grievance />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/schemes" element={<Schemes />} />
            <Route path="/reference" element={<ReferenceViewer />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/beneficiary-dashboard" 
              element={
                <ProtectedRoute>
                  <BeneficiaryDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/district-dashboard" 
              element={
                <ProtectedRoute>
                  <DistrictDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin-dashboard" 
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <NyayBot />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
