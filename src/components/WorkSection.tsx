
import { useRevealAnimation } from '../utils/animations';
import { WorkItem } from '../types';

const workItems: WorkItem[] = [
  {
    title: "GreenLife Supermarkets",
    description: "A targeted campaign focusing on sustainable products and locally sourced produce.",
    image: "https://images.unsplash.com/photo-1543168256-418811576931",
    results: "Increased foot traffic by 32% and boosted sales of featured products by 28%."
  },
  {
    title: "TechNow Electronics",
    description: "Dynamic advertisement showcasing the latest smartphone releases with interactive QR codes.",
    image: "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3",
    results: "Generated 5,000+ QR code scans and increased website visits by 45% during the campaign period."
  },
  {
    title: "Urban Fitness Collective",
    description: "Time-targeted ads promoting gym membership discounts during commuting hours.",
    image: "https://images.unsplash.com/photo-1571902943202-507ec2618538",
    results: "Achieved 120 new membership sign-ups directly attributed to the billboard campaign."
  },
];

const WorkSection = () => {
  const headerReveal = useRevealAnimation();
  const itemsReveal = useRevealAnimation();

  return (
    <section id="work" className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Previous Work</h2>
          <p className="section-subtitle">
            Explore some of our successful campaigns and the results they've achieved for our clients.
          </p>
        </div>

        <div 
          ref={itemsReveal.ref}
          className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 delay-300 ${itemsReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          {workItems.map((item, index) => (
            <div key={index} className="rounded-xl overflow-hidden shadow-md border border-coalo-sand/10 bg-white hover:shadow-lg transition-shadow">
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-coalo-stone mb-2">{item.title}</h3>
                <p className="text-coalo-stone/80 mb-4">{item.description}</p>
                <div className="bg-coalo-cream/30 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-coalo-earth mb-1">Results</h4>
                  <p className="text-coalo-stone">{item.results}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a href="#quote" className="btn-primary">
            Start Your Campaign
          </a>
        </div>
      </div>
    </section>
  );
};

export default WorkSection;
