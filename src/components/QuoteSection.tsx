
import { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { CheckCircle } from 'lucide-react';
import { useRevealAnimation } from '../utils/animations';
import { QuoteFormData } from '../types';
import { generateQuotePDF, getPricingDetails, formatCurrency } from '../utils/pdfGenerator';

const QuoteSection = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    tier: 'standard'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const headerReveal = useRevealAnimation();
  const formReveal = useRevealAnimation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate PDF generation and download
    setTimeout(() => {
      const pdfUrl = generateQuotePDF(formData.tier as 'standard' | 'pro' | 'premium', formData.name, formData.companyName);
      console.log('Quote generated:', pdfUrl);
      
      // Success state
      setIsSubmitting(false);
      setIsSuccess(true);
      
      toast({
        title: "Quote generated successfully",
        description: "Your quote has been generated and is ready for download.",
      });

      // Reset form after a delay
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          name: '',
          companyName: '',
          email: '',
          phone: '',
          tier: 'standard'
        });
      }, 3000);
    }, 1500);
  };

  // Get pricing details for the selected tier
  const pricingDetails = getPricingDetails(formData.tier as 'standard' | 'pro' | 'premium');
  const subTotal = pricingDetails.monthlyPrice;
  const vat = subTotal * 0.15;
  const totalAmount = subTotal + vat;

  return (
    <section id="quote" className="py-20 md:py-28">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Get a Quote</h2>
          <p className="section-subtitle">
            Select your preferred plan and we'll generate a detailed quotation tailored to your needs.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div 
            ref={formReveal.ref} 
            className={`transition-all duration-700 ${formReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            {isSuccess ? (
              <div className="bg-white p-8 rounded-xl shadow-md border border-coalo-moss/20 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-coalo-moss/10 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-coalo-moss" />
                </div>
                <h3 className="text-xl font-semibold text-coalo-stone mb-2">Quote Generated!</h3>
                <p className="text-coalo-stone/80 mb-6">
                  Your quote for the {formData.tier.charAt(0).toUpperCase() + formData.tier.slice(1)} plan has been generated successfully.
                </p>
                <a 
                  href="#" 
                  className="btn-primary"
                  onClick={(e) => {
                    e.preventDefault();
                    toast({
                      title: "Download started",
                      description: "Your quote PDF is being downloaded.",
                    });
                  }}
                >
                  Download Quote PDF
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-md border border-coalo-sand/20 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  {/* Form Section */}
                  <div className="p-8">
                    <h3 className="text-xl font-semibold text-coalo-stone mb-6">Your Information</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                        <label htmlFor="companyName" className="block text-sm font-medium text-coalo-stone mb-1">Company Name</label>
                        <input
                          type="text"
                          id="companyName"
                          name="companyName"
                          value={formData.companyName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2.5 rounded-md border border-coalo-sand/50 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                          placeholder="Your company"
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
                        <label htmlFor="tier" className="block text-sm font-medium text-coalo-stone mb-1">Select Plan</label>
                        <select
                          id="tier"
                          name="tier"
                          value={formData.tier}
                          onChange={handleChange}
                          className="w-full px-4 py-2.5 rounded-md border border-coalo-sand/50 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                        >
                          <option value="standard">Standard</option>
                          <option value="pro">Pro</option>
                          <option value="premium">Premium</option>
                        </select>
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
                            Generating Quote...
                          </>
                        ) : 'Generate Quote'}
                      </button>
                    </form>
                  </div>
                  
                  {/* Quote Preview Section */}
                  <div className="bg-coalo-stone/5 p-8 border-l border-coalo-sand/20">
                    <h3 className="text-xl font-semibold text-coalo-stone mb-6">Quote Preview</h3>
                    
                    <div className="bg-white p-6 rounded-lg border border-coalo-sand/20 shadow-sm">
                      <div className="flex justify-between items-center pb-4 mb-4 border-b border-coalo-sand/20">
                        <div>
                          <h4 className="font-semibold text-coalo-stone">{formData.tier.charAt(0).toUpperCase() + formData.tier.slice(1)} Plan</h4>
                          <p className="text-sm text-coalo-stone/70">Monthly Billing</p>
                        </div>
                        <span className="text-xl font-semibold text-coalo-clay">{formatCurrency(pricingDetails.monthlyPrice)}</span>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-coalo-stone/70">Subtotal</span>
                          <span className="text-coalo-stone">{formatCurrency(subTotal)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-coalo-stone/70">VAT (15%)</span>
                          <span className="text-coalo-stone">{formatCurrency(vat)}</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-between pt-4 border-t border-coalo-sand/20">
                        <span className="font-medium text-coalo-stone">Total Amount</span>
                        <span className="font-semibold text-coalo-clay">{formatCurrency(totalAmount)}</span>
                      </div>
                      
                      <div className="mt-6 pt-4 border-t border-coalo-sand/20">
                        <h5 className="font-medium text-coalo-stone mb-2">What's included:</h5>
                        <ul className="text-sm text-coalo-stone/80 space-y-1">
                          {formData.tier === 'standard' && (
                            <>
                              <li>• 10-second advert duration</li>
                              <li>• Fixed scheduling</li>
                              <li>• Static images only</li>
                              <li>• Monthly reporting</li>
                            </>
                          )}
                          {formData.tier === 'pro' && (
                            <>
                              <li>• 20-second advert duration</li>
                              <li>• Enhanced scheduling flexibility</li>
                              <li>• Mixed content types</li>
                              <li>• Bi-weekly reporting</li>
                              <li>• Basic AI analytics</li>
                            </>
                          )}
                          {formData.tier === 'premium' && (
                            <>
                              <li>• 45-second advert duration</li>
                              <li>• Unlimited cycles per day</li>
                              <li>• Full creative freedom (video, dynamic, static)</li>
                              <li>• 24/7 dedicated support</li>
                              <li>• Advanced AI analytics</li>
                            </>
                          )}
                        </ul>
                      </div>
                      
                      <div className="mt-6 text-xs text-coalo-stone/60">
                        <p>Quote valid for 30 days. Terms and conditions apply.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
