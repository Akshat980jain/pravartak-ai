import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowRight, Users, FileText, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
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
      
      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Key Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Comprehensive DBT management platform with advanced features for all stakeholders
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover:shadow-medium transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Role-Based Access</CardTitle>
                <CardDescription>
                  Secure access control for different user types with appropriate permissions
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-medium transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Application Management</CardTitle>
                <CardDescription>
                  Streamlined process for application submission, verification, and approval
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="text-center hover:shadow-medium transition-smooth">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Real-time Tracking</CardTitle>
                <CardDescription>
                  Live status updates and comprehensive tracking of all DBT transactions
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users already benefiting from our secure DBT platform
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <Button size="lg" className="gradient-primary hover:opacity-90 transition-smooth">
                  Create Account
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/50 py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <Shield className="w-8 h-8 text-primary" />
              <div>
                <div className="font-bold">DBT Implementation Portal</div>
                <div className="text-sm text-muted-foreground">Ministry of Social Justice & Empowerment</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2025 DBT Implementation Portal. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
      
      <AccessibilityToolbar />
    </div>
  );
};

export default Index;
