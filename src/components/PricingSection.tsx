
import { useState } from 'react';
import { useRevealAnimation } from '../utils/animations';
import { PriceTier } from '../types';
import { formatCurrency } from '../utils/pdfGenerator';

// Regular pricing tiers
const priceTiers: PriceTier[] = [
  {
    name: 'Standard',
    monthlyPrice: 10000,  // Changed from 8500 to 10000
    annualPrice: 8500,
    description: 'Perfect for small businesses looking to establish a presence.',
    features: [
      '10-second advert',
      'Fixed scheduling',
      'Static images only',
      'Moderate cycle frequency',
      'Basic analytics'
    ]
  },
  {
    name: 'Pro',
    monthlyPrice: 25000,
    annualPrice: 21250,
    description: 'Ideal for growing businesses seeking more flexibility and impact.',
    features: [
      '30-second advert',
      'Enhanced scheduling flexibility',
      'Mix of static and limited dynamic content',
      'Higher cycle frequency',
      'Detailed analytics dashboard',
      'Email support'
    ],
    highlighted: true
  },
  {
    name: 'Premium',
    monthlyPrice: 45000,
    annualPrice: 38250,
    description: 'The ultimate package for maximum exposure and creative freedom.',
    features: [
      '45-second advert',
      'Unlimited cycles per day',
      'Full creative freedom (video, dynamic or static)',
      'AI-driven input',
      'QR code discounts for first 100 customers',
      '24/7 dedicated support',
      'Customizable campaigns',
      'Overnight viewership',
      'Tailored target market'
    ]
  }
];

// SMME pricing tiers
const smmePriceTiers: PriceTier[] = [
  {
    name: 'SMME Launchpad',
    monthlyPrice: 2950,
    annualPrice: 2507.5, // R30,090/12
    description: 'Micro-businesses, startups, first-time digital billboard advertisers needing essential local visibility.',
    features: [
      '7-10 second advert',
      'Basic AI-Optimized Rotational Scheduling',
      'Static Image (Client-provided or template)',
      'Selected peri-urban/rural billboards',
      'Monthly Basic Performance Snapshot',
      'Email Support',
      'Change ad creative once per month',
      'Affordable AI Advantage for better local visibility'
    ]
  },
  {
    name: 'SMME Growth Engine',
    monthlyPrice: 5500,
    annualPrice: 4675, // R56,100/12
    description: 'Small businesses aiming to expand local reach, increase brand recall, and drive customer action.',
    features: [
      '10-15 second advert',
      'Advanced AI-Optimized Scheduling',
      'Static Image or Simple Animated GIF',
      'Wider billboard access including higher-traffic nodes',
      'Monthly Standard Performance Report',
      'Creative consultation call',
      'Email & Telephonic Support',
      'Change ad creative up to twice per month'
    ],
    highlighted: true
  }
];

const PricingSection = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');
  const [pricingType, setPricingType] = useState<'standard' | 'smme'>('standard');
  const headerReveal = useRevealAnimation();
  const cardsReveal = useRevealAnimation();

  const currentPriceTiers = pricingType === 'standard' ? priceTiers : smmePriceTiers;

  return (
    <section id="pricing" className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Transparent Pricing</h2>
          <p className="section-subtitle">
            Choose the perfect plan for your advertising needs. Save 15% with annual billing.
          </p>
          
          <div className="flex justify-center mt-6 p-1 bg-muted rounded-full w-fit mx-auto">
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-white shadow-sm text-coalo-stone' : 'text-coalo-stone/70'}`}
              onClick={() => setBillingCycle('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${billingCycle === 'annual' ? 'bg-white shadow-sm text-coalo-stone' : 'text-coalo-stone/70'}`}
              onClick={() => setBillingCycle('annual')}
            >
              Annual <span className="text-coalo-clay">-15%</span>
            </button>
          </div>

          {/* Pricing Type Selector */}
          <div className="flex justify-center mt-6 p-1 bg-muted rounded-full w-fit mx-auto">
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${pricingType === 'standard' ? 'bg-white shadow-sm text-coalo-stone' : 'text-coalo-stone/70'}`}
              onClick={() => setPricingType('standard')}
            >
              Standard
            </button>
            <button 
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${pricingType === 'smme' ? 'bg-white shadow-sm text-coalo-stone' : 'text-coalo-stone/70'}`}
              onClick={() => setPricingType('smme')}
            >
              SMME Plans
            </button>
          </div>
        </div>
        
        <div 
          ref={cardsReveal.ref}
          className={`grid grid-cols-1 ${pricingType === 'standard' ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-8 transition-all duration-700 delay-300 ${cardsReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          {currentPriceTiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`price-card ${tier.highlighted ? 'highlighted' : ''}`}
            >
              {tier.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-coalo-moss text-white px-4 py-1 rounded-full text-xs font-semibold">
                  Most Popular
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-coalo-stone mb-2">{tier.name}</h3>
              <p className="text-sm text-coalo-earth mb-6">{tier.description}</p>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-coalo-stone">
                    {formatCurrency(billingCycle === 'monthly' ? tier.monthlyPrice : tier.annualPrice)}
                  </span>
                  <span className="text-coalo-earth ml-2">
                    /month
                  </span>
                </div>
                
                {billingCycle === 'annual' && (
                  <>
                    <div className="mt-1 text-sm text-coalo-earth line-through">
                      {pricingType === 'standard' ? 
                        (tier.name === 'Standard' ? 'Original price: R10,000' : 
                        tier.name === 'Pro' ? 'Original price: R25,000' : 
                        'Original price: R45,000') :
                        (tier.name === 'SMME Launchpad' ? 'Original price: R2,950' : 
                        'Original price: R5,500')
                      }
                    </div>
                    <div className="mt-1 text-xs text-coalo-stone/70">
                      {pricingType === 'standard' ?
                        (tier.name === 'Standard' ? 'Total annual price: R102,000' : 
                        tier.name === 'Pro' ? 'Total annual price: R255,060' : 
                        'Total annual price: R459,000') :
                        (tier.name === 'SMME Launchpad' ? 'Total annual price: R30,090' : 
                        'Total annual price: R56,100')
                      }
                      
                      {pricingType === 'smme' && (
                        <span className="ml-1">
                          {tier.name === 'SMME Launchpad' ? '(Save R5,310)' : '(Save R9,900)'}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-coalo-moss flex-shrink-0 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-sm text-coalo-stone">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <a 
                  href="#quote" 
                  className={`w-full text-center py-3 px-4 rounded-md transition-colors ${tier.highlighted 
                    ? 'bg-coalo-moss text-white hover:bg-coalo-moss/90' 
                    : 'bg-white border border-coalo-sand hover:bg-coalo-sand/10 text-coalo-stone'}`}
                >
                  Get a Quote
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
