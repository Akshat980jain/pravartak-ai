import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, Shield, ArrowLeft, User, Building, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getStatesList, getDistrictsList } from "@/lib/statesAndDistricts";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState<"beneficiary" | "district_officer" | "admin" | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    state: "",
    district: "",
    aadhaar: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate("/dashboard");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) {
      toast({
        title: "Please select a role",
        description: "Choose your login type first",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);

    try {
      const success = await login(formData.username, formData.password, formData.district, selectedRole, formData.aadhaar, formData.phone);
      
      if (success) {
        toast({
          title: "Login Successful!",
          description: `Welcome to the ${selectedRole === 'beneficiary' ? 'Beneficiary' : selectedRole === 'district_officer' ? 'District Officer' : 'Admin'} Dashboard`,
        });

        // Redirect based on role
        let dashboardPath = "/dashboard";
        if (selectedRole === 'beneficiary') {
          dashboardPath = "/beneficiary-dashboard";
        } else if (selectedRole === 'district_officer') {
          dashboardPath = "/district-dashboard";
        } else if (selectedRole === 'admin') {
          dashboardPath = "/admin-dashboard";
        }

        const from = location.state?.from?.pathname || dashboardPath;
        navigate(from, { replace: true });
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Login Error",
        description: "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Login / Sign Up</CardTitle>
            <CardDescription>
              Choose your role and access the appropriate dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selection */}
            <div className="space-y-4 mb-6">
              <Label className="text-base font-medium">Select Your Role</Label>
              <div className="grid grid-cols-1 gap-3">
                <Button
                  type="button"
                  variant={selectedRole === "beneficiary" ? "default" : "outline"}
                  className="h-auto p-4 flex items-center gap-3"
                  onClick={() => setSelectedRole("beneficiary")}
                >
                  <User className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Beneficiary</div>
                    <div className="text-sm opacity-70">Track applications and benefits</div>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "district_officer" ? "default" : "outline"}
                  className="h-auto p-4 flex items-center gap-3"
                  onClick={() => setSelectedRole("district_officer")}
                >
                  <Building className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">District Officer</div>
                    <div className="text-sm opacity-70">Review and approve applications</div>
                  </div>
                </Button>
                <Button
                  type="button"
                  variant={selectedRole === "admin" ? "default" : "outline"}
                  className="h-auto p-4 flex items-center gap-3"
                  onClick={() => setSelectedRole("admin")}
                >
                  <Settings className="h-5 w-5" />
                  <div className="text-left">
                    <div className="font-medium">Admin</div>
                    <div className="text-sm opacity-70">System overview and management</div>
                  </div>
                </Button>
              </div>
            </div>

            {selectedRole && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {selectedRole === "beneficiary" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="aadhaar">Aadhaar Number</Label>
                      <Input
                        id="aadhaar"
                        name="aadhaar"
                        type="text"
                        placeholder="Enter your Aadhaar number"
                        value={formData.aadhaar}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </>
                )}

                {(selectedRole === "district_officer" || selectedRole === "admin") && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Enter your username"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter your password"
                          value={formData.password}
                          onChange={handleInputChange}
                          required
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">State</Label>
                      <Select 
                        value={formData.state} 
                        onValueChange={(value) => setFormData({ ...formData, state: value, district: "" })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {getStatesList().map((state) => (
                            <SelectItem key={state.value} value={state.value}>
                              {state.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="district">District</Label>
                      <Select
                        value={formData.district}
                        onValueChange={(value) => setFormData({ ...formData, district: value })}
                        disabled={!formData.state}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={formData.state ? "Select district" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {formData.state && getDistrictsList(formData.state).map((district) => (
                            <SelectItem key={district} value={district.toLowerCase().replace(/\s+/g, "-")}>
                              {district}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </>
                )}

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
