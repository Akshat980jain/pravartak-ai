import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Shield, Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ROLE_CONFIGS } from "@/types/auth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

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
            {isAuthenticated && (
              <Link to="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-smooth">
                Dashboard
              </Link>
            )}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {user?.name}
                    <Badge variant="outline" className="ml-2">
                      {user && ROLE_CONFIGS[user.role].icon}
                    </Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/register">
                  <Button variant="outline" className="text-blue-600 border-blue-600 hover:bg-blue-50">
                    Register
                  </Button>
                </Link>
                <Link to="/login">
                  <Button className="gradient-primary hover:opacity-90 transition-smooth">
                    Login
                  </Button>
                </Link>
              </div>
            )}
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
              {isAuthenticated && (
                <Link 
                  to="/dashboard" 
                  className="text-sm font-medium text-foreground hover:text-primary transition-smooth py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {isAuthenticated ? (
                <div className="pt-2 border-t border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm font-medium">{user?.name}</span>
                    <Badge variant="outline">
                      {user && ROLE_CONFIGS[user.role].icon}
                    </Badge>
                  </div>
                  <Button 
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-2 border-t border-border space-y-2">
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full text-blue-600 border-blue-600 hover:bg-blue-50">
                      Register
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full gradient-primary hover:opacity-90 transition-smooth">
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
