import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowRight, Users, FileText, TrendingUp, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-20 bg-gradient-to-br from-blue-50 via-white to-orange-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-20 h-20 bg-blue-600 rounded-full"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-orange-500 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-500 rounded-full"></div>
        <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-purple-500 rounded-full"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              Secure Government Portal
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Direct Benefit Transfer
              <span className="block text-blue-600">Implementation Portal</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Empowering transparent and efficient distribution of government benefits 
              through secure digital infrastructure. Join thousands of beneficiaries 
              across India.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/apply">
              <Button size="lg" className="gradient-primary hover:opacity-90 transition-smooth shadow-lg">
                Apply for Benefits
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/track">
              <Button size="lg" variant="outline" className="shadow-lg">
                Track Application
              </Button>
            </Link>
          </div>

          {/* Feature Highlights */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">Multi-Role Support</h3>
              <p className="text-sm text-gray-600">
                Administrators, officers, and beneficiaries all in one platform
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Tracking</h3>
              <p className="text-sm text-gray-600">
                Monitor your application status with live updates
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="font-semibold mb-2">Secure Processing</h3>
              <p className="text-sm text-gray-600">
                Bank-grade security for all transactions and data
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
