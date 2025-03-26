
import { useState } from 'react';
import { useRevealAnimation } from '../utils/animations';
import { ContactFormData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { Check, Mail, Phone } from 'lucide-react';

const ContactSection = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredContact: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const headerReveal = useRevealAnimation();
  const formReveal = useRevealAnimation();
  const infoReveal = useRevealAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, preferredContact: e.target.value as 'email' | 'phone' }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real application, this would connect to a backend API
      console.log('Contact form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message sent!",
        description: "We'll get back to you shortly.",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        preferredContact: 'email'
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-coalo-cream/20">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Get in Touch</h2>
          <p className="section-subtitle">
            Have questions about our services? Reach out and our team will get back to you promptly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <div 
            ref={formReveal.ref}
            className={`transition-all duration-700 delay-300 ${formReveal.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-sm border border-coalo-sand/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-coalo-stone mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-coalo-sand/30 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-coalo-stone mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 rounded-md border border-coalo-sand/30 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                    placeholder="+27 123 456 7890"
                  />
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="email" className="block text-sm font-medium text-coalo-stone mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 rounded-md border border-coalo-sand/30 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                  placeholder="johndoe@example.com"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-coalo-stone mb-1">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full px-4 py-2 rounded-md border border-coalo-sand/30 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50 resize-none"
                  placeholder="Tell us about your advertising needs..."
                />
              </div>
              
              <div className="mb-6">
                <p className="block text-sm font-medium text-coalo-stone mb-2">
                  Preferred Contact Method
                </p>
                <div className="flex space-x-6">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={handleRadioChange}
                      className="w-4 h-4 text-coalo-moss"
                    />
                    <span className="ml-2 text-coalo-stone">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={handleRadioChange}
                      className="w-4 h-4 text-coalo-moss"
                    />
                    <span className="ml-2 text-coalo-stone">Phone</span>
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary w-full flex justify-center items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </div>
          
          <div 
            ref={infoReveal.ref}
            className={`transition-all duration-700 delay-500 ${infoReveal.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            <div className="bg-white p-8 rounded-xl shadow-sm border border-coalo-sand/10 mb-8">
              <h3 className="text-xl font-semibold text-coalo-stone mb-6">Contact Information</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="bg-coalo-sand/20 p-3 rounded-full mr-4">
                    <Mail className="w-5 h-5 text-coalo-clay" />
                  </div>
                  <div>
                    <h4 className="text-coalo-stone font-medium mb-1">Email Us</h4>
                    <a href="mailto:info@coalo.co.za" className="text-coalo-moss hover:underline">info@coalo.co.za</a>
                    <p className="text-sm text-coalo-stone/70 mt-1">We respond within 24 hours</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-coalo-sand/20 p-3 rounded-full mr-4">
                    <Phone className="w-5 h-5 text-coalo-clay" />
                  </div>
                  <div>
                    <h4 className="text-coalo-stone font-medium mb-1">Call Us</h4>
                    <a href="tel:+27720311487" className="text-coalo-moss hover:underline">+27 72 031 1487</a>
                    <p className="text-sm text-coalo-stone/70 mt-1">Mon-Fri from 9AM to 5PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-coalo-sand/10">
              <h3 className="text-xl font-semibold text-coalo-stone mb-6">Why Choose Coalō?</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    <Check className="w-5 h-5 text-coalo-moss" />
                  </div>
                  <p className="text-coalo-stone/80">Strategic billboard placement in high-traffic urban areas</p>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    <Check className="w-5 h-5 text-coalo-moss" />
                  </div>
                  <p className="text-coalo-stone/80">AI-driven targeting for maximum audience engagement</p>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    <Check className="w-5 h-5 text-coalo-moss" />
                  </div>
                  <p className="text-coalo-stone/80">Transparent pricing with no hidden fees</p>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    <Check className="w-5 h-5 text-coalo-moss" />
                  </div>
                  <p className="text-coalo-stone/80">Real-time performance tracking and detailed analytics</p>
                </div>
                
                <div className="flex items-start">
                  <div className="mt-1 mr-3">
                    <Check className="w-5 h-5 text-coalo-moss" />
                  </div>
                  <p className="text-coalo-stone/80">Dedicated support team committed to your success</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
