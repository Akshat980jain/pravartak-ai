import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, TrendingUp, CheckCircle } from "lucide-react";

const StatsSection = () => {
  const stats = [
    {
      title: "Total Beneficiaries",
      value: "2.5M+",
      description: "Active beneficiaries across India",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Applications Processed",
      value: "15.2M+",
      description: "Successfully processed applications",
      icon: FileText,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Amount Disbursed",
      value: "₹45.2Cr",
      description: "Total benefits distributed this year",
      icon: TrendingUp,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Success Rate",
      value: "98.7%",
      description: "Application approval rate",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Platform Statistics</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our impact in numbers - delivering transparent and efficient benefit distribution across India
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="text-center hover:shadow-medium transition-smooth border-border/50">
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                    <IconComponent className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <CardTitle className="text-2xl font-bold">{stat.value}</CardTitle>
                  <CardDescription className="font-medium">{stat.title}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-800 px-4 py-2 rounded-full text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Trusted by Government of India
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
