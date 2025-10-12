import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import AccessibilityToolbar from "@/components/AccessibilityToolbar";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <StatsSection />
      <AccessibilityToolbar />
    </div>
  );
};

export default Index;
