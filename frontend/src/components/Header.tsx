import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

const Header = () => {
  return (
    <header>
      {/* Top Bar with Ministry Info */}
      <div className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white rounded flex items-center justify-center">
              <div className="text-primary text-2xl font-bold">🇮🇳</div>
            </div>
            <div>
              <h1 className="text-lg font-bold">
                Ministry of Social Justice & Empowerment, Government of India
              </h1>
              <p className="text-sm opacity-90">सामाजिक न्याय एवं अधिकारिता मंत्रालय, भारत सरकार</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="bg-white text-primary hover:bg-gray-100">
            <Globe className="mr-2 h-4 w-4" />
            EN | HI
          </Button>
        </div>
      </div>

      {/* Navigation Bar */}
      <nav className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" className="rounded-none border-b-2 border-primary font-semibold">
                Home
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="ghost" className="rounded-none hover:border-b-2 hover:border-primary">
                Apply for Benefit
              </Button>
            </Link>
            <Link to="/track">
              <Button variant="ghost" className="rounded-none hover:border-b-2 hover:border-primary">
                Track Application
              </Button>
            </Link>
            <Link to="/schemes">
              <Button variant="ghost" className="rounded-none hover:border-b-2 hover:border-primary">
                Schemes & Guidelines
              </Button>
            </Link>
            <Link to="/grievance">
              <Button variant="ghost" className="rounded-none hover:border-b-2 hover:border-primary">
                Grievance
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="ghost" className="rounded-none hover:border-b-2 hover:border-primary">
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
