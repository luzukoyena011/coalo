
import { Calendar, Clock, Award, MessageSquare, BarChart, Zap } from 'lucide-react';
import { ServiceFeature } from '../types';
import { useRevealAnimation } from '../utils/animations';

const services: Record<string, ServiceFeature[]> = {
  standard: [
    { 
      title: '10-Second Advert',
      description: 'Concise advertisements optimized for quick viewer engagement',
      icon: <Clock size={24} className="text-coalo-terracotta" />
    },
    { 
      title: 'Fixed Scheduling',
      description: 'Predetermined time slots for your content to be displayed',
      icon: <Calendar size={24} className="text-coalo-terracotta" /> 
    },
    { 
      title: 'Static Images',
      description: 'High-quality static visuals for your advertising needs',
      icon: <Zap size={24} className="text-coalo-terracotta" />
    },
  ],
  pro: [
    { 
      title: '20-Second Advert',
      description: 'Extended runtime for more comprehensive message delivery',
      icon: <Clock size={24} className="text-coalo-moss" />
    },
    { 
      title: 'Enhanced Scheduling',
      description: 'Flexible timing options to target optimal viewing periods',
      icon: <Calendar size={24} className="text-coalo-moss" /> 
    },
    { 
      title: 'Mixed Content Types',
      description: 'Combine static and limited dynamic elements for greater impact',
      icon: <Zap size={24} className="text-coalo-moss" />
    },
    { 
      title: 'AI-Driven Analytics',
      description: 'Basic insights into viewer engagement and campaign performance',
      icon: <BarChart size={24} className="text-coalo-moss" />
    },
  ],
  premium: [
    { 
      title: '45-Second Advert',
      description: 'Maximum exposure time for comprehensive storytelling',
      icon: <Clock size={24} className="text-coalo-clay" />
    },
    { 
      title: 'Unlimited Scheduling',
      description: 'Complete freedom to display your content at any time',
      icon: <Calendar size={24} className="text-coalo-clay" /> 
    },
    { 
      title: 'Full Creative Freedom',
      description: 'Use any combination of video, dynamic content, and static images',
      icon: <Zap size={24} className="text-coalo-clay" />
    },
    { 
      title: 'Advanced AI Analytics',
      description: 'Comprehensive data analysis for campaign optimization',
      icon: <BarChart size={24} className="text-coalo-clay" />
    },
    { 
      title: '24/7 Dedicated Support',
      description: 'Round-the-clock assistance from our specialized team',
      icon: <MessageSquare size={24} className="text-coalo-clay" />
    },
    { 
      title: 'Exclusive Benefits',
      description: 'QR code discounts, overnight viewership, and tailored targeting',
      icon: <Award size={24} className="text-coalo-clay" />
    },
  ],
};

const ServiceOffering = () => {
  const headerReveal = useRevealAnimation();
  const standardReveal = useRevealAnimation();
  const proReveal = useRevealAnimation();
  const premiumReveal = useRevealAnimation();

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-white to-coalo-cream/20">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Service Offerings</h2>
          <p className="section-subtitle">
            Explore our range of advertising solutions, tailored to meet different needs and objectives.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-16">
          {/* Standard Tier */}
          <div 
            ref={standardReveal.ref} 
            className={`transition-all duration-700 delay-100 ${standardReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-coalo-terracotta/10 flex items-center justify-center">
                <span className="text-coalo-terracotta font-semibold">S</span>
              </div>
              <h3 className="text-2xl font-display font-semibold text-coalo-stone">Standard Tier</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.standard.map((service, index) => (
                <div key={index} className="p-6 rounded-xl bg-white border border-coalo-sand/20 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-coalo-terracotta/10 flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-coalo-stone mb-2">{service.title}</h4>
                  <p className="text-sm text-coalo-stone/70">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Pro Tier */}
          <div 
            ref={proReveal.ref} 
            className={`transition-all duration-700 delay-300 ${proReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-coalo-moss/10 flex items-center justify-center">
                <span className="text-coalo-moss font-semibold">P</span>
              </div>
              <h3 className="text-2xl font-display font-semibold text-coalo-stone">Pro Tier</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {services.pro.map((service, index) => (
                <div key={index} className="p-6 rounded-xl bg-white border border-coalo-moss/20 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-coalo-moss/10 flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-coalo-stone mb-2">{service.title}</h4>
                  <p className="text-sm text-coalo-stone/70">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Premium Tier */}
          <div 
            ref={premiumReveal.ref} 
            className={`transition-all duration-700 delay-500 ${premiumReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-full bg-coalo-clay/10 flex items-center justify-center">
                <span className="text-coalo-clay font-semibold">P+</span>
              </div>
              <h3 className="text-2xl font-display font-semibold text-coalo-stone">Premium Tier</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.premium.map((service, index) => (
                <div key={index} className="p-6 rounded-xl bg-white border border-coalo-clay/20 shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-coalo-clay/10 flex items-center justify-center mb-4">
                    {service.icon}
                  </div>
                  <h4 className="text-lg font-semibold text-coalo-stone mb-2">{service.title}</h4>
                  <p className="text-sm text-coalo-stone/70">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServiceOffering;
