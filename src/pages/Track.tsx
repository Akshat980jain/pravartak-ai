import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, CheckCircle2, Clock, FileText, Banknote } from "lucide-react";
import { useState } from "react";

const Track = () => {
  const [applicationId, setApplicationId] = useState("");
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);
  };

  const statusSteps = [
    { label: "Application Received", date: "15 Jan 2025", completed: true, icon: FileText },
    { label: "Document Verification", date: "18 Jan 2025", completed: true, icon: CheckCircle2 },
    { label: "District Review", date: "22 Jan 2025", completed: true, icon: Clock },
    { label: "State Approval", date: "Pending", completed: false, icon: Clock },
    { label: "Fund Disbursement", date: "Pending", completed: false, icon: Banknote },
  ];

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Track Your Application</h1>
            <p className="text-muted-foreground">
              Enter your application ID to view the current status
            </p>
          </div>

          <Card className="shadow-medium mb-8">
            <CardHeader>
              <CardTitle>Search Application</CardTitle>
              <CardDescription>Enter your 14-digit application ID</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="DBT2025001234"
                    value={applicationId}
                    onChange={(e) => setApplicationId(e.target.value)}
                    className="text-lg"
                  />
                </div>
                <Button type="submit" className="gradient-primary hover:opacity-90 transition-smooth">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </form>
            </CardContent>
          </Card>

          {showResults && (
            <Card className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Application Status</CardTitle>
                    <CardDescription>ID: DBT2025001234</CardDescription>
                  </div>
                  <Badge className="bg-accent hover:bg-accent">In Progress</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {statusSteps.map((step, index) => (
                    <div key={index} className="relative">
                      <div className="flex items-start gap-4">
                        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? "bg-accent text-accent-foreground" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 pb-8">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold">{step.label}</h4>
                            <span className="text-sm text-muted-foreground">{step.date}</span>
                          </div>
                          {step.completed && (
                            <p className="text-sm text-muted-foreground mt-1">
                              Completed successfully
                            </p>
                          )}
                        </div>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`absolute left-5 top-10 w-0.5 h-12 ${
                          step.completed ? "bg-accent" : "bg-border"
                        }`} />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">Application Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Applicant:</span>
                      <span className="ml-2 font-medium">Rajesh Kumar</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Category:</span>
                      <span className="ml-2 font-medium">SC</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">District:</span>
                      <span className="ml-2 font-medium">Lucknow</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Benefit Amount:</span>
                      <span className="ml-2 font-medium">₹50,000</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Track;
