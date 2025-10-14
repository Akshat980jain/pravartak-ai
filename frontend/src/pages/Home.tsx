import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle, MapPin, BarChart2, Shield, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis } from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IndiaChoropleth from "@/components/IndiaChoropleth";

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
        {/* Hero card like image */}
        <section className="py-6">
          <div className="container mx-auto px-4">
              <div className="grid lg:grid-cols-2 gap-6 items-stretch">
              <div className="rounded overflow-hidden">
                <img
                  src="/Odisha-News.jpg"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/emblem-banner.jpg'; }}
                  alt="National Emblem Banner"
                  className="w-full h-full object-cover"
                />
              </div>
              <Card className="p-0 overflow-hidden">
                <div className="p-6 sm:p-8 space-y-3">
                  <h2 className="text-2xl sm:text-3xl font-bold">Justice. Dignity. Empowerment.</h2>
                  <p className="text-sm sm:text-base text-muted-foreground">
                    Messages on justice, empowerment, and inter-caste harmony. / न्याय, सशक्तिकरण और अंतर-जातीय सद्भाव पर संदेश।
                  </p>

                  <div className="mt-3 space-y-3">
                    {highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 rounded border bg-white px-3 py-3">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
                        <div className="text-sm">
                          {item.title} / <span className="text-muted-foreground">{item.titleHi}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-wrap gap-3 mt-5">
                    <Link to="/register">
                      <Button className="bg-primary hover:bg-primary/90">
                        Apply for Assistance
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                    <Link to="/track">
                      <Button variant="secondary">
                        <Search className="mr-2 h-4 w-4" /> Track Status
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Public Dashboard Snapshot */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Total Beneficiaries</div><div className="text-xl font-bold">12,45,320</div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Funds Disbursed</div><div className="text-xl font-bold">₹ 2,345 Cr</div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Pending Cases</div><div className="text-xl font-bold">18,240</div></CardContent></Card>
              <Card><CardContent className="p-4"><div className="text-xs text-muted-foreground">Active States/UTs</div><div className="text-xl font-bold">28 + UTs</div></CardContent></Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-4 mt-4">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><MapPin className="h-4 w-4" /> State-wise Fund Tracking</CardTitle></CardHeader>
                <CardContent className="p-4">
                  <div className="h-72 rounded bg-muted border overflow-hidden">
                    <IndiaChoropleth />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2"><BarChart2 className="h-4 w-4" /> Funds Trend (FY)</CardTitle></CardHeader>
                <CardContent className="p-4">
                  <ChartContainer config={{ funds: { label: 'Funds (Cr)', color: 'hsl(215 90% 57%)' } }} className="h-72">
                    <LineChart data={[{ m: 'Apr', v: 120 }, { m: 'May', v: 180 }, { m: 'Jun', v: 220 }, { m: 'Jul', v: 260 }, { m: 'Aug', v: 240 }, { m: 'Sep', v: 300 }]} margin={{ left: 12, right: 12, top: 8, bottom: 8 }}>
                      <XAxis dataKey="m" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="v" stroke="var(--color-funds)" strokeWidth={2} dot={false} name="funds" />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Schemes grid */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">Schemes</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { title: 'PCR Act - Victim Compensation', desc: 'Immediate relief, rehab & legal aid' },
                { title: 'PoA Act - Atrocities Relief', desc: 'Stage-wise assistance as per schedule' },
                { title: 'Inter-Caste Marriage Incentive', desc: 'One-time incentive, eligibility rules' },
                { title: 'Skill Development Support', desc: 'Training & employability for victims' },
                { title: 'Education Assistance', desc: 'Scholarships and tuition support' },
                { title: 'Livelihood Restoration', desc: 'Seed grants and micro–finance linkages' },
              ].map((s, i) => (
                <Card key={i} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{s.title}</div>
                      <div className="text-xs text-muted-foreground">{s.desc}</div>
                    </div>
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div className="mt-3">
                    <Link to="/register"><Button size="sm">Apply / Know More</Button></Link>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Updates bar */}
        <section className="py-6">
          <div className="container mx-auto px-4">
            <Card className="p-4">
              <div className="text-sm font-semibold mb-2">Updates</div>
              <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                <li>Revised relief amounts effective 01 Apr.</li>
                <li>Awareness drive on PoA rights across districts.</li>
                <li>Guidelines available in Hindi and regional languages.</li>
              </ul>
            </Card>
          </div>
        </section>
      
      </main>

      <Footer />
    </div>
  );
};

export default Home;
