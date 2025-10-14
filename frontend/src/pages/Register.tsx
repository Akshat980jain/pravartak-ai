import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Upload, ArrowLeft, ShieldCheck, FileText, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState("step1");
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

  const nextStep = () => {
    const order = ["step1", "step2", "step3", "step4", "step5"] as const;
    const i = order.indexOf(tab as any);
    if (i >= 0 && i < order.length - 1) setTab(order[i + 1]);
  };
  const prevStep = () => {
    const order = ["step1", "step2", "step3", "step4", "step5"] as const;
    const i = order.indexOf(tab as any);
    if (i > 0) setTab(order[i - 1]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Beneficiary Registration</h1>
            <p className="text-sm opacity-90 mt-1">Relief Assistance under PCR/PoA</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
            <div>
              <Tabs value={tab} onValueChange={setTab} className="mb-4">
                <TabsList className="grid grid-cols-5 w-full">
                  <TabsTrigger value="step1">1 Personal Details</TabsTrigger>
                  <TabsTrigger value="step2">2 Incident/Case</TabsTrigger>
                  <TabsTrigger value="step3">3 Bank Details</TabsTrigger>
                  <TabsTrigger value="step4">4 Uploads</TabsTrigger>
                  <TabsTrigger value="step5">5 Declaration</TabsTrigger>
                </TabsList>
                <TabsContent value="step1">
                  <Card className="mb-6">
                    <CardHeader className="bg-primary/5">
                      <CardTitle>Personal Details</CardTitle>
                      <CardDescription>Enter details as per Aadhaar</CardDescription>
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
                  {/* Address within Step 1 */}
                  <Card className="mb-6">
                    <CardHeader className="bg-primary/5">
                      <CardTitle>Address</CardTitle>
                      <CardDescription>Current residential address</CardDescription>
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
                  <div className="flex justify-between gap-3">
                    <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                      <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <div className="flex gap-3">
                      <Button type="button" variant="secondary">Save Draft</Button>
                      <Button type="button" onClick={nextStep}>Next</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="step2">
                  <Card className="mb-6">
                    <CardHeader className="bg-primary/5">
                      <CardTitle>Incident/Case Details</CardTitle>
                      <CardDescription>Provide details about the incident</CardDescription>
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
                  <div className="flex justify-between gap-3">
                    <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <div className="flex gap-3">
                      <Button type="button" variant="secondary">Save Draft</Button>
                      <Button type="button" onClick={nextStep}>Next</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="step3">
                  <Card className="mb-6">
                    <CardHeader className="bg-primary/5">
                      <CardTitle>Bank Details</CardTitle>
                      <CardDescription>Aadhaar-linked account for DBT</CardDescription>
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
                  <div className="flex justify-between gap-3">
                    <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <div className="flex gap-3">
                      <Button type="button" variant="secondary">Save Draft</Button>
                      <Button type="button" onClick={nextStep}>Next</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="step4">
                  <Card className="mb-6">
                    <CardHeader className="bg-primary/5">
                      <CardTitle>Document Uploads</CardTitle>
                      <CardDescription>PDF/JPG/PNG (Max 5MB each)</CardDescription>
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
                  <div className="flex justify-between gap-3">
                    <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <div className="flex gap-3">
                      <Button type="button" variant="secondary">Save Draft</Button>
                      <Button type="button" onClick={nextStep}>Next</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="step5">
                  <Card className="mb-6 border-primary/50">
                    <CardHeader className="bg-primary/5">
                      <CardTitle>Declaration</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-3">
                        <input type="checkbox" id="declaration" required className="mt-1" />
                        <label htmlFor="declaration" className="text-sm">
                          <span className="font-semibold">I hereby declare</span> that the information provided is true and I consent to eSign/OTP verification.
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="flex justify-between gap-3">
                    <Button type="button" variant="outline" onClick={prevStep}><ArrowLeft className="mr-2 h-4 w-4" /> Back</Button>
                    <div className="flex gap-3">
                      <Button type="button" variant="secondary">Save Draft</Button>
                      <Button type="submit" className="bg-primary hover:bg-primary/90">
                        <Save className="mr-2 h-4 w-4" /> Submit & Generate Application ID
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <aside className="space-y-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><ShieldCheck className="h-4 w-4" /> Guidelines</CardTitle>
                  <CardDescription>Keep Aadhaar, FIR, and bank details handy. Use DigiLocker for faster uploads.</CardDescription>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>NPCI verification ensures DBT to the correct account.</li>
                    <li>Only clear, readable documents are accepted.</li>
                    <li>Drafts auto-expire after 7 days.</li>
                  </ul>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><ClipboardList className="h-4 w-4" /> Step Summary</CardTitle>
                  <CardDescription>Current Step: Declaration</CardDescription>
                </CardHeader>
                <CardContent className="text-sm">
                  <div className="flex items-center justify-between py-1">
                    <span>Form Status</span>
                    <span className="text-yellow-600">In Progress</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span>Draft Saved</span>
                    <span>—</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2"><FileText className="h-4 w-4" /> Need Help?</CardTitle>
                  <CardDescription>Helpline: 1800-000-000 • Email: support@socialjustice.gov.in</CardDescription>
                </CardHeader>
              </Card>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Register;
