import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, Upload } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const Apply = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Application Submitted",
        description: "Your application has been received. Application ID: DBT2025001234",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4 border border-primary/20">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium">Beneficiary Application</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Apply for Benefits</h1>
            <p className="text-muted-foreground">
              Fill in the details below to submit your application under PCR & PoA Acts
            </p>
          </div>

          <Card className="shadow-medium">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Please provide accurate information for verification</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input id="fullName" placeholder="Enter your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                    <Input id="aadhaar" placeholder="XXXX-XXXX-XXXX" maxLength={12} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mobile">Mobile Number *</Label>
                    <Input id="mobile" type="tel" placeholder="+91 XXXXX-XXXXX" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="your.email@example.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Applicant Category *</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sc">Scheduled Caste</SelectItem>
                      <SelectItem value="st">Scheduled Tribe</SelectItem>
                      <SelectItem value="pcr">PCR Act Victim</SelectItem>
                      <SelectItem value="poa">PoA Act Victim</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Complete Address *</Label>
                  <Textarea id="address" placeholder="Enter your complete address" rows={3} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input id="district" placeholder="Enter district" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="up">Uttar Pradesh</SelectItem>
                        <SelectItem value="mh">Maharashtra</SelectItem>
                        <SelectItem value="br">Bihar</SelectItem>
                        <SelectItem value="mp">Madhya Pradesh</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="incident">Incident Description *</Label>
                  <Textarea 
                    id="incident" 
                    placeholder="Briefly describe the incident and nature of atrocity/discrimination" 
                    rows={4} 
                    required 
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documents">Supporting Documents</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-smooth cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      FIR copy, medical reports, witness statements (Max 10MB)
                    </p>
                    <Input id="documents" type="file" multiple className="hidden" />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="gradient-primary hover:opacity-90 transition-smooth flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                  <Button type="button" variant="outline" className="flex-1">
                    Save as Draft
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Apply;
