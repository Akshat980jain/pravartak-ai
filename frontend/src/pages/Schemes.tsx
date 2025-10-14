import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BenefitDistribution from "@/components/BenefitDistribution";

const Schemes = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Schemes & Guidelines</h1>
            <p className="text-sm opacity-90 mt-1">योजनाएं और दिशानिर्देश</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <Card className="mb-6">
            <CardHeader className="bg-primary/5">
              <CardTitle>PCR & PoA Acts Overview</CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <p>
                The Prevention of Atrocities (PoA) Act and Protection of Civil Rights (PCR) Act are crucial legislations
                aimed at preventing atrocities against Scheduled Castes and Scheduled Tribes and ensuring their rights.
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    SC/ST PoA Act, 1989
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Provides for prevention of atrocities against members of SC/ST communities
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    PCR Act, 1955
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Ensures protection of civil rights and prevention of untouchability
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader className="bg-primary/5">
              <CardTitle>Compensation Guidelines</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Immediate Relief</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Financial assistance provided within 3 days of FIR registration
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">Amount: ₹ 50,000 to ₹ 2,00,000 based on nature of atrocity</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Full Compensation</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Complete financial assistance after chargesheet filing
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">Amount: Up to ₹ 8,25,000 based on severity</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Inter-caste Marriage Incentive</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Financial incentive for inter-caste marriages
                  </p>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm">Amount: ₹ 2,50,000</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <BenefitDistribution />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Schemes;
