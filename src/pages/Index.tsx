
import { useEffect } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import AboutSection from '../components/AboutSection';
import PricingSection from '../components/PricingSection';
import ServiceOffering from '../components/ServiceOffering';
import WorkSection from '../components/WorkSection';
import CustomMapSection from '../components/CustomMapSection';
import ContactSection from '../components/ContactSection';
import QuoteSection from '../components/QuoteSection';
import Footer from '../components/Footer';

const Index = () => {
  // Scroll to specific section if URL has hash
  useEffect(() => {
    const hash = window.location.hash;
    if (hash) {
      // Give time for page to load
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 300);
    } else {
      // Scroll to top when first loading the page
      window.scrollTo(0, 0);
    }
  }, []);

  // Activate reveal animations on scroll
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right');
    revealElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      revealElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <AboutSection />
        <PricingSection />
        <ServiceOffering />
        <WorkSection />
        <CustomMapSection />
        <ContactSection />
        <QuoteSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
