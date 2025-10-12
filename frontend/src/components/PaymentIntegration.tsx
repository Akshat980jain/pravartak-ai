import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DollarSign, CreditCard, Banknote, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "sonner";

interface PaymentData {
  id: string;
  beneficiaryName: string;
  applicationId: string;
  amount: number;
  bankAccount: string;
  ifscCode: string;
  status: "pending" | "processing" | "completed" | "failed";
  date: string;
  remarks?: string;
}

const PaymentIntegration = () => {
  const [payments, setPayments] = useState<PaymentData[]>([
    {
      id: "PAY001",
      beneficiaryName: "Rajesh Kumar",
      applicationId: "DBT2025001234",
      amount: 50000,
      bankAccount: "1234567890",
      ifscCode: "SBIN0001234",
      status: "pending",
      date: "2025-01-15",
    },
    {
      id: "PAY002",
      beneficiaryName: "Meera Devi",
      applicationId: "DBT2025001235",
      amount: 75000,
      bankAccount: "9876543210",
      ifscCode: "HDFC0005678",
      status: "completed",
      date: "2025-01-14",
    },
    {
      id: "PAY003",
      beneficiaryName: "Suresh Yadav",
      applicationId: "DBT2025001236",
      amount: 60000,
      bankAccount: "5555666677",
      ifscCode: "ICIC0009999",
      status: "processing",
      date: "2025-01-13",
    },
  ]);

  const [selectedPayment, setSelectedPayment] = useState<PaymentData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "processing":
        return <Clock className="w-4 h-4 text-blue-500" />;
      case "failed":
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const handleProcessPayment = async (paymentId: string) => {
    setIsProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setPayments(prev => prev.map(payment => 
        payment.id === paymentId 
          ? { ...payment, status: "processing" as const }
          : payment
      ));
      
      toast.success("Payment processing initiated");
      
      // Simulate completion after another delay
      setTimeout(() => {
        setPayments(prev => prev.map(payment => 
          payment.id === paymentId 
            ? { ...payment, status: "completed" as const }
            : payment
        ));
        toast.success("Payment completed successfully");
      }, 3000);
      
    } catch (error) {
      toast.error("Payment processing failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBulkDisbursement = async () => {
    setIsProcessing(true);
    try {
      const pendingPayments = payments.filter(p => p.status === "pending");
      
      for (const payment of pendingPayments) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setPayments(prev => prev.map(p => 
          p.id === payment.id 
            ? { ...p, status: "processing" as const }
            : p
        ));
      }
      
      toast.success(`Processing ${pendingPayments.length} payments`);
      
      // Simulate completion
      setTimeout(() => {
        setPayments(prev => prev.map(payment => 
          payment.status === "processing" 
            ? { ...payment, status: "completed" as const }
            : payment
        ));
        toast.success("Bulk disbursement completed");
      }, 5000);
      
    } catch (error) {
      toast.error("Bulk disbursement failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const pendingAmount = payments
    .filter(p => p.status === "pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{payments.length}</div>
            <p className="text-xs text-muted-foreground">All transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <Banknote className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === "pending").length}
            </div>
            <p className="text-xs text-muted-foreground">₹{pendingAmount.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {payments.filter(p => p.status === "completed").length}
            </div>
            <p className="text-xs text-muted-foreground">Success rate: 95%</p>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button 
          onClick={handleBulkDisbursement}
          disabled={isProcessing || payments.filter(p => p.status === "pending").length === 0}
          className="flex items-center gap-2"
        >
          <CreditCard className="w-4 h-4" />
          {isProcessing ? "Processing..." : "Bulk Disbursement"}
        </Button>
        
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              Add Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Payment</DialogTitle>
              <DialogDescription>
                Create a new payment disbursement record
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="beneficiary">Beneficiary Name</Label>
                  <Input id="beneficiary" placeholder="Enter name" />
                </div>
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input id="amount" type="number" placeholder="Enter amount" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="account">Bank Account</Label>
                  <Input id="account" placeholder="Account number" />
                </div>
                <div>
                  <Label htmlFor="ifsc">IFSC Code</Label>
                  <Input id="ifsc" placeholder="IFSC code" />
                </div>
              </div>
              <div>
                <Label htmlFor="remarks">Remarks</Label>
                <Textarea id="remarks" placeholder="Payment remarks" />
              </div>
              <Button className="w-full">Add Payment</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payments List */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Disbursements</CardTitle>
          <CardDescription>Manage fund disbursements to beneficiaries</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-smooth">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(payment.status)}
                    <div>
                      <div className="font-semibold">{payment.beneficiaryName}</div>
                      <div className="text-sm text-muted-foreground">
                        {payment.applicationId} • {payment.bankAccount} • {payment.ifscCode}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-medium">₹{payment.amount.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">{payment.date}</div>
                  </div>
                  <Badge className={getStatusColor(payment.status)}>
                    {payment.status}
                  </Badge>
                  {payment.status === "pending" && (
                    <Button 
                      size="sm" 
                      onClick={() => handleProcessPayment(payment.id)}
                      disabled={isProcessing}
                    >
                      Process
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentIntegration;
