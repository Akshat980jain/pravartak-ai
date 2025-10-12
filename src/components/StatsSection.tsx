import { Users, CheckCircle, IndianRupee, TrendingUp } from "lucide-react";

const stats = [
  {
    icon: Users,
    value: "2.5M+",
    label: "Beneficiaries Registered",
    color: "text-primary"
  },
  {
    icon: CheckCircle,
    value: "1.8M+",
    label: "Applications Processed",
    color: "text-accent"
  },
  {
    icon: IndianRupee,
    value: "₹850Cr+",
    label: "Benefits Disbursed",
    color: "text-secondary"
  },
  {
    icon: TrendingUp,
    value: "98.5%",
    label: "Success Rate",
    color: "text-accent"
  }
];

const StatsSection = () => {
  return (
    <section className="py-16 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-card rounded-xl shadow-soft hover:shadow-medium transition-smooth"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4`}>
                <stat.icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
