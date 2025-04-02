import React, { useState, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { useRevealAnimation } from '../utils/animations';
import { QuoteFormData } from '../types';
import { useToast } from '@/hooks/use-toast';
import { getPricingDetails, formatCurrency } from '../utils/pdfGenerator';
import { Check, MinusCircle, PlusCircle, FileText } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { useEffect } from 'react';
import AddressAutocomplete from './AddressAutocomplete';

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
    tier: 'pro', // Default to Pro
    address: '',
    duration: 1
  });
  const [isAnnual, setIsAnnual] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quoteGenerated, setQuoteGenerated] = useState(false);
  const { toast } = useToast();
  const sectionReveal = useRevealAnimation();
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

  const handleAddressChange = (value: string) => {
    setFormData(prev => ({ ...prev, address: value }));
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

  const handleBillingCycleChange = (isChecked: boolean | 'indeterminate', type: 'monthly' | 'annual') => {
    if (isChecked === true) {
      setIsAnnual(type === 'annual');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Just wait a short time to simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Quote generated!",
        description: "Your quote has been prepared and displayed.",
        duration: 5000,
      });
      
      setQuoteGenerated(true);
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

  const calculateTotal = () => {
    if (!selectedPricing) return 0;
    const basePrice = isAnnual ? selectedPricing.annualPrice : selectedPricing.monthlyPrice;
    return basePrice * formData.duration * 1.15; // Including 15% VAT
  };

  return (
    <section id="quote" className="py-16 bg-coalo-cream/20">
        <div 
        className="container-custom"
        ref={sectionReveal.ref}
        >
        <div className="text-center mb-10">
          <h2 className="section-title">Get a Quote</h2>
          <p className="section-subtitle max-w-2xl mx-auto">
            Select your advertising options and receive a customized quote for your campaign.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left Column - Form */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-coalo-sand/10">
            <h3 className="text-lg font-semibold text-coalo-stone mb-6">Full Name</h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md border border-coalo-sand/30 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                    placeholder="Your full name"
                  />
                </div>

                <h3 className="text-lg font-semibold text-coalo-stone mb-2">Email Address</h3>
                <div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md border border-coalo-sand/30 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                    placeholder="your.email@example.com"
                  />
                </div>

                <h3 className="text-lg font-semibold text-coalo-stone mb-2">Company Name</h3>
                <div>
                  <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md border border-coalo-sand/30 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                    placeholder="Your company name"
                  />
                </div>

                <h3 className="text-lg font-semibold text-coalo-stone mb-2">Phone Number</h3>
          <div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 rounded-md border border-coalo-sand/30 focus:outline-none focus:ring-2 focus:ring-coalo-moss/50"
                    placeholder="Your phone number"
                  />
                </div>

                <h3 className="text-lg font-semibold text-coalo-stone mb-2">Select Pricing Tier</h3>
                <div>
              <Select 
                onValueChange={(value) => handleTierSelect(value as 'standard' | 'pro' | 'premium')}
                defaultValue={formData.tier}
              >
                    <SelectTrigger className="w-full px-4 py-3 rounded-md border border-coalo-sand/30">
                  <SelectValue placeholder="Select a pricing tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Plan</SelectItem>
                  <SelectItem value="pro">Pro Plan</SelectItem>
                  <SelectItem value="premium">Premium Plan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
                <h3 className="text-lg font-semibold text-coalo-stone mb-2">Billing Cycle</h3>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                <Checkbox 
                  id="monthly" 
                  checked={!isAnnual} 
                      onCheckedChange={(checked) => handleBillingCycleChange(checked, 'monthly')}
                />
                <label htmlFor="monthly" className="text-coalo-stone cursor-pointer">
                      Monthly Plan
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox 
                  id="annual" 
                  checked={isAnnual} 
                      onCheckedChange={(checked) => handleBillingCycleChange(checked, 'annual')}
                />
                    <label htmlFor="annual" className="text-coalo-stone font-medium cursor-pointer">
                      Annual Plan <span className="text-coalo-clay">(15% discount)</span>
                </label>
              </div>
            </div>

                <h3 className="text-lg font-semibold text-coalo-stone mb-2">Broadcast Duration</h3>
                <div>
              <div className="flex items-center space-x-4">
                <button 
                  type="button"
                  onClick={() => handleDurationChange(false)}
                  disabled={formData.duration <= 1}
                      className="p-1 rounded-full hover:bg-coalo-cream disabled:opacity-50 transition-colors"
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
                      className="p-1 rounded-full hover:bg-coalo-cream disabled:opacity-50 transition-colors"
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
                
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-coalo-earth hover:bg-coalo-earth/90 text-white font-medium py-3 px-6 rounded-md transition-colors mt-4"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Quote...
                    </>
                  ) : (
                    'Generate Quote'
                  )}
                </button>
              </div>
            </form>
          </div>
          
          {/* Right Column - Quote Display */}
          <div className="bg-white rounded-lg shadow-sm p-8 border border-coalo-sand/10 flex flex-col items-center justify-center min-h-[500px] text-center">
            {quoteGenerated ? (
              <div className="w-full">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-coalo-stone mb-2">Your Quote</h3>
                  <p className="text-coalo-stone/70">Quote #QUO-{new Date().getFullYear()}-{Math.floor(Math.random() * 1000)}</p>
                </div>
                
                <div className="bg-coalo-cream/20 p-6 rounded-lg mb-6 text-left">
                  <div className="border-b border-coalo-sand/30 pb-4 mb-4">
                    <h4 className="text-lg font-medium text-coalo-stone mb-2">Client Information</h4>
                    <p className="text-sm text-coalo-stone/80">{formData.name}</p>
                    <p className="text-sm text-coalo-stone/80">{formData.companyName}</p>
                    <p className="text-sm text-coalo-stone/80">{formData.email}</p>
                    <p className="text-sm text-coalo-stone/80">{formData.phone}</p>
                  </div>
                  
                  <div className="border-b border-coalo-sand/30 pb-4 mb-4">
                    <h4 className="text-lg font-medium text-coalo-stone mb-2">Service Details</h4>
                    <p className="flex justify-between text-sm">
                      <span className="text-coalo-stone/80">Plan:</span>
                      <span className="font-medium text-coalo-stone">{tierDetails[formData.tier].name}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span className="text-coalo-stone/80">Billing:</span>
                      <span className="font-medium text-coalo-stone">{isAnnual ? 'Annual' : 'Monthly'}</span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span className="text-coalo-stone/80">Duration:</span>
                      <span className="font-medium text-coalo-stone">{formData.duration} {cycleDuration}</span>
                    </p>
                    </div>
                  
                  <div>
                    <h4 className="text-lg font-medium text-coalo-stone mb-2">Price Breakdown</h4>
                    <p className="flex justify-between text-sm">
                      <span className="text-coalo-stone/80">Base Price:</span>
                      <span className="font-medium text-coalo-stone">
                        {formatCurrency(isAnnual ? selectedPricing.annualPrice : selectedPricing.monthlyPrice)}
                        / {isAnnual ? 'year' : 'month'}
                      </span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span className="text-coalo-stone/80">Subtotal:</span>
                      <span className="font-medium text-coalo-stone">
                        {formatCurrency((isAnnual ? selectedPricing.annualPrice : selectedPricing.monthlyPrice) * formData.duration)}
                      </span>
                    </p>
                    <p className="flex justify-between text-sm">
                      <span className="text-coalo-stone/80">VAT (15%):</span>
                      <span className="font-medium text-coalo-stone">
                        {formatCurrency((isAnnual ? selectedPricing.annualPrice : selectedPricing.monthlyPrice) * formData.duration * 0.15)}
                      </span>
                    </p>
                    {isAnnual && (
                      <p className="flex justify-between text-sm text-coalo-clay">
                        <span>Savings:</span>
                        <span className="font-medium">
                          {formatCurrency(selectedPricing.monthlyPrice * 12 * 0.15 * formData.duration)}
                        </span>
                      </p>
                    )}
                    <div className="border-t border-coalo-sand/30 mt-3 pt-3">
                      <p className="flex justify-between">
                        <span className="font-medium text-coalo-stone">Total:</span>
                        <span className="font-bold text-coalo-clay text-lg">
                          {formatCurrency(calculateTotal())}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-coalo-stone/70 text-center">
                  Thank you for your interest! A representative will contact you shortly.
                </p>
              </div>
            ) : (
              <div className="text-center p-6">
                <div className="mb-6 w-20 h-20 mx-auto bg-coalo-cream/50 rounded-full flex items-center justify-center">
                  <FileText className="h-10 w-10 text-coalo-moss" />
                </div>
                <h3 className="text-2xl font-semibold text-coalo-stone mb-3">Your Quote Will Appear Here</h3>
                <p className="text-coalo-stone/70 max-w-sm mx-auto">
                  Fill out the form to generate a detailed quote for your
                  selected advertising package.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;
