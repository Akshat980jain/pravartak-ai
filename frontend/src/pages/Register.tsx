import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Upload, ArrowLeft, ShieldCheck, FileText, ClipboardList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getStatesList, getDistrictsList } from "@/lib/statesAndDistricts";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tab, setTab] = useState("step1");
  const [showSuccess, setShowSuccess] = useState(false);
  const [generatedId, setGeneratedId] = useState<string | null>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
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

  // File upload refs and state
  const firInputRef = useRef<HTMLInputElement>(null);
  const aadhaarInputRef = useRef<HTMLInputElement>(null);
  const casteInputRef = useRef<HTMLInputElement>(null);
  const [firFile, setFirFile] = useState<File | null>(null);
  const [aadhaarFile, setAadhaarFile] = useState<File | null>(null);
  const [casteFile, setCasteFile] = useState<File | null>(null);

  const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || "http://localhost:4000/api";

  async function fileToBase64(file: File | null): Promise<string | null> {
    if (!file) return null;
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Convert files to base64 strings for storage in data_json
      const [firB64, aadhaarB64, casteB64] = await Promise.all([
        fileToBase64(firFile),
        fileToBase64(aadhaarFile),
        fileToBase64(casteFile),
      ]);

      // Basic validation for required uploads
      if (!firB64 || !aadhaarB64 || !casteB64) {
        toast({ title: "Please upload all required documents", variant: "destructive" });
        setTab("step4");
        return;
      }

      const payload = {
        user: {
          name: formData.fullName,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
        },
        // For demo, use a default scheme id = 1
        schemeId: 1,
        data: {
          ...formData,
          documents: {
            firCopy: { name: firFile?.name, type: firFile?.type, size: firFile?.size, dataUrl: firB64 },
            aadhaarCard: { name: aadhaarFile?.name, type: aadhaarFile?.type, size: aadhaarFile?.size, dataUrl: aadhaarB64 },
            casteCertificate: { name: casteFile?.name, type: casteFile?.type, size: casteFile?.size, dataUrl: casteB64 },
          },
          submittedAt: new Date().toISOString(),
        },
      };

      const res = await fetch(`${API_BASE}/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Submit failed (${res.status})`);
      const created = await res.json();
      const applicationId = created?.tracking_id || "—";
      setGeneratedId(applicationId);
      setShowSuccess(true);
      setTab("step5");
    } catch (err: any) {
      toast({ title: "Submission failed", description: err?.message || "Unable to submit application", variant: "destructive" });
    }
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
              <form onSubmit={handleSubmit}>
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
                    <Label htmlFor="district">District *</Label>
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
                  <div onClick={() => firInputRef.current?.click()}>
                    <Label className="mb-2 block">FIR Copy *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{firFile ? firFile.name : "Click to upload FIR copy"}</p>
                      <Input ref={firInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setFirFile(e.target.files?.[0] ?? null)} />
                    </div>
                  </div>

                  <div onClick={() => aadhaarInputRef.current?.click()}>
                    <Label className="mb-2 block">Aadhaar Card *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{aadhaarFile ? aadhaarFile.name : "Click to upload Aadhaar card"}</p>
                      <Input ref={aadhaarInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setAadhaarFile(e.target.files?.[0] ?? null)} />
                    </div>
                  </div>

                  <div onClick={() => casteInputRef.current?.click()}>
                    <Label className="mb-2 block">Caste Certificate *</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{casteFile ? casteFile.name : "Click to upload caste certificate"}</p>
                      <Input ref={casteInputRef} type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setCasteFile(e.target.files?.[0] ?? null)} />
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
                        <Save className="mr-2 h-4 w-4" /> Submit
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              </form>
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
      {/* Success Modal */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Application Submitted Successfully</DialogTitle>
          </DialogHeader>
          <div className="space-y-4" ref={receiptRef}>
            <div className="rounded-lg border bg-background">
              <div className="p-4 border-b flex items-center gap-2">
                <div className="inline-flex items-center justify-center rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-medium">Success</div>
                <span className="font-medium">Your application has been received</span>
              </div>
              <div className="grid md:grid-cols-2 gap-3 p-4">
                <div className="p-3 rounded border bg-muted/50">
                  <div className="text-xs text-muted-foreground">Application ID</div>
                  <div className="font-semibold text-lg tracking-wider">{generatedId}</div>
                </div>
                <div className="p-3 rounded border bg-muted/50">
                  <div className="text-xs text-muted-foreground">Name</div>
                  <div className="font-semibold">{formData.fullName || '-'}</div>
                </div>
                <div className="p-3 rounded border bg-muted/50">
                  <div className="text-xs text-muted-foreground">Scheme Applied</div>
                  <div className="font-semibold">{formData.compensationType === 'immediate-relief' ? 'Victim Relief Assistance' : formData.compensationType === 'full-compensation' ? 'Victim Compensation' : formData.compensationType === 'inter-caste-marriage' ? 'Inter-caste Marriage Incentive' : '-'}</div>
                </div>
                <div className="p-3 rounded border bg-muted/50">
                  <div className="text-xs text-muted-foreground">Submission Date</div>
                  <div className="font-semibold">{new Date().toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })}</div>
                </div>
                <div className="md:col-span-2 p-3 rounded border bg-muted/50">
                  <div className="text-xs text-muted-foreground">Status</div>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-medium">
                    <span>Form Submitted</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => {
                try {
                  const w = window.open('', '_blank');
                  if (w && receiptRef.current) {
                    const html = `<html><head><title>Acknowledgment</title><style>body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:16px}</style></head><body>${receiptRef.current.innerHTML}</body></html>`;
                    w.document.write(html);
                    w.document.close();
                    w.focus();
                    w.print();
                  }
                } catch {}
              }}>Download Acknowledgment (PDF)</Button>
              <Button className="bg-primary" onClick={() => { setShowSuccess(false); navigate('/track'); }}>Track Application Status</Button>
              <Button variant="secondary" onClick={() => { setShowSuccess(false); navigate('/'); }}>Return to Home</Button>
            </div>
            <p className="text-xs text-muted-foreground">Please save your Application ID ({generatedId}) for all future references.</p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Register;
