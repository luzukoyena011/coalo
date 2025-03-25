
import { useState } from 'react';
import { Mail, Phone, CheckCircle } from 'lucide-react';
import { useRevealAnimation } from '../utils/animations';
import { useToast } from "@/hooks/use-toast";
import { ContactFormData } from '../types';

const ContactSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredContact: 'email'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Contact request received",
        description: "We'll get back to you as soon as possible.",
      });

      // Reset form after a delay
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          phone: '',
          email: '',
          message: '',
          preferredContact: 'email'
        });
      }, 3000);
    }, 1500);
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
            Have questions or ready to start? Contact us today and let's discuss how we can help your brand grow.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div 
            ref={formReveal.ref} 
            className={`transition-all duration-700 delay-300 ${formReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            {isSuccess ? (
              <div className="bg-white p-8 rounded-xl shadow-md border border-coalo-moss/20 flex flex-col items-center justify-center text-center h-full">
                <div className="w-16 h-16 bg-coalo-moss/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-coalo-moss" />
                </div>
                <h3 className="text-xl font-semibold text-coalo-stone mb-2">Message Received!</h3>
                <p className="text-coalo-stone/80">
                  Thank you for reaching out. A member of our team will contact you shortly via your preferred method.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md border border-coalo-sand/20">
                <h3 className="text-xl font-semibold text-coalo-stone mb-6">Send us a message</h3>
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-coalo-stone mb-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-md border border-coalo-sand/50 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                      placeholder="Your name"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-coalo-stone mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-md border border-coalo-sand/50 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                      placeholder="your@email.com"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-coalo-stone mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 rounded-md border border-coalo-sand/50 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                      placeholder="Your phone number"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-coalo-stone mb-1">Message</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={4}
                      className="w-full px-4 py-2.5 rounded-md border border-coalo-sand/50 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                      placeholder="Tell us about your advertising needs"
                    ></textarea>
                  </div>
                  
                  <div>
                    <p className="block text-sm font-medium text-coalo-stone mb-2">Preferred Contact Method</p>
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="email"
                          checked={formData.preferredContact === 'email'}
                          onChange={handleRadioChange}
                          className="w-4 h-4 text-coalo-moss focus:ring-coalo-moss/50 border-coalo-sand/50"
                        />
                        <span className="ml-2 text-sm text-coalo-stone">Email</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="phone"
                          checked={formData.preferredContact === 'phone'}
                          onChange={handleRadioChange}
                          className="w-4 h-4 text-coalo-moss focus:ring-coalo-moss/50 border-coalo-sand/50"
                        />
                        <span className="ml-2 text-sm text-coalo-stone">Phone</span>
                      </label>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 btn-primary w-full flex items-center justify-center"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : 'Send Message'}
                </button>
              </form>
            )}
          </div>
          
          <div 
            ref={infoReveal.ref} 
            className={`transition-all duration-700 delay-500 ${infoReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="bg-white p-8 rounded-xl shadow-md border border-coalo-sand/20 h-full">
              <h3 className="text-xl font-semibold text-coalo-stone mb-6">Contact Information</h3>
              
              <div className="space-y-8">
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-coalo-clay/10 flex items-center justify-center mr-4">
                    <Mail size={20} className="text-coalo-clay" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-coalo-stone">Email Us</h4>
                    <p className="text-coalo-stone/80 mt-1">
                      <a href="mailto:info@coalo.co.za" className="hover:text-coalo-clay">info@coalo.co.za</a>
                    </p>
                    <p className="text-sm text-coalo-stone/60 mt-1">For general inquiries and information</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 rounded-full bg-coalo-clay/10 flex items-center justify-center mr-4">
                    <Phone size={20} className="text-coalo-clay" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-coalo-stone">Call Us</h4>
                    <p className="text-coalo-stone/80 mt-1">
                      <a href="tel:+27123456789" className="hover:text-coalo-clay">+27 12 345 6789</a>
                    </p>
                    <p className="text-sm text-coalo-stone/60 mt-1">Monday-Friday, 8am-6pm SAST</p>
                  </div>
                </div>
                
                <div className="pt-6 mt-6 border-t border-coalo-sand/30">
                  <h4 className="text-base font-medium text-coalo-stone mb-4">Frequently Asked Questions</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <h5 className="text-sm font-medium text-coalo-stone">What is the typical response time?</h5>
                      <p className="text-sm text-coalo-stone/80 mt-1">We respond to all inquiries within 24 business hours.</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-coalo-stone">How soon can I get my ad on your billboard?</h5>
                      <p className="text-sm text-coalo-stone/80 mt-1">Once approved, your ad can be live within 48-72 hours.</p>
                    </div>
                    
                    <div>
                      <h5 className="text-sm font-medium text-coalo-stone">Do you offer consultations?</h5>
                      <p className="text-sm text-coalo-stone/80 mt-1">Yes, we provide free initial consultations to discuss your specific needs.</p>
                    </div>
                  </div>
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
