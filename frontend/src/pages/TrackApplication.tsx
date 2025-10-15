import { useEffect, useState } from "react";
import { Search, CheckCircle, Clock, FileText, AlertCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const TrackApplication = () => {
  const [applicationId, setApplicationId] = useState("");
  const [showStatus, setShowStatus] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [serverData, setServerData] = useState<any | null>(null);

  const API_BASE = (import.meta as any)?.env?.VITE_API_BASE || "http://localhost:4000/api";

  const mockApplicationData = {
    id: "DBT-PCR-5K7M2N9P",
    applicantName: "John Doe",
    category: "SC",
    compensationType: "Immediate Relief",
    appliedDate: "2025-01-10",
    status: "Approved",
    amount: "₹ 50,000",
    timeline: [
      { 
        stage: "Application Submitted", 
        date: "2025-01-10 14:30", 
        completed: true, 
        description: "Application received successfully",
        icon: CheckCircle
      },
      { 
        stage: "Document Verification", 
        date: "2025-01-12 10:15", 
        completed: true, 
        description: "All documents verified",
        icon: CheckCircle
      },
      { 
        stage: "Under Review by District Officer", 
        date: "2025-01-14 09:00", 
        completed: true, 
        description: "Application under review",
        icon: CheckCircle
      },
      { 
        stage: "Approved", 
        date: "2025-01-16 11:30", 
        completed: true, 
        description: "Application approved by district officer",
        icon: CheckCircle
      },
      { 
        stage: "Fund Transferred", 
        date: "2025-01-18 15:45", 
        completed: true, 
        description: "DBT to bank account completed",
        icon: CreditCard
      }
    ]
  };

  useEffect(() => {
    // Load a few recent application IDs from backend so users can try clickable examples
    fetch(`${API_BASE}/applications`)
      .then(async (r) => (r.ok ? ((await r.json()) as any[]) : []))
      .then((rows) => setRecent(rows.slice(0, 5)))
      .catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!applicationId.trim()) return;
    setLoading(true);
    setError(null);
    setServerData(null);
    try {
      const res = await fetch(`${API_BASE}/applications/track/${encodeURIComponent(applicationId.trim())}`);
      if (res.status === 404) {
        setError("No application found for this ID.");
        setShowStatus(false);
      } else if (!res.ok) {
        setError(`Server error: ${res.status}`);
        setShowStatus(false);
      } else {
        const data = await res.json();
        let form = {} as any;
        try { form = data.data_json ? JSON.parse(data.data_json) : {}; } catch {}
        // Map backend data to view model
        // Determine timeline based on status
        const getTimelineFromStatus = (status: string) => {
          const baseTimeline = [
            { 
              stage: "Application Submitted", 
              date: data.created_at, 
              completed: true, 
              description: "Application received successfully",
              icon: CheckCircle
            },
            { 
              stage: "Document Verification", 
              date: data.status === 'submitted' ? "Pending" : data.updated_at, 
              completed: data.status !== 'submitted', 
              description: "All documents verified",
              icon: CheckCircle
            },
            { 
              stage: "Under Review by District Officer", 
              date: data.status === 'submitted' ? "Pending" : data.updated_at, 
              completed: data.status === 'approved' || data.status === 'disbursed', 
              description: "Application under review",
              icon: CheckCircle
            },
            { 
              stage: "Approved", 
              date: data.status === 'approved' || data.status === 'disbursed' ? data.updated_at : "Pending", 
              completed: data.status === 'approved' || data.status === 'disbursed', 
              description: "Application approved by district officer",
              icon: CheckCircle
            },
            { 
              stage: "Fund Transferred", 
              date: data.status === 'disbursed' ? data.updated_at : "Pending", 
              completed: data.status === 'disbursed', 
              description: "DBT to bank account completed",
              icon: CreditCard
            }
          ];
          return baseTimeline;
        };

        setServerData({
          id: data.tracking_id,
          applicantName: form.applicantName || "Applicant",
          category: form.category || "-",
          compensationType: form.compensationType || "-",
          appliedDate: form.appliedDate || data.created_at,
          status: data.status === 'submitted' ? 'Under Review' : 
                 data.status === 'approved' ? 'Approved' : 
                 data.status === 'disbursed' ? 'Fund Transferred' : 
                 data.status.replace('_', ' '),
          amount: form.amount ? `₹ ${Number(form.amount).toLocaleString('en-IN')}` : "-",
          timeline: getTimelineFromStatus(data.status),
        });
        setShowStatus(true);
      }
    } catch (e: any) {
      setError(e.message || "Network error");
      setShowStatus(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Track Application</h1>
            <p className="text-sm opacity-90 mt-1">आवेदन की स्थिति जांचें</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Search Card */}
          <Card className="mb-8 border-primary/30">
            <CardHeader className="bg-primary/5">
              <CardTitle>Enter Application Details / आवेदन विवरण दर्ज करें</CardTitle>
              <CardDescription>Track your DBT PCR application status in real-time</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <Label htmlFor="appId">Application ID / आवेदन संख्या</Label>
                  <Input
                    id="appId"
                    placeholder="Enter application ID (e.g., DBT-PCR-5K7M2N9P)"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    className="h-12"
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={handleSearch} size="lg" className="h-12 bg-primary hover:bg-primary/90" disabled={loading}>
                    <Search className="mr-2 h-5 w-5" />
                    {loading ? 'Searching...' : 'Track Status'}
                  </Button>
                </div>
              </div>
              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
            </CardContent>
          </Card>

          {/* Application Status */}
          {showStatus && (
            <>
              {/* Application Details */}
              <Card className="mb-6 border-l-4 border-primary">
                <CardHeader>
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <CardTitle className="text-2xl">Application Status / आवेदन स्थिति</CardTitle>
                      <CardDescription className="text-base mt-1">Application ID: {(serverData ?? mockApplicationData).id}</CardDescription>
                    </div>
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 text-base">
                      <Clock className="h-4 w-4 mr-2" />
                      {(serverData ?? mockApplicationData).status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Applicant Name</p>
                      <p className="font-semibold">{(serverData ?? mockApplicationData).applicantName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Category</p>
                      <p className="font-semibold">{(serverData ?? mockApplicationData).category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Applied Date</p>
                      <p className="font-semibold">{(serverData ?? mockApplicationData).appliedDate}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Compensation Amount</p>
                      <p className="font-semibold text-green-600">{(serverData ?? mockApplicationData).amount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Timeline */}
              <Card>
                <CardHeader className="bg-primary/5">
                  <CardTitle>Application Timeline / आवेदन प्रगति</CardTitle>
                  <CardDescription>Track the progress of your application step by step</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    {(serverData ?? mockApplicationData).timeline.map((stage: any, index: number) => {
                      const IconComponent = stage.icon || CheckCircle;
                      const isInProgress = !stage.completed && stage.date !== "Pending";
                      
                      return (
                        <div key={index} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            {stage.completed ? (
                              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                                <IconComponent className="h-7 w-7 text-white" />
                              </div>
                            ) : isInProgress ? (
                              <div className="w-12 h-12 rounded-full bg-yellow-500 flex items-center justify-center shadow-lg animate-pulse">
                                <Clock className="h-7 w-7 text-white" />
                              </div>
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                <IconComponent className="h-7 w-7 text-gray-400" />
                              </div>
                            )}
                            {index < (serverData ?? mockApplicationData).timeline.length - 1 && (
                              <div className={`w-0.5 h-16 ${stage.completed ? 'bg-green-500' : 'bg-gray-200'}`} />
                            )}
                          </div>
                          <div className="flex-1 pb-6">
                            <div className={`p-4 rounded-lg border ${
                              stage.completed ? 'bg-green-50 border-green-200' : 
                              isInProgress ? 'bg-yellow-50 border-yellow-200' : 
                              'bg-gray-50 border-gray-200'
                            }`}>
                              <h3 className="font-semibold text-lg mb-1">{stage.stage}</h3>
                              <p className="text-sm text-muted-foreground mb-2">{stage.description}</p>
                              <p className="text-sm font-semibold">
                                {stage.date === "Pending" ? "⏳ Awaiting previous step completion" : 
                                 isInProgress ? "🔄 Currently in progress" : 
                                 `✓ Completed on ${stage.date}`}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Contact Support */}
              <Card className="mt-6 border-l-4 border-[hsl(35,100%,50%)]">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="h-6 w-6 text-[hsl(35,100%,50%)] mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-2">Need Help? / सहायता चाहिए?</h3>
                      <p className="text-sm text-muted-foreground mb-3">
                        For any queries or issues regarding your application, please contact:
                      </p>
                      <div className="space-y-1 text-sm">
                        <p>📞 Toll-free Helpline: 1800-123-4567</p>
                        <p>📧 Email: dbt-pcr-support@gov.in</p>
                        <p>🕐 Working Hours: 9:00 AM - 6:00 PM (Mon-Fri)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {!showStatus && (
            <Card className="border-primary/30">
              <CardContent className="py-12 text-center">
                <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-semibold mb-2">Enter your Application ID to track status</h3>
                <p className="text-muted-foreground">
                  You can find your application ID in the confirmation email or SMS sent after submission
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default TrackApplication;
