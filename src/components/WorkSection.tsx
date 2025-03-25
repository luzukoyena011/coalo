
import { useState } from 'react';
import { WorkItem } from '../types';
import { useRevealAnimation } from '../utils/animations';

const workItems: WorkItem[] = [
  {
    title: 'Eco-Friendly Transportation Campaign',
    description: 'A dynamic campaign for a leading electric vehicle manufacturer, showcasing their commitment to sustainable transportation.',
    image: 'https://images.unsplash.com/photo-1493397212122-2b85dda8106b',
    results: '37% increase in local dealership visits, 22% growth in test drive bookings'
  },
  {
    title: 'Urban Apparel Brand Launch',
    description: 'Helped an emerging streetwear brand establish presence in key metropolitan areas with targeted digital billboards.',
    image: 'https://images.unsplash.com/photo-1551038247-3d9af20df552',
    results: '156% increase in social media engagement, 43% boost in online sales from featured areas'
  },
  {
    title: 'Local Restaurant Promotion',
    description: 'Created a hyper-local campaign for a restaurant chain, driving foot traffic during specific hours with dynamic content.',
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    results: '28% increase in dinner reservations, 15% growth in average order value'
  }
];

const WorkSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const headerReveal = useRevealAnimation();
  const contentReveal = useRevealAnimation();

  return (
    <section id="work" className="py-20 md:py-28 bg-coalo-stone/5">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Previous Work</h2>
          <p className="section-subtitle">
            Explore our successful campaigns and see how we've helped brands connect with communities.
          </p>
        </div>

        <div 
          ref={contentReveal.ref} 
          className={`transition-all duration-1000 ${contentReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Thumbnails Navigation (vertical on desktop, horizontal on mobile) */}
            <div className="lg:col-span-1 flex lg:flex-col gap-4 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
              {workItems.map((item, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`min-w-[200px] lg:min-w-0 p-4 rounded-xl border transition-all ${
                    activeIndex === index 
                      ? 'border-coalo-moss bg-white shadow-md' 
                      : 'border-transparent bg-white/50 hover:bg-white'
                  }`}
                >
                  <h4 className={`text-sm font-medium mb-1 ${
                    activeIndex === index ? 'text-coalo-moss' : 'text-coalo-stone'
                  }`}>
                    {item.title}
                  </h4>
                  <p className="text-xs text-coalo-stone/70 line-clamp-2">{item.description}</p>
                </button>
              ))}
            </div>
            
            {/* Featured Case Study */}
            <div className="lg:col-span-4 rounded-2xl overflow-hidden bg-white shadow-md">
              <div className="relative h-64 md:h-80 overflow-hidden">
                <img 
                  src={workItems[activeIndex].image} 
                  alt={workItems[activeIndex].title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6 text-white">
                    <h3 className="text-xl md:text-2xl font-semibold mb-2">{workItems[activeIndex].title}</h3>
                    <p className="text-white/80 text-sm md:text-base">{workItems[activeIndex].description}</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-coalo-earth mb-2">Results</h4>
                  <p className="text-coalo-stone">{workItems[activeIndex].results}</p>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <span className="inline-block px-3 py-1 bg-coalo-sand/30 rounded-full text-xs text-coalo-earth">Digital OOH</span>
                    <span className="inline-block px-3 py-1 bg-coalo-moss/20 rounded-full text-xs text-coalo-moss">AI-Driven</span>
                  </div>
                  
                  <a href="#contact" className="text-sm text-coalo-clay font-medium hover:underline">
                    Discuss a similar project →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
