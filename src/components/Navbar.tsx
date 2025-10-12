import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 rounded-lg gradient-primary">
              <Shield className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-foreground group-hover:text-primary transition-smooth">
                DBT Portal
              </span>
              <span className="text-xs text-muted-foreground">PCR & PoA Acts</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Home
            </Link>
            <Link to="/apply" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Apply
            </Link>
            <Link to="/track" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Track Status
            </Link>
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth">
              Dashboard
            </Link>
            <Button variant="default" size="sm" className="gradient-primary hover:opacity-90 transition-smooth">
              Login
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-smooth"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <Link 
                to="/" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/apply" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Apply
              </Link>
              <Link 
                to="/track" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Track Status
              </Link>
              <Link 
                to="/dashboard" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Button variant="default" size="sm" className="gradient-primary hover:opacity-90 transition-smooth">
                Login
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
