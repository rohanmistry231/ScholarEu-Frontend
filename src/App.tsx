
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Universities from "./pages/Universities";
import UniversityDetail from "./pages/UniversityDetail";
import Compare from "./pages/Compare";
import StudentConnect from "./pages/StudentConnect";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import ScholarshipsSection from "./pages/ScholarshipsSection";
import AddUniversityForm from "./pages/AddUniversityForm";
import AddStudentAmbassadorForm from "./pages/AddStudentAmbassadorForm";
import AddReviewForm from "./pages/AddReviewForm";
import AddScholarshipForm from "./pages/AddScholarshipForm";
import AdminPanel from "./pages/AdminPanel";
import AddNotificationForm from "./pages/AddNotificationForm";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/scholarships" element={<ScholarshipsSection />} />
          <Route path="/university/:id" element={<UniversityDetail />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/student-connect" element={<StudentConnect />} />
          <Route path="/about" element={<About />} />
          <Route path="/add-uni-form" element={<AddUniversityForm />} />
          <Route path="/add-student-form" element={<AddStudentAmbassadorForm />} />
          <Route path="/add-review-form" element={<AddReviewForm />} />
          <Route path="/add-scholarship-form" element={<AddScholarshipForm />} />
          <Route path="/add-notification-form" element={<AddNotificationForm />} />
          <Route path="/admin" element={<AdminPanel />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
