import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  Search, 
  Download, 
  FileText, 
  Bell, 
  Phone, 
  CheckCircle,
  ArrowRight,
  ExternalLink,
  Users,
  Clock,
  Shield,
  FileCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Schemes = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [schemeType, setSchemeType] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const schemes = [
    {
      id: 1,
      title: "Relief to Victims",
      titleHi: "पीड़ितों के लिए राहत",
      type: "PCR/PoA",
      typeColor: "bg-blue-100 text-blue-800",
      eligibility: "FIR registered under PCR/PoA Acts",
      amount: "₹50,000 financial assistance",
      timeline: "Expected approval within 15 days",
      documents: "FIR copy, ID proof, bank passbook",
      description: "Immediate financial assistance for victims of atrocities under PCR/PoA Acts"
    },
    {
      id: 2,
      title: "Inter-Caste Marriage Incentive",
      titleHi: "अंतर्जातीय विवाह प्रोत्साहन",
      type: "Incentive",
      typeColor: "bg-gray-100 text-gray-800",
      eligibility: "SC/ST individuals marrying outside caste",
      amount: "₹50,000 incentive",
      timeline: "Approval as per state process",
      documents: "Marriage certificate, ID, bank details",
      description: "Financial incentive to promote inter-caste marriages and social harmony"
    }
  ];

  const processSteps = [
    "Register & Fill Application (Beneficiary)",
    "Verification by District Officer (Officer)",
    "Sanction & Fund Disbursement via PFMS (System)"
  ];

  const flowchartSteps = [
    { en: "Beneficiary Registration", hi: "आवेदक पंजीकरण" },
    { en: "Real-Time Verification", hi: "धरित सत्त" },
    { en: "District Officer Review", hi: "रिता अधिकारी सगीधा" },
    { en: "Fund Disbursement", hi: "निधि विहाराण" },
    { en: "Grievance & Feedback", hi: "शिकायत और प्रतिक्रिया" }
  ];

  const updates = [
    {
      date: "12 Oct 2025",
      title: "Relief assistance increased to ₹50,000",
      type: "Circular"
    },
    {
      date: "05 Oct 2025", 
      title: "Inter-caste marriage incentive - revised documentation",
      type: "Update"
    },
    {
      date: "29 Sep 2025",
      title: "New district-level monitoring features for officers",
      type: "Notification"
    }
  ];

  const officers = [
    { name: "Aaditya Singh", location: "Lucknow, Uttar Pradesh" },
    { name: "Priya Sharma", location: "Pune, Maharashtra" },
    { name: "Deke Sharma", location: "Jaipur, Rajasthan" }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Page Header */}
        <div className="bg-primary text-primary-foreground py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold">Schemes & Guidelines - PCR/PoA DBT Portal</h1>
            <p className="text-lg opacity-90 mt-2">योजनाएं एवं दिशानिर्देश</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-6xl">
          {/* Search and Filter Section */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Search schemes / योजनाओं को खोजें
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search for schemes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Filter: Scheme Type
                    </label>
                    <Select value={schemeType} onValueChange={setSchemeType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select scheme type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pcr-poa">PCR/PoA Relief</SelectItem>
                        <SelectItem value="incentive">Inter-caste Marriage Incentive</SelectItem>
                        <SelectItem value="all">All Schemes</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      State / राज्य
                    </label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All States</SelectItem>
                        <SelectItem value="up">Uttar Pradesh</SelectItem>
                        <SelectItem value="mh">Maharashtra</SelectItem>
                        <SelectItem value="br">Bihar</SelectItem>
                        <SelectItem value="rj">Rajasthan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Button className="w-full md:w-auto">
                  Apply Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Available Schemes */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Available Schemes / उपलब्ध योजनाएं</h2>
            <div className="space-y-6">
              {schemes.map((scheme) => (
                <Card key={scheme.id} className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-xl">{scheme.title}</CardTitle>
                        <p className="text-gray-600">{scheme.titleHi}</p>
                      </div>
                      <Badge className={scheme.typeColor}>{scheme.type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Eligibility:</h4>
                        <p className="text-sm">{scheme.eligibility}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Amount:</h4>
                        <p className="text-sm font-semibold text-green-600">{scheme.amount}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Timeline:</h4>
                        <p className="text-sm">{scheme.timeline}</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-gray-700 mb-1">Documents:</h4>
                        <p className="text-sm">{scheme.documents}</p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-sm text-gray-700 mb-2">Required Documents (PDF)</h4>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-2" />
                          Download Checklist
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Fetch from Digilocker
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <Link to="/register">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          Apply Now
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                      <Button variant="outline">
                        <FileText className="mr-2 h-4 w-4" />
                        Read Guidelines
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Guidelines & Documentation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Guidelines & Documentation / दिशानिर्देश व दस्तावेज</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-3">Step-by-step Process / चरण-दर-चरण प्रक्रिया</h4>
                  <ol className="space-y-2">
                    {processSteps.map((step, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </span>
                        <span className="text-sm">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                
                <Button className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Download All Guidelines (PDF)
                </Button>
              </CardContent>
            </Card>

            {/* Application Flowchart */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Application Flowchart / कार्य-विधि</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {flowchartSteps.map((step, index) => (
                    <div key={index} className="flex flex-col items-center">
                      <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg w-full text-center">
                        <div className="font-semibold text-sm">{step.en}</div>
                        <div className="text-xs">{step.hi}</div>
                      </div>
                      {index < flowchartSteps.length - 1 && (
                        <div className="my-2">
                          <ArrowRight className="h-4 w-4 text-gray-400 rotate-90" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg">FAQ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-4 border-l-blue-500 pl-4">
                  <h4 className="font-semibold">How long does it take to process an application?</h4>
                  <p className="text-sm text-gray-600 mt-1">Applications are typically processed within 15 days of submission, depending on verification requirements.</p>
                </div>
                <div className="border-l-4 border-l-blue-500 pl-4">
                  <h4 className="font-semibold">What documents are required?</h4>
                  <p className="text-sm text-gray-600 mt-1">Required documents include FIR copy, valid ID proof, bank passbook, and relevant certificates based on the scheme.</p>
                </div>
                <div className="border-l-4 border-l-blue-500 pl-4">
                  <h4 className="font-semibold">How is the amount disbursed?</h4>
                  <p className="text-sm text-gray-600 mt-1">All payments are made through Direct Benefit Transfer (DBT) to the beneficiary's bank account linked with Aadhaar.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Scheme Updates */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Scheme Updates / अपडेट्स
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {updates.map((update, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                      {update.type}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{update.title}</div>
                      <div className="text-xs text-gray-500">{update.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Contact & Support */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Phone className="h-5 w-5" />
                Contact & Support / संपर्क व सहायता
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-3">District / State Officers</h4>
                <div className="space-y-2">
                  {officers.map((officer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{officer.name}</div>
                        <div className="text-sm text-gray-600">{officer.location}</div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Users className="h-4 w-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">Helpdesk / Grievance</h4>
                <div className="grid md:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start">
                    <Shield className="h-4 w-4 mr-2" />
                    Helpdesk Portal
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Submit Grievance
                  </Button>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Email Support</h4>
                <p className="text-sm text-blue-600">contact@dbt.gov</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Schemes;