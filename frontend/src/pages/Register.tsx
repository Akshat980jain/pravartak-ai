import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    aadhaar: "",
    address: "",
    state: "",
    district: "",
    caste: "",
    firNumber: "",
    firDate: "",
    incidentDate: "",
    incidentLocation: "",
    compensationType: "",
    bankAccount: "",
    ifsc: "",
    bankName: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const applicationId = "DBT-PCR-" + Math.random().toString(36).substr(2, 9).toUpperCase();
    
    toast({
      title: "Application Submitted Successfully!",
      description: `Your application ID is: ${applicationId}. You will receive updates on your registered email and mobile number.`,
    });
    
    setTimeout(() => navigate("/track"), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Apply for Benefit</h1>
            <p className="text-sm opacity-90 mt-1">लाभ के लिए आवेदन करें</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="bg-yellow-50 border-l-4 border-[hsl(35,100%,50%)] p-4 mb-6">
            <p className="text-sm font-semibold">📌 Important: All fields marked with * are mandatory. Please ensure all information is accurate.</p>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Personal Information */}
            <Card className="mb-6">
              <CardHeader className="bg-primary/5">
                <CardTitle>Personal Information / व्यक्तिगत जानकारी</CardTitle>
                <CardDescription>Enter your basic details as per Aadhaar card</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name (as per Aadhaar) *</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="aadhaar">Aadhaar Number *</Label>
                    <Input
                      id="aadhaar"
                      required
                      value={formData.aadhaar}
                      onChange={(e) => setFormData({ ...formData, aadhaar: e.target.value })}
                      placeholder="12-digit Aadhaar number"
                      maxLength={12}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Mobile Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="10-digit mobile number"
                      maxLength={10}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="caste">Category *</Label>
                  <Select value={formData.caste} onValueChange={(value) => setFormData({ ...formData, caste: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sc">Scheduled Caste (SC)</SelectItem>
                      <SelectItem value="st">Scheduled Tribe (ST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Address Information */}
            <Card className="mb-6">
              <CardHeader className="bg-primary/5">
                <CardTitle>Address Information / पता जानकारी</CardTitle>
                <CardDescription>Provide your current residential address</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-2">
                  <Label htmlFor="address">Full Address *</Label>
                  <Textarea
                    id="address"
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="House no., street, village/city, pin code"
                    rows={3}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="tamilnadu">Tamil Nadu</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="up">Uttar Pradesh</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="district">District *</Label>
                    <Input
                      id="district"
                      required
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      placeholder="Enter district"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Incident Details */}
            <Card className="mb-6">
              <CardHeader className="bg-primary/5">
                <CardTitle>Incident Details / घटना विवरण</CardTitle>
                <CardDescription>Provide details about the atrocity/incident</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firNumber">FIR Number *</Label>
                    <Input
                      id="firNumber"
                      required
                      value={formData.firNumber}
                      onChange={(e) => setFormData({ ...formData, firNumber: e.target.value })}
                      placeholder="Enter FIR number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firDate">FIR Date *</Label>
                    <Input
                      id="firDate"
                      type="date"
                      required
                      value={formData.firDate}
                      onChange={(e) => setFormData({ ...formData, firDate: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="incidentDate">Date of Incident *</Label>
                    <Input
                      id="incidentDate"
                      type="date"
                      required
                      value={formData.incidentDate}
                      onChange={(e) => setFormData({ ...formData, incidentDate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="incidentLocation">Place of Incident *</Label>
                    <Input
                      id="incidentLocation"
                      required
                      value={formData.incidentLocation}
                      onChange={(e) => setFormData({ ...formData, incidentLocation: e.target.value })}
                      placeholder="Enter location"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="compensationType">Type of Compensation *</Label>
                  <Select value={formData.compensationType} onValueChange={(value) => setFormData({ ...formData, compensationType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate-relief">Immediate Relief (within 3 days)</SelectItem>
                      <SelectItem value="full-compensation">Full Compensation</SelectItem>
                      <SelectItem value="inter-caste-marriage">Inter-caste Marriage Incentive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Bank Details */}
            <Card className="mb-6">
              <CardHeader className="bg-primary/5">
                <CardTitle>Bank Account Details / बैंक खाता विवरण</CardTitle>
                <CardDescription>For direct benefit transfer (Aadhaar-linked account required)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bankAccount">Bank Account Number *</Label>
                    <Input
                      id="bankAccount"
                      required
                      value={formData.bankAccount}
                      onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                      placeholder="Enter account number"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ifsc">IFSC Code *</Label>
                    <Input
                      id="ifsc"
                      required
                      value={formData.ifsc}
                      onChange={(e) => setFormData({ ...formData, ifsc: e.target.value })}
                      placeholder="Enter IFSC code"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankName">Bank Name *</Label>
                  <Input
                    id="bankName"
                    required
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="Enter bank name"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Document Upload */}
            <Card className="mb-6">
              <CardHeader className="bg-primary/5">
                <CardTitle>Document Upload / दस्तावेज़ अपलोड</CardTitle>
                <CardDescription>Upload required documents (PDF, JPG, PNG - Max 5MB each)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-2 block">FIR Copy *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload FIR copy</p>
                      <Input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Aadhaar Card *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload Aadhaar card</p>
                      <Input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>

                  <div>
                    <Label className="mb-2 block">Caste Certificate *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Click to upload caste certificate</p>
                      <Input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Declaration */}
            <Card className="mb-6 border-primary/50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <input type="checkbox" id="declaration" required className="mt-1" />
                  <label htmlFor="declaration" className="text-sm">
                    <span className="font-semibold">Declaration:</span> I hereby declare that the information provided above is true and correct to the best of my knowledge. I understand that any false information may lead to rejection of my application and legal action.
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" size="lg" className="flex-1 bg-primary hover:bg-primary/90">
                <Save className="mr-2 h-5 w-5" />
                Submit Application / आवेदन जमा करें
              </Button>
              <Button type="button" size="lg" variant="outline" onClick={() => navigate("/")}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
