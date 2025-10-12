import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 px-4 overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Government Badge */}
          <div className="gov-badge mb-6">
            <Shield className="w-4 h-4" />
            <span>Government of India Initiative</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Direct Benefit Transfer Portal
            <span className="block text-primary mt-2">PCR & PoA Acts Implementation</span>
          </h1>

          {/* Description */}
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Ministry of Social Justice & Empowerment presents a secure, AI-powered platform for 
            seamless benefit disbursement to victims under the Protection of Civil Rights Act, 1955 
            and SC/ST (Prevention of Atrocities) Act, 1989.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/apply">
              <Button size="lg" className="gradient-primary hover:opacity-90 transition-smooth shadow-medium group">
                Apply for Benefits
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-smooth" />
              </Button>
            </Link>
            <Link to="/track">
              <Button size="lg" variant="outline" className="border-2 hover:bg-primary/5 transition-smooth">
                Track Application Status
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg bg-card border border-border shadow-card hover:shadow-medium transition-smooth">
              <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center mb-4 mx-auto">
                <Lock className="w-7 h-7 text-primary-foreground" />
              </div>
              <h3 className="font-semibold text-base mb-2">Secure Verification</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                AI-powered identity verification with Aadhaar & DigiLocker integration
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border shadow-card hover:shadow-medium transition-smooth">
              <div className="w-14 h-14 rounded-full gradient-secondary flex items-center justify-center mb-4 mx-auto">
                <Zap className="w-7 h-7 text-secondary-foreground" />
              </div>
              <h3 className="font-semibold text-base mb-2">Real-time Tracking</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Track your application from submission to benefit disbursement
              </p>
            </div>

            <div className="p-6 rounded-lg bg-card border border-border shadow-card hover:shadow-medium transition-smooth">
              <div className="w-14 h-14 rounded-full bg-accent flex items-center justify-center mb-4 mx-auto">
                <Shield className="w-7 h-7 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-base mb-2">Full Transparency</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Immutable blockchain records ensuring accountability
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
