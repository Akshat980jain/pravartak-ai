const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8 mb-6">
          <div>
            <h3 className="font-bold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>About Ministry</li>
              <li>Schemes</li>
              <li>Downloads</li>
              <li>FAQ</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Important Links</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li>Government of India</li>
              <li>RTI</li>
              <li>Accessibility</li>
              <li>Privacy Policy</li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold mb-3">Contact Us</h3>
            <div className="space-y-2 text-sm opacity-90">
              <p>Ministry of Social Justice & Empowerment</p>
              <p>Shastri Bhawan, New Delhi - 110001</p>
              <p>Phone: 011-23381266</p>
              <p>Email: minister-sje@gov.in</p>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 pt-6 text-center text-sm">
          <p>© 2025 Ministry of Social Justice & Empowerment, Government of India. All rights reserved.</p>
          <p className="mt-2 opacity-75">Content owned and maintained by Ministry of Social Justice & Empowerment</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
