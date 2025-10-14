import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

const Grievance = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formType, setFormType] = useState<"grievance" | "feedback">("grievance");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    applicationId: "",
    category: "",
    subject: "",
    description: "",
    rating: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const ticketId = "TKT" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    toast({
      title: formType === "grievance" ? "Grievance Submitted Successfully!" : "Feedback Submitted Successfully!",
      description: `Your ${formType} ticket ID is: ${ticketId}. We'll respond within 48 hours.`,
    });
    
    setTimeout(() => navigate("/"), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity mb-4">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
          <h1 className="text-3xl font-bold">Grievance & Feedback</h1>
          <p className="text-sm text-primary-foreground/90">Submit your concerns or feedback</p>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Form Type Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Select Type</CardTitle>
            <CardDescription>Choose whether you want to submit a grievance or feedback</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={formType} onValueChange={(value) => setFormType(value as "grievance" | "feedback")}>
              <div className="grid md:grid-cols-2 gap-4">
                <div className={`relative flex items-center space-x-2 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                  formType === "grievance" ? "border-primary bg-primary/5" : "border-muted"
                }`}>
                  <RadioGroupItem value="grievance" id="grievance" />
                  <Label htmlFor="grievance" className="cursor-pointer flex-1">
                    <div className="font-semibold">Grievance</div>
                    <div className="text-sm text-muted-foreground">Report an issue or complaint</div>
                  </Label>
                </div>
                <div className={`relative flex items-center space-x-2 rounded-lg border-2 p-4 cursor-pointer transition-all ${
                  formType === "feedback" ? "border-primary bg-primary/5" : "border-muted"
                }`}>
                  <RadioGroupItem value="feedback" id="feedback" />
                  <Label htmlFor="feedback" className="cursor-pointer flex-1">
                    <div className="font-semibold">Feedback</div>
                    <div className="text-sm text-muted-foreground">Share your suggestions</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Personal Information */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>So we can reach you with updates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationId">Application ID (if any)</Label>
                  <Input
                    id="applicationId"
                    value={formData.applicationId}
                    onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
                    placeholder="e.g., APP5K7M2N9P"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Grievance/Feedback Details */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{formType === "grievance" ? "Grievance Details" : "Feedback Details"}</CardTitle>
              <CardDescription>
                {formType === "grievance" 
                  ? "Provide details about your issue" 
                  : "Share your experience and suggestions"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {formType === "grievance" ? (
                      <>
                        <SelectItem value="application-delay">Application Delay</SelectItem>
                        <SelectItem value="payment-issue">Payment Issue</SelectItem>
                        <SelectItem value="document-verification">Document Verification</SelectItem>
                        <SelectItem value="technical-issue">Technical Issue</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="user-experience">User Experience</SelectItem>
                        <SelectItem value="feature-request">Feature Request</SelectItem>
                        <SelectItem value="general-feedback">General Feedback</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {formType === "feedback" && (
                <div className="space-y-2">
                  <Label>Overall Rating *</Label>
                  <RadioGroup value={formData.rating} onValueChange={(value) => setFormData({ ...formData, rating: value })}>
                    <div className="flex gap-4">
                      {["⭐", "⭐⭐", "⭐⭐⭐", "⭐⭐⭐⭐", "⭐⭐⭐⭐⭐"].map((stars, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <RadioGroupItem value={String(index + 1)} id={`rating-${index + 1}`} />
                          <Label htmlFor={`rating-${index + 1}`} className="cursor-pointer">
                            {stars}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Brief subject line"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={formType === "grievance" 
                    ? "Provide detailed description of your issue..." 
                    : "Share your feedback in detail..."}
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit" size="lg" className="flex-1">
              <Send className="mr-2 h-5 w-5" />
              Submit {formType === "grievance" ? "Grievance" : "Feedback"}
            </Button>
            <Button type="button" size="lg" variant="outline" onClick={() => navigate("/")}>
              Cancel
            </Button>
          </div>
        </form>

        {/* Help Information */}
        <Card className="mt-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              <CardTitle>Need Immediate Help?</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                For urgent matters, please contact us directly:
              </p>
              <div className="space-y-1">
                <p className="text-sm">📞 Helpline: 1800-XXX-XXXX (Toll-free)</p>
                <p className="text-sm">📧 Email: grievance@dbt-pcr.gov.in</p>
                <p className="text-sm">🕐 Response Time: Within 48 hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Grievance;
