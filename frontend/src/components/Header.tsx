import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Shield } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getButtonClass = (path: string) => {
    return isActive(path) 
      ? "rounded-none border-b-2 border-primary font-semibold"
      : "rounded-none hover:border-b-2 hover:border-primary";
  };

  return (
    <header>
      {/* Top Bar with Ministry Info */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 100 100" className="text-primary">
                {/* Hexagonal outline */}
                <polygon 
                  points="50,10 85,30 85,70 50,90 15,70 15,30" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                />
                {/* Bar chart bars */}
                <rect x="25" y="60" width="8" height="20" fill="currentColor" />
                <rect x="38" y="50" width="8" height="30" fill="currentColor" />
                <rect x="51" y="40" width="8" height="40" fill="currentColor" />
                {/* Upward arrow */}
                <path 
                  d="M20,75 Q50,45 80,35" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="3" 
                  strokeLinecap="round"
                />
                <polygon 
                  points="75,30 80,35 75,40 70,35" 
                  fill="currentColor"
                />
                {/* Decorative ribbons */}
                <path 
                  d="M30,85 Q40,80 50,85 Q60,80 70,85" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                />
                <path 
                  d="M25,90 Q35,85 45,90 Q55,85 65,90" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold">
                SMARTRELIEF
              </h1>
              <p className="text-sm opacity-90">Direct Benefit Transfer Portal</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <Link to={
                user?.role === 'beneficiary' ? '/beneficiary-dashboard' :
                user?.role === 'district_officer' ? '/district-dashboard' :
                user?.role === 'admin' ? '/admin-dashboard' : '/login'
              }>
                <Button variant="outline" size="sm" className="bg-white text-primary hover:bg-gray-100">
                  <Shield className="mr-2 h-4 w-4" />
                  {user?.role === 'beneficiary' ? 'My Dashboard' :
                   user?.role === 'district_officer' ? 'Officer Dashboard' :
                   user?.role === 'admin' ? 'Admin Dashboard' : 'Dashboard'}
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="sm" className="bg-white text-primary hover:bg-gray-100">
                  <Shield className="mr-2 h-4 w-4" />
                  Login / Sign Up
                </Button>
              </Link>
            )}
            <Button variant="outline" size="sm" className="bg-white text-primary hover:bg-gray-100">
              <Globe className="mr-2 h-4 w-4" />
              EN | HI
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" className={getButtonClass("/")}>
                Home
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="ghost" className={getButtonClass("/register")}>
                Apply for Benefit
              </Button>
            </Link>
            <Link to="/track">
              <Button variant="ghost" className={getButtonClass("/track")}>
                Track Application
              </Button>
            </Link>
            <Link to="/schemes">
              <Button variant="ghost" className={getButtonClass("/schemes")}>
                Schemes & Guidelines
              </Button>
            </Link>
            <Link to="/grievance">
              <Button variant="ghost" className={getButtonClass("/grievance")}>
                Grievance
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" className={getButtonClass("/contact")}>
                Contact
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
