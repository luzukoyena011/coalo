import React, { useState, useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useRevealAnimation } from '../utils/animations';
import { QuoteFormData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { generateQuotePDF, getPricingDetails, formatCurrency } from '../utils/pdfGenerator';
import { Check, ChevronDown, ChevronUp, MinusCircle, PlusCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { useForm } from 'react-hook-form';


const tierDetails = {
  standard: {
    name: 'Standard',
    features: [
      '10-second advert',
      'Fixed scheduling',
      'Static images only',
      'Moderate cycle frequency',
      'Basic analytics'
    ]
  },
  pro: {
    name: 'Pro',
    features: [
      '20-second advert',
      'Enhanced scheduling flexibility',
      'Mix of static and limited dynamic content',
      'Higher cycle frequency',
      'Detailed analytics dashboard',
      'Email support'
    ]
  },
  premium: {
    name: 'Premium',
    features: [
      '45-second advert',
      'Unlimited cycles per day',
      'Full creative freedom (video, dynamic or static)',
      'AI-driven input',
      'QR code discounts for first 100 customers',
      '24/7 dedicated support',
      'Customizable campaigns'
    ]
  }
};

const QuoteSection = () => {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    tier: 'standard',
    address: '', // Added address field
    duration: 1, // Added duration field
  });
  const [isAnnual, setIsAnnual] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const headerReveal = useRevealAnimation();
  const formReveal = useRevealAnimation();
  const form = useForm();
  const addressInputRef = useRef<HTMLInputElement>(null);

  // Google Maps API initialization
  useEffect(() => {
    const initGooglePlaces = async () => {
      try {
        // Check if API key is available
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
          console.warn("Google Maps API key not found. Address autocomplete will not work.");
          return;
        }
        
        const loader = new Loader({
          apiKey,
          version: "weekly",
          libraries: ["places"]
        });
        
        const google = await loader.load();
        
        if (addressInputRef.current && google.maps.places) {
          const autocomplete = new google.maps.places.Autocomplete(addressInputRef.current, {
            types: ['address'],
            fields: ['formatted_address']
          });
          
          autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
              setFormData(prev => ({ ...prev, address: place.formatted_address }));
            }
          });
        }
      } catch (error) {
        console.error("Error initializing Google Places:", error);
        // Don't show error to user, just fallback to regular input
      }
    };
    
    initGooglePlaces();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTierSelect = (tier: 'standard' | 'pro' | 'premium') => {
    setFormData(prev => ({ ...prev, tier }));
  };

  const handleDurationChange = (increment: boolean) => {
    setFormData(prev => ({ 
      ...prev, 
      duration: increment 
        ? Math.min(prev.duration + 1, 10) 
        : Math.max(prev.duration - 1, 1) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Generate PDF quote
      const pdfUrl = generateQuotePDF(
        formData.tier, 
        formData.name,
        formData.companyName,
        formData.phone,
        formData.duration,
        isAnnual,
        formData.address
      );
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Quote generated!",
        description: "Your quote has been prepared successfully.",
        duration: 5000,
      });
      
      // In a real app, you would either download the PDF or send it via email
      console.log('Quote PDF URL:', pdfUrl);
      
      // Reset form
      setFormData({
        name: '',
        companyName: '',
        email: '',
        phone: '',
        tier: 'standard',
        address: '',
        duration: 1,
      });
    } catch (error) {
      console.error('Error generating quote:', error);
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

  const selectedPricing = getPricingDetails(formData.tier);
  const cycleDuration = isAnnual ? 'years' : 'months';

  return (
    <section id="quote" className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Get a Quote</h2>
          <p className="section-subtitle">
            Select your preferred advertising tier and receive a customized quote instantly.
          </p>
        </div>

        <div 
          ref={formReveal.ref}
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 transition-all duration-700 delay-300 ${formReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div>
            <h3 className="text-xl font-semibold text-coalo-stone mb-6">Select Your Advertising Tier</h3>
            
            <div className="mb-6">
              <Select 
                onValueChange={(value) => handleTierSelect(value as 'standard' | 'pro' | 'premium')}
                defaultValue={formData.tier}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a pricing tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Plan</SelectItem>
                  <SelectItem value="pro">Pro Plan</SelectItem>
                  <SelectItem value="premium">Premium Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="p-6 rounded-xl border-2 border-coalo-moss bg-coalo-cream/10 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="text-lg font-semibold text-coalo-stone">{tierDetails[formData.tier].name}</h4>
              </div>
              
              <ul className="space-y-2">
                {tierDetails[formData.tier].features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="w-5 h-5 text-coalo-moss mt-0.5 mr-2 flex-shrink-0" />
                    <span className="text-coalo-stone">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mb-8">
              <h4 className="text-lg font-semibold text-coalo-stone mb-3">Billing Cycle</h4>
              <div className="flex items-center gap-2 mb-2">
                <Checkbox 
                  id="monthly" 
                  checked={!isAnnual} 
                  onCheckedChange={() => setIsAnnual(false)}
                />
                <label htmlFor="monthly" className="text-coalo-stone cursor-pointer">
                  Monthly Billing
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="annual" 
                  checked={isAnnual} 
                  onCheckedChange={() => setIsAnnual(true)}
                />
                <label htmlFor="annual" className="text-coalo-stone cursor-pointer">
                  Annual Billing <span className="text-coalo-clay">(Save 15%)</span>
                </label>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-lg font-semibold text-coalo-stone mb-3">Broadcast Duration</h4>
              <div className="flex items-center space-x-4">
                <button 
                  type="button"
                  onClick={() => handleDurationChange(false)}
                  disabled={formData.duration <= 1}
                  className="p-1 rounded-full hover:bg-coalo-cream disabled:opacity-50"
                  aria-label="Decrease duration"
                >
                  <MinusCircle className="w-6 h-6 text-coalo-clay" />
                </button>
                
                <div className="flex items-center justify-center w-16 h-10 border-2 border-coalo-sand rounded-md">
                  <span className="text-xl font-medium text-coalo-stone">{formData.duration}</span>
                </div>
                
                <button 
                  type="button"
                  onClick={() => handleDurationChange(true)}
                  disabled={formData.duration >= 10}
                  className="p-1 rounded-full hover:bg-coalo-cream disabled:opacity-50"
                  aria-label="Increase duration"
                >
                  <PlusCircle className="w-6 h-6 text-coalo-moss" />
                </button>
                
                <span className="text-coalo-stone ml-2">
                  {cycleDuration}
                </span>
              </div>
              <p className="mt-2 text-sm text-coalo-stone/70">
                Select between 1 and 10 {cycleDuration}
              </p>
            </div>
          </div>
          
          <div>
            <div className="bg-white p-8 rounded-xl shadow-sm border border-coalo-sand/10">
              <h3 className="text-xl font-semibold text-coalo-stone mb-6">Your Information</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-6">
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
                    <label htmlFor="companyName" className="block text-sm font-medium text-coalo-stone mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-md border border-coalo-sand/30 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                      placeholder="Acme Inc."
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-coalo-stone mb-1">
                      Company Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 rounded-md border border-coalo-sand/30 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                      placeholder="Start typing for address suggestions..."
                      ref={addressInputRef}
                    />
                    <p className="mt-1 text-xs text-coalo-stone/70">
                      Powered by Google Places
                    </p>
                  </div>
                  
                  <div>
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
                
                <div className="bg-coalo-cream/20 p-6 rounded-lg mb-6">
                  <h4 className="font-medium text-coalo-stone mb-3">Quote Summary</h4>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-coalo-stone/80">Selected Plan:</span>
                      <span className="font-medium text-coalo-stone">{tierDetails[formData.tier].name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-coalo-stone/80">Billing Cycle:</span>
                      <span className="font-medium text-coalo-stone">{isAnnual ? 'Annual' : 'Monthly'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-coalo-stone/80">Duration:</span>
                      <span className="font-medium text-coalo-stone">{formData.duration} {cycleDuration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-coalo-stone/80">{isAnnual ? 'Annual Price:' : 'Monthly Price:'}</span>
                      <span className="font-medium text-coalo-stone">
                        {formatCurrency(isAnnual ? selectedPricing.annualPrice : selectedPricing.monthlyPrice)}
                      </span>
                    </div>
                    <div className="border-t border-coalo-sand/30 my-2 pt-2 flex justify-between">
                      <span className="text-coalo-stone/80">Subtotal:</span>
                      <span className="font-medium text-coalo-stone">
                        {formatCurrency((isAnnual ? selectedPricing.annualPrice : selectedPricing.monthlyPrice) * formData.duration)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-coalo-stone/80">VAT (15%):</span>
                      <span className="font-medium text-coalo-stone">
                        {formatCurrency((isAnnual ? selectedPricing.annualPrice : selectedPricing.monthlyPrice) * formData.duration * 0.15)}
                      </span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="font-medium text-coalo-stone">Total:</span>
                      <span className="font-bold text-coalo-clay">
                        {formatCurrency((isAnnual ? selectedPricing.annualPrice : selectedPricing.monthlyPrice) * formData.duration * 1.15)}
                      </span>
                    </div>
                    {isAnnual && (
                      <div className="mt-2 text-sm text-coalo-clay">
                        You save: {formatCurrency(selectedPricing.monthlyPrice * 12 * 0.15 * formData.duration)} per {formData.duration > 1 ? `${formData.duration} years` : 'year'}
                      </div>
                    )}
                  </div>
                  
                  <p className="text-xs text-coalo-stone/70">
                    * Quote is valid for 30 days. All prices include VAT.
                  </p>
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
                      Generating Quote...
                    </>
                  ) : (
                    'Generate Quote PDF'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
