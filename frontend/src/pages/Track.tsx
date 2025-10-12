import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Search, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

const Track = () => {
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Mock data for demonstration
  const mockApplications = [
    {
      id: "DBT2025001234",
      name: "Rajesh Kumar",
      status: "Under Review",
      submittedDate: "2025-01-15",
      amount: "₹50,000",
      scheme: "Old Age Pension",
      lastUpdated: "2025-01-16",
    },
    {
      id: "DBT2025001235",
      name: "Meera Devi",
      status: "Approved",
      submittedDate: "2025-01-14",
      amount: "₹75,000",
      scheme: "Disability Pension",
      lastUpdated: "2025-01-16",
    },
    {
      id: "DBT2025001236",
      name: "Suresh Yadav",
      status: "Pending Verification",
      submittedDate: "2025-01-13",
      amount: "₹60,000",
      scheme: "Widow Pension",
      lastUpdated: "2025-01-15",
    },
  ];

  const handleSearch = async () => {
    if (!searchValue.trim()) {
      toast.error("Please enter an application ID or Aadhaar number");
      return;
    }

    setIsSearching(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Filter mock data based on search
      const results = mockApplications.filter(app => 
        app.id.toLowerCase().includes(searchValue.toLowerCase()) ||
        app.name.toLowerCase().includes(searchValue.toLowerCase())
      );
      
      setSearchResults(results);
      
      if (results.length === 0) {
        toast.info("No applications found with the given criteria");
      } else {
        toast.success(`Found ${results.length} application(s)`);
      }
    } catch (error) {
      toast.error("Search failed. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Approved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Under Review":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "Pending Verification":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      default:
        return <FileText className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Under Review":
        return "bg-blue-100 text-blue-800";
      case "Pending Verification":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Track Application Status</h1>
            <p className="text-muted-foreground">Monitor your DBT application progress in real-time</p>
          </div>

          {/* Search Section */}
          <Card className="shadow-card border-border/50 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Application
              </CardTitle>
              <CardDescription>
                Enter your application ID, Aadhaar number, or beneficiary name
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="search">Search Criteria</Label>
                  <div className="flex gap-2">
                    <Input
                      id="search"
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Enter application ID, Aadhaar number, or name"
                      className="flex-1"
                      onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                    />
                    <Button
                      onClick={handleSearch}
                      disabled={isSearching}
                      className="gradient-primary hover:opacity-90 transition-smooth"
                    >
                      {isSearching ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        "Search"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Search Results</h2>
              {searchResults.map((app) => (
                <Card key={app.id} className="shadow-card border-border/50 hover:shadow-medium transition-smooth">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{app.name}</h3>
                        <p className="text-sm text-muted-foreground">Application ID: {app.id}</p>
                      </div>
                      <Badge className={getStatusColor(app.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(app.status)}
                          {app.status}
                        </div>
                      </Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Scheme</p>
                        <p className="text-sm">{app.scheme}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Amount</p>
                        <p className="text-sm font-semibold">{app.amount}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Submitted Date</p>
                        <p className="text-sm">{app.submittedDate}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Last Updated</p>
                        <p className="text-sm">{app.lastUpdated}</p>
                      </div>
                    </div>

                    {/* Status Timeline */}
                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-3">Application Timeline</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500" />
                          <span>Application submitted on {app.submittedDate}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-blue-500" />
                          <span>Under review by district officer</span>
                        </div>
                        {app.status === "Approved" && (
                          <div className="flex items-center gap-2 text-sm">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>Application approved and funds disbursed</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Help Section */}
          <Card className="shadow-card border-border/50 mt-8">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
              <CardDescription>
                Having trouble finding your application? We're here to help.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Contact Support</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Call our helpline: 1800-XXX-XXXX
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Email: support@dbtportal.gov.in
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Common Issues</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Application ID not found</li>
                    <li>• Status not updating</li>
                    <li>• Document verification pending</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Track;
