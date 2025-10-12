import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Plus, Search, Clock, CheckCircle, AlertCircle, User, Calendar, FileText } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface Grievance {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  submittedBy: string;
  submittedDate: string;
  assignedTo?: string;
  resolution?: string;
  resolvedDate?: string;
  applicationId?: string;
}

const GrievanceSystem = () => {
  const { user, hasPermission } = useAuth();
  const [grievances, setGrievances] = useState<Grievance[]>([
    {
      id: "GRV001",
      title: "Application Status Not Updated",
      description: "My application DBT2025001234 has been pending for over 2 weeks without any status update.",
      category: "Application Status",
      priority: "medium",
      status: "open",
      submittedBy: "Rajesh Kumar",
      submittedDate: "2025-01-15",
      applicationId: "DBT2025001234"
    },
    {
      id: "GRV002",
      title: "Payment Not Received",
      description: "I was approved for disability pension but haven't received the payment in my account.",
      category: "Payment Issues",
      priority: "high",
      status: "in_progress",
      submittedBy: "Meera Devi",
      submittedDate: "2025-01-14",
      assignedTo: "Financial Officer",
      applicationId: "DBT2025001235"
    },
    {
      id: "GRV003",
      title: "Document Verification Delay",
      description: "My documents were submitted 3 weeks ago but verification is still pending.",
      category: "Document Verification",
      priority: "medium",
      status: "resolved",
      submittedBy: "Suresh Yadav",
      submittedDate: "2025-01-10",
      assignedTo: "District Officer",
      resolution: "Documents verified and application forwarded to state level.",
      resolvedDate: "2025-01-16",
      applicationId: "DBT2025001236"
    }
  ]);

  const [newGrievance, setNewGrievance] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium" as const,
    applicationId: ""
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGrievance, setSelectedGrievance] = useState<Grievance | null>(null);
  const [resolution, setResolution] = useState("");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "bg-red-100 text-red-800";
      case "high":
        return "bg-orange-100 text-orange-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "resolved":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "in_progress":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "closed":
        return <FileText className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const handleSubmitGrievance = async () => {
    if (!newGrievance.title || !newGrievance.description || !newGrievance.category) {
      toast.error("Please fill in all required fields");
      return;
    }

    const grievance: Grievance = {
      id: `GRV${String(grievances.length + 1).padStart(3, '0')}`,
      ...newGrievance,
      status: "open",
      submittedBy: user?.name || "Anonymous",
      submittedDate: new Date().toISOString().split('T')[0]
    };

    setGrievances(prev => [grievance, ...prev]);
    setNewGrievance({
      title: "",
      description: "",
      category: "",
      priority: "medium",
      applicationId: ""
    });
    toast.success("Grievance submitted successfully!");
  };

  const handleResolveGrievance = async (grievanceId: string) => {
    if (!resolution.trim()) {
      toast.error("Please provide a resolution");
      return;
    }

    setGrievances(prev => prev.map(g => 
      g.id === grievanceId 
        ? { 
            ...g, 
            status: "resolved" as const,
            resolution,
            resolvedDate: new Date().toISOString().split('T')[0],
            assignedTo: user?.name || "System"
          }
        : g
    ));

    setResolution("");
    setSelectedGrievance(null);
    toast.success("Grievance resolved successfully!");
  };

  const handleAssignGrievance = async (grievanceId: string, assignedTo: string) => {
    setGrievances(prev => prev.map(g => 
      g.id === grievanceId 
        ? { ...g, status: "in_progress" as const, assignedTo }
        : g
    ));
    toast.success("Grievance assigned successfully!");
  };

  const filteredGrievances = grievances.filter(grievance =>
    grievance.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grievance.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grievance.submittedBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
    grievance.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: grievances.length,
    open: grievances.filter(g => g.status === "open").length,
    inProgress: grievances.filter(g => g.status === "in_progress").length,
    resolved: grievances.filter(g => g.status === "resolved").length
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Grievances</CardTitle>
            <MessageSquare className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All complaints</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Open</CardTitle>
            <AlertCircle className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.open}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
            <p className="text-xs text-muted-foreground">Being processed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.resolved}</div>
            <p className="text-xs text-muted-foreground">Successfully closed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">All Grievances</TabsTrigger>
          {hasPermission("apply") && <TabsTrigger value="submit">Submit Grievance</TabsTrigger>}
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Grievance Management</CardTitle>
              <CardDescription>Manage and resolve user complaints and issues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 mb-4">
                <div className="flex-1">
                  <Input
                    placeholder="Search grievances..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-4">
                {filteredGrievances.map((grievance) => (
                  <Card key={grievance.id} className="hover:shadow-medium transition-smooth">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{grievance.title}</h3>
                            <Badge className={getPriorityColor(grievance.priority)}>
                              {grievance.priority}
                            </Badge>
                            <Badge className={getStatusColor(grievance.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(grievance.status)}
                                {grievance.status.replace('_', ' ')}
                              </div>
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {grievance.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              {grievance.submittedBy}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {grievance.submittedDate}
                            </div>
                            {grievance.applicationId && (
                              <div className="flex items-center gap-1">
                                <FileText className="w-3 h-3" />
                                {grievance.applicationId}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedGrievance(grievance)}
                              >
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Grievance Details</DialogTitle>
                                <DialogDescription>
                                  Grievance ID: {grievance.id}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-sm font-medium">Title</Label>
                                  <p className="text-sm">{grievance.title}</p>
                                </div>
                                <div>
                                  <Label className="text-sm font-medium">Description</Label>
                                  <p className="text-sm">{grievance.description}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Category</Label>
                                    <p className="text-sm">{grievance.category}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Priority</Label>
                                    <Badge className={getPriorityColor(grievance.priority)}>
                                      {grievance.priority}
                                    </Badge>
                                  </div>
                                </div>
                                {grievance.assignedTo && (
                                  <div>
                                    <Label className="text-sm font-medium">Assigned To</Label>
                                    <p className="text-sm">{grievance.assignedTo}</p>
                                  </div>
                                )}
                                {grievance.resolution && (
                                  <div>
                                    <Label className="text-sm font-medium">Resolution</Label>
                                    <p className="text-sm">{grievance.resolution}</p>
                                  </div>
                                )}
                                {hasPermission("handle_complaints") && grievance.status !== "resolved" && (
                                  <div className="space-y-4">
                                    <div>
                                      <Label htmlFor="resolution">Resolution</Label>
                                      <Textarea
                                        id="resolution"
                                        value={resolution}
                                        onChange={(e) => setResolution(e.target.value)}
                                        placeholder="Enter resolution details..."
                                        rows={3}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      <Button 
                                        onClick={() => handleResolveGrievance(grievance.id)}
                                        size="sm"
                                      >
                                        Resolve
                                      </Button>
                                      <Button 
                                        variant="outline"
                                        onClick={() => handleAssignGrievance(grievance.id, user?.name || "Current User")}
                                        size="sm"
                                      >
                                        Assign to Me
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {hasPermission("apply") && (
          <TabsContent value="submit" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Submit New Grievance</CardTitle>
                <CardDescription>
                  Report any issues or complaints related to DBT services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={newGrievance.title}
                      onChange={(e) => setNewGrievance(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Brief description of the issue"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Category *</Label>
                    <Select onValueChange={(value) => setNewGrievance(prev => ({ ...prev, category: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Application Status">Application Status</SelectItem>
                        <SelectItem value="Payment Issues">Payment Issues</SelectItem>
                        <SelectItem value="Document Verification">Document Verification</SelectItem>
                        <SelectItem value="Technical Issues">Technical Issues</SelectItem>
                        <SelectItem value="General Inquiry">General Inquiry</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="applicationId">Application ID (if applicable)</Label>
                    <Input
                      id="applicationId"
                      value={newGrievance.applicationId}
                      onChange={(e) => setNewGrievance(prev => ({ ...prev, applicationId: e.target.value }))}
                      placeholder="Enter your application ID"
                    />
                  </div>

                  <div>
                    <Label htmlFor="priority">Priority</Label>
                    <Select onValueChange={(value: any) => setNewGrievance(prev => ({ ...prev, priority: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={newGrievance.description}
                      onChange={(e) => setNewGrievance(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Please provide detailed information about your issue..."
                      rows={4}
                    />
                  </div>

                  <Button onClick={handleSubmitGrievance} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Grievance
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default GrievanceSystem;
