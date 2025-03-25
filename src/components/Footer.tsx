
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-coalo-stone py-12 text-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">Coalō</h3>
            <p className="text-white/80 mb-6">
              Nurturing brands and uniting communities through innovative digital outdoor advertising.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white/70 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-white/80 hover:text-white transition-colors">Home</a>
              </li>
              <li>
                <a href="#about" className="text-white/80 hover:text-white transition-colors">Who Are We</a>
              </li>
              <li>
                <a href="#pricing" className="text-white/80 hover:text-white transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#services" className="text-white/80 hover:text-white transition-colors">Services</a>
              </li>
              <li>
                <a href="#work" className="text-white/80 hover:text-white transition-colors">Previous Work</a>
              </li>
              <li>
                <a href="#contact" className="text-white/80 hover:text-white transition-colors">Contact</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
            <ul className="space-y-2">
              <li className="text-white/80">
                123 Sandton Drive
              </li>
              <li className="text-white/80">
                Johannesburg, South Africa
              </li>
              <li className="text-white/80">
                <a href="mailto:info@coalo.co.za" className="hover:text-white transition-colors">info@coalo.co.za</a>
              </li>
              <li className="text-white/80">
                <a href="tel:+27123456789" className="hover:text-white transition-colors">+27 12 345 6789</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Business Hours</h4>
            <ul className="space-y-2">
              <li className="text-white/80">
                <span className="font-medium text-white">Monday-Friday:</span> 9AM - 5PM
              </li>
              <li className="text-white/80">
                <span className="font-medium text-white">Saturday:</span> 10AM - 2PM
              </li>
              <li className="text-white/80">
                <span className="font-medium text-white">Sunday:</span> Closed
              </li>
            </ul>
            <div className="mt-6">
              <a href="#quote" className="bg-white text-coalo-stone px-4 py-2 rounded-md hover:bg-white/90 transition-colors">
                Get a Quote
              </a>
            </div>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/20 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/70 text-sm mb-4 md:mb-0">
            © {currentYear} Coalō. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-white/70 text-sm hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-white/70 text-sm hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-white/70 text-sm hover:text-white transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
