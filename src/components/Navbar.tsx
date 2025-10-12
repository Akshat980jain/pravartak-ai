import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-card border-b border-border shadow-soft">
      <div className="h-1 gradient-gov"></div>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <Shield className="w-9 h-9 text-primary" strokeWidth={2} />
            <div className="flex flex-col">
              <span className="font-bold text-base leading-tight text-foreground">DBT Portal</span>
              <span className="text-[10px] text-muted-foreground leading-tight">Ministry of Social Justice & Empowerment</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              Home
            </Link>
            <Link to="/apply" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              Apply
            </Link>
            <Link to="/track" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              Track Status
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
              Dashboard
            </Link>
            <Link to="/login">
              <Button className="gradient-primary hover:opacity-90 transition-smooth">
                Login
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-3">
              <Link 
                to="/" 
                className="text-sm font-medium text-foreground hover:text-primary transition-smooth py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/apply" 
                className="text-sm font-medium text-foreground hover:text-primary transition-smooth py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Apply
              </Link>
              <Link 
                to="/track" 
                className="text-sm font-medium text-foreground hover:text-primary transition-smooth py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Status
              </Link>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-foreground hover:text-primary transition-smooth py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full gradient-primary hover:opacity-90 transition-smooth">
                  Login
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
