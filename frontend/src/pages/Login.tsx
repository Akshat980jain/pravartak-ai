import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Smartphone, CreditCard, AlertCircle } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { UserRole, ROLE_CONFIGS } from "@/types/auth";
import { toast } from "sonner";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("victim_beneficiary");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    if (!mobileNumber.trim()) {
      toast.error("Please enter mobile number");
      return;
    }
    
    setIsLoading(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOtpSent(true);
      toast.success("OTP sent to your mobile number");
    } catch (error) {
      toast.error("Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!mobileNumber.trim()) {
      toast.error("Please enter mobile number");
      return;
    }
    
    if (otpSent && !otp.trim()) {
      toast.error("Please enter OTP");
      return;
    }

    setIsLoading(true);
    try {
      await login({
        mobile: mobileNumber,
        otp: otpSent ? otp : undefined,
        role: selectedRole,
      });
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAadhaarLogin = async () => {
    if (!aadhaar.trim()) {
      toast.error("Please enter Aadhaar number");
      return;
    }

    setIsLoading(true);
    try {
      await login({
        aadhaar: aadhaar,
        role: selectedRole,
      });
      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login failed. Please check your Aadhaar number.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Shield className="w-12 h-12 text-primary" strokeWidth={2} />
          </div>
          <h1 className="text-2xl font-bold mb-2">DBT Management Portal</h1>
          <p className="text-sm text-muted-foreground">Ministry of Social Justice & Empowerment</p>
          <div className="h-1 w-24 gradient-gov mx-auto mt-3"></div>
        </div>

        <Card className="shadow-large border-border/50">
          <CardHeader>
            <CardTitle>Secure Login</CardTitle>
            <CardDescription>Access your DBT account using OTP or Aadhaar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Label htmlFor="role">Select Role</Label>
                <Select value={selectedRole} onValueChange={(value: UserRole) => setSelectedRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ROLE_CONFIGS).map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <span>{role.icon}</span>
                          <div>
                            <div className="font-medium">{role.name}</div>
                            <div className="text-xs text-muted-foreground">{role.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Tabs defaultValue="otp" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="otp">
                  <Smartphone className="w-4 h-4 mr-2" />
                  OTP Login
                </TabsTrigger>
                <TabsTrigger value="aadhaar">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Aadhaar
                </TabsTrigger>
              </TabsList>

              <TabsContent value="otp" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number</Label>
                  <Input
                    id="mobile"
                    placeholder="+91 XXXXX-XXXXX"
                    type="tel"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {!otpSent ? (
                  <Button 
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    className="w-full gradient-primary hover:opacity-90 transition-smooth"
                  >
                    {isLoading ? "Sending..." : "Send OTP"}
                  </Button>
                ) : (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="otp">Enter OTP</Label>
                      <Input
                        id="otp"
                        placeholder="Enter 6-digit OTP"
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        disabled={isLoading}
                      />
                    </div>
                    <Button 
                      onClick={handleLogin}
                      disabled={isLoading}
                      className="w-full gradient-primary hover:opacity-90 transition-smooth"
                    >
                      {isLoading ? "Logging in..." : "Login"}
                    </Button>
                  </>
                )}
              </TabsContent>

              <TabsContent value="aadhaar" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aadhaar">Aadhaar Number</Label>
                  <Input
                    id="aadhaar"
                    placeholder="XXXX-XXXX-XXXX"
                    maxLength={12}
                    value={aadhaar}
                    onChange={(e) => setAadhaar(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                <Button 
                  onClick={handleAadhaarLogin}
                  disabled={isLoading}
                  className="w-full gradient-primary hover:opacity-90 transition-smooth"
                >
                  {isLoading ? "Verifying..." : "Verify Aadhaar"}
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border">
              <div className="bg-muted/50 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-secondary" />
                  <span className="text-sm font-medium">Demo Credentials</span>
                </div>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p><strong>Victim/Beneficiary:</strong> 9876543210</p>
                  <p><strong>District Officer:</strong> 9876543211</p>
                  <p><strong>State Officer:</strong> 9876543212</p>
                  <p><strong>Financial Officer:</strong> 9876543213</p>
                  <p><strong>Central Admin:</strong> 9876543214</p>
                </div>
              </div>
              <p className="text-sm text-center text-muted-foreground">
                New user?{" "}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Register here
                </Link>
              </p>
            </div>

            <div className="mt-4 text-center">
              <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-smooth">
                ← Back to Home
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>Protected by Government of India</p>
          <p className="mt-1">© 2025 Ministry of Social Justice & Empowerment</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
