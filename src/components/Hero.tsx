import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-5"></div>
      
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6 border border-primary/20">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Secure & Transparent DBT System</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            AI-Driven Smart DBT Management
            <span className="block text-primary mt-2">for PCR & PoA Acts</span>
          </h1>

          {/* Description */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Empowering victims and beneficiaries with seamless Direct Benefit Transfer.
            Track, verify, and receive benefits with complete transparency and security.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/apply">
              <Button size="lg" className="gradient-primary hover:opacity-90 transition-smooth shadow-medium group">
                Apply for Benefits
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
            </Link>
            <Link to="/track">
              <Button size="lg" variant="outline" className="border-2 hover:bg-muted transition-smooth">
                Track Application
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="p-6 rounded-xl bg-card shadow-soft hover:shadow-medium transition-smooth">
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 mx-auto">
                <Lock className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Secure Verification</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered identity verification with Aadhaar integration
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card shadow-soft hover:shadow-medium transition-smooth">
              <div className="w-12 h-12 rounded-lg gradient-secondary flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-time Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your application status at every stage
              </p>
            </div>

            <div className="p-6 rounded-xl bg-card shadow-soft hover:shadow-medium transition-smooth">
              <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Full Transparency</h3>
              <p className="text-sm text-muted-foreground">
                Blockchain-backed immutable transaction records
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
