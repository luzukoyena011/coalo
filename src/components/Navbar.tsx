
import { useState, useEffect } from 'react';
import { NavItem } from '../types';
import { Menu, X } from 'lucide-react';

const navItems: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Who Are We', href: '#about' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'Previous Work', href: '#work' },
  { label: 'Get in Touch', href: '#contact' },
];

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scrolling
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3 glass shadow-sm' : 'py-5 bg-transparent'
      }`}
    >
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <a href="#home" className="flex items-center">
          <span className="text-2xl font-bold text-coalo-earth">Coalō</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
          <a 
            href="#quote" 
            className="btn-primary"
          >
            Get a Quote
          </a>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-coalo-stone focus:outline-none"
          aria-label="Menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass px-4 py-4 shadow-md animate-fade-in">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <a 
                key={item.href} 
                href={item.href} 
                className="text-coalo-stone hover:text-coalo-clay py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <a 
              href="#quote" 
              className="btn-primary w-full text-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Get a Quote
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
