import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Smartphone, CreditCard } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const Login = () => {
  const [mobileNumber, setMobileNumber] = useState("");
  const [aadhaar, setAadhaar] = useState("");

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
                  />
                </div>
                <Button className="w-full gradient-primary hover:opacity-90 transition-smooth">
                  Send OTP
                </Button>
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
                  />
                </div>
                <Button className="w-full gradient-primary hover:opacity-90 transition-smooth">
                  Verify Aadhaar
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-6 pt-6 border-t border-border">
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
