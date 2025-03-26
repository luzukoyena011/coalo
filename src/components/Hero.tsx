
import { useRevealAnimation } from '../utils/animations';

const Hero = () => {
  const { ref, isIntersecting } = useRevealAnimation();

  return (
    <section 
      id="home" 
      className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden"
      ref={ref}
    >
      {/* Overlay Background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-transparent to-background/90 absolute inset-0 z-10"></div>
        <img 
          src="/images/treebillboard.png" 
          alt="Coalō digital billboard" 
          className="w-full h-full object-cover object-center"
        />
      </div>
      
      <div className="container-custom relative z-10">
        <div className={`max-w-3xl transition-all duration-1000 ease-out ${isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-coalo-sand/30 backdrop-blur-sm border border-coalo-sand/50">
            <p className="text-sm font-medium text-coalo-earth">Innovative Digital OOH Advertising</p>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-semibold mb-6 text-white leading-tight">
            Coalō: <span className="text-gradient">Nurturing Brands</span>, <br className="hidden md:block" />
            Uniting Communities
          </h1>
          
          <p className="text-lg md:text-xl text-white/80 mb-8 max-w-2xl">
            We combine AI-driven technology with strategic outdoor advertising to foster growth and meaningful connections in urban spaces.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#quote" className="btn-primary text-center">
              Get a Quote
            </a>
            <a href="#about" className="btn-outline text-coalo-moss hover:bg-white/10 text-center">
              Learn More
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-2 text-white/70">
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center">
          <span className="block w-1 h-2 bg-white/50 rounded-full mt-2 animate-float"></span>
        </div>
        <span className="text-sm">Scroll down</span>
      </div>
    </section>
  );
};

export default Hero;
