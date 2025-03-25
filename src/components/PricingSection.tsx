
import { useState } from 'react';
import { Check } from 'lucide-react';
import { PriceTier } from '../types';
import { useRevealAnimation } from '../utils/animations';
import { formatCurrency } from '../utils/pdfGenerator';

const tiers: PriceTier[] = [
  {
    name: 'Standard',
    monthlyPrice: 10000,
    annualPrice: 102000,
    description: 'Essential advertising for small businesses looking to establish a presence.',
    features: [
      '10-second advert duration',
      'Fixed scheduling',
      'Static images only',
      'Moderate cycle frequency',
      'Monthly reporting',
      'Standard support',
    ],
  },
  {
    name: 'Pro',
    monthlyPrice: 25000,
    annualPrice: 255000,
    description: 'Advanced features for growing brands seeking enhanced visibility.',
    features: [
      '20-second advert duration',
      'Enhanced scheduling flexibility',
      'Mix of static and limited dynamic content',
      'Increased cycle frequency',
      'Bi-weekly reporting',
      'Priority support',
      'Basic AI-driven analytics',
    ],
    highlighted: true,
  },
  {
    name: 'Premium',
    monthlyPrice: 45000,
    annualPrice: 459000,
    description: 'Complete creative freedom and maximum exposure for established brands.',
    features: [
      '45-second advert duration',
      'Unlimited cycles per day',
      'Full creative freedom (video, dynamic or static)',
      'AI-driven input and analytics',
      'QR code discounts for first 100 customers',
      '24/7 dedicated support',
      'Customizable campaigns',
      'Overnight viewership',
      'Tailored target market',
    ],
  },
];

const PricingSection = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const headerReveal = useRevealAnimation();
  const cardsReveal = useRevealAnimation();

  return (
    <section id="pricing" className="py-20 md:py-28">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Transparent Pricing</h2>
          <p className="section-subtitle">
            Choose the plan that suits your advertising needs, with flexible options for businesses of all sizes.
          </p>
          
          <div className="flex items-center justify-center mt-8 mb-12">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-l-md transition-all ${
                !isAnnual 
                  ? 'bg-coalo-earth text-white' 
                  : 'bg-gray-100 text-coalo-stone hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-r-md transition-all ${
                isAnnual 
                  ? 'bg-coalo-earth text-white' 
                  : 'bg-gray-100 text-coalo-stone hover:bg-gray-200'
              }`}
            >
              Annual (15% Savings)
            </button>
          </div>
        </div>

        <div 
          ref={cardsReveal.ref} 
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-1000 ${cardsReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          {tiers.map((tier) => (
            <div 
              key={tier.name} 
              className={`price-card ${tier.highlighted ? 'highlighted' : ''}`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-coalo-moss text-white text-xs font-semibold rounded-full">
                  Recommended
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-coalo-stone mb-2">{tier.name}</h3>
              <p className="text-sm text-coalo-earth mb-6">{tier.description}</p>
              
              {isAnnual ? (
                <div className="mb-6">
                  <p className="text-3xl font-display font-bold text-coalo-clay mb-1">
                    {formatCurrency(tier.annualPrice)}
                    <span className="text-sm font-normal text-coalo-stone/70">/month</span>
                  </p>
                  <p className="text-sm line-through text-coalo-stone/60">
                    Original: {formatCurrency(tier.monthlyPrice * 12)}
                  </p>
                  <p className="text-xs text-coalo-stone/70 mt-1">
                    Total annual: {formatCurrency(tier.annualPrice * 12)}
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <p className="text-3xl font-display font-bold text-coalo-clay mb-1">
                    {formatCurrency(tier.monthlyPrice)}
                    <span className="text-sm font-normal text-coalo-stone/70">/month</span>
                  </p>
                  <p className="text-xs text-coalo-stone/70 mt-1">
                    Billed monthly
                  </p>
                </div>
              )}
              
              <ul className="space-y-3 mb-8">
                {tier.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <Check size={18} className="text-coalo-moss mt-0.5 mr-2 shrink-0" />
                    <span className="text-sm text-coalo-stone/80">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="mt-auto">
                <a 
                  href={`#quote?tier=${tier.name.toLowerCase()}`} 
                  className={`w-full text-center py-2.5 px-4 rounded-md transition-colors ${
                    tier.highlighted
                      ? 'bg-coalo-moss text-white hover:bg-coalo-moss/90'
                      : 'border border-coalo-earth/30 text-coalo-stone hover:bg-coalo-sand/20'
                  }`}
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
