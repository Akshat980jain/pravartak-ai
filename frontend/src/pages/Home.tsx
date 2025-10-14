import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Home = () => {
  const highlights = [
    {
      title: "Victim support & immediate relief",
      titleHi: "त्वरित सहायता",
      description: "Immediate financial assistance and support for victims under PCR Acts"
    },
    {
      title: "Inter-caste marriage incentives",
      titleHi: "अंतर-जातीय विवाह प्रोत्साहन",
      description: "Financial incentives for inter-caste marriages promoting social harmony"
    },
    {
      title: "Transparent DBT with real-time tracking",
      titleHi: "पारदर्शी डीबीटी",
      description: "Direct benefit transfer to bank accounts with complete transparency"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-primary/5 to-primary/10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Direct Benefit Transfer Portal for Effective Implementation of PCR & PoA Acts
            </h1>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto">
              पीड़ित मुआवजा अधिनियम एवं अत्याचार निवारण अधिनियम के प्रभावी कार्यान्वयन के लिए प्रत्यक्ष लाभ हस्तांतरण पोर्टल
            </p>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <Card className="bg-gradient-to-br from-primary/5 to-accent/10 border-none p-12">
              <h2 className="text-4xl font-bold mb-6">Justice. Dignity. Empowerment.</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Messages on justice, empowerment, and inter-caste harmony. / न्याय, सशक्तिकरण और अंतर-जातीय सद्भाव पर संदेश।
              </p>
              
              <h3 className="text-2xl font-bold mb-6">Highlights</h3>
              <div className="space-y-4">
                {highlights.map((item, index) => (
                  <Card key={index} className="p-6 hover:shadow-lg transition-shadow bg-white">
                    <div className="flex items-start gap-4">
                      <CheckCircle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">
                          {item.title} / {item.titleHi}
                        </h4>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-4 mt-8">
                <Link to="/register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Register Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/track">
                  <Button size="lg" variant="outline" className="border-2 border-[hsl(35,100%,50%)] text-[hsl(35,100%,50%)] hover:bg-[hsl(35,100%,50%)] hover:text-white">
                    Track Application
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </section>

        {/* Quick Access Cards */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Services</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <Link to="/register">
                <Card className="p-8 hover:shadow-xl transition-all hover:scale-105 h-full">
                  <div className="text-5xl mb-4">📝</div>
                  <h3 className="text-xl font-bold mb-3">New Application</h3>
                  <p className="text-muted-foreground mb-4">
                    Apply for benefits under PCR & PoA Acts with easy online process
                  </p>
                  <p className="text-sm font-semibold text-primary">नया आवेदन →</p>
                </Card>
              </Link>

              <Link to="/track">
                <Card className="p-8 hover:shadow-xl transition-all hover:scale-105 h-full">
                  <div className="text-5xl mb-4">🔍</div>
                  <h3 className="text-xl font-bold mb-3">Track Status</h3>
                  <p className="text-muted-foreground mb-4">
                    Monitor your application status in real-time with complete transparency
                  </p>
                  <p className="text-sm font-semibold text-primary">स्थिति जांचें →</p>
                </Card>
              </Link>

              <Link to="/reports">
                <Card className="p-8 hover:shadow-xl transition-all hover:scale-105 h-full">
                  <div className="text-5xl mb-4">📊</div>
                  <h3 className="text-xl font-bold mb-3">View Reports</h3>
                  <p className="text-muted-foreground mb-4">
                    Access detailed reports and analytics on benefit distribution
                  </p>
                  <p className="text-sm font-semibold text-primary">रिपोर्ट देखें →</p>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Important Information */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-8 border-l-4 border-primary">
                <h3 className="text-2xl font-bold mb-4">📋 Eligibility Criteria</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Victim of atrocity under SC/ST PoA Act</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Valid FIR registered under applicable sections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Aadhaar-linked bank account for DBT</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>Complete documentation as per guidelines</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8 border-l-4 border-[hsl(35,100%,50%)]">
                <h3 className="text-2xl font-bold mb-4">⏱️ Processing Timeline</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Immediate Relief</p>
                    <p className="text-sm text-muted-foreground">Within 3 days of FIR registration</p>
                  </div>
                  <div>
                    <p className="font-semibold">Full Compensation</p>
                    <p className="text-sm text-muted-foreground">Within 60 days of chargesheet filing</p>
                  </div>
                  <div>
                    <p className="font-semibold">Application Review</p>
                    <p className="text-sm text-muted-foreground">15-30 days for verification</p>
                  </div>
                  <div>
                    <p className="font-semibold">DBT Transfer</p>
                    <p className="text-sm text-muted-foreground">5-7 days after approval</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
