import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1">
        <div className="bg-primary text-primary-foreground py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-3xl font-bold">Contact Us</h1>
            <p className="text-sm opacity-90 mt-1">हमसे संपर्क करें</p>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Phone Numbers
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <p className="font-semibold">Toll-free Helpline</p>
                  <p className="text-muted-foreground">1800-123-4567</p>
                </div>
                <div>
                  <p className="font-semibold">Office Contact</p>
                  <p className="text-muted-foreground">011-23381266</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Addresses
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <p className="font-semibold">General Queries</p>
                  <p className="text-muted-foreground">info@msje.gov.in</p>
                </div>
                <div>
                  <p className="font-semibold">DBT Support</p>
                  <p className="text-muted-foreground">dbt-pcr-support@gov.in</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Office Address
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <p className="font-semibold mb-2">Ministry of Social Justice & Empowerment</p>
                <p className="text-muted-foreground">
                  Shastri Bhawan<br />
                  Dr. Rajendra Prasad Road<br />
                  New Delhi - 110001<br />
                  India
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="bg-primary/5">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Working Hours
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-3">
                <div>
                  <p className="font-semibold">Office Hours</p>
                  <p className="text-muted-foreground">9:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p className="font-semibold">Working Days</p>
                  <p className="text-muted-foreground">Monday to Friday</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
