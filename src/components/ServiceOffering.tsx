
import { useRevealAnimation } from '../utils/animations';
import { ServiceFeature } from '../types';
import { Check, Clock, Palette, Zap, BarChart, Users, Sparkles } from 'lucide-react';

const serviceFeatures: ServiceFeature[] = [
  {
    title: 'AI-Driven Targeting',
    description: 'Our proprietary algorithms analyze foot traffic patterns to display your content at optimal times, increasing engagement.',
    icon: <Zap className="w-6 h-6 text-coalo-clay" />
  },
  {
    title: 'Creative Flexibility',
    description: 'From static images to dynamic video content, our platform supports versatile creative formats to showcase your brand.',
    icon: <Palette className="w-6 h-6 text-coalo-clay" />
  },
  {
    title: 'Real-Time Analytics',
    description: 'Access comprehensive dashboards that provide insights into impressions, engagement, and conversion metrics.',
    icon: <BarChart className="w-6 h-6 text-coalo-clay" />
  },
  {
    title: 'Strategic Scheduling',
    description: 'Choose specific time slots to target your ideal demographic during peak hours for maximum visibility.',
    icon: <Clock className="w-6 h-6 text-coalo-clay" />
  },
  {
    title: 'Audience Targeting',
    description: 'Reach specific demographics through our strategic billboard placement and timing algorithms.',
    icon: <Users className="w-6 h-6 text-coalo-clay" />
  },
  {
    title: 'Premium Content Quality',
    description: 'High-resolution display technology ensures your visuals are crisp, vibrant, and attention-grabbing.',
    icon: <Sparkles className="w-6 h-6 text-coalo-clay" />
  }
];

const ServiceOffering = () => {
  const headerReveal = useRevealAnimation();
  const featuresReveal = useRevealAnimation();

  return (
    <section id="services" className="py-20 md:py-28 bg-coalo-cream/10">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Our Service Offerings</h2>
          <p className="section-subtitle">
            We provide comprehensive digital outdoor advertising solutions tailored to your unique needs.
          </p>
        </div>

        <div 
          ref={featuresReveal.ref}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-700 delay-300 ${featuresReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          {serviceFeatures.map((feature, index) => (
            <div key={index} className="p-6 bg-white rounded-xl shadow-sm border border-coalo-sand/10 hover:shadow-md transition-shadow">
              <div className="p-3 rounded-lg bg-coalo-sand/10 inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-coalo-stone mb-3">{feature.title}</h3>
              <p className="text-coalo-stone/80">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceOffering;
