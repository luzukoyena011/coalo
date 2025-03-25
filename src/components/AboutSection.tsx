
import { useRevealAnimation } from '../utils/animations';

const AboutSection = () => {
  const mainReveal = useRevealAnimation();
  const imageReveal = useRevealAnimation();
  const contentReveal = useRevealAnimation();

  return (
    <section id="about" className="py-20 md:py-28 bg-coalo-cream/20">
      <div className="container-custom">
        <div 
          ref={mainReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${mainReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Who Are We</h2>
          <p className="section-subtitle">
            Our mission is to revolutionize digital outdoor advertising, creating meaningful connections between brands and communities.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div 
            ref={imageReveal.ref} 
            className={`relative transition-all duration-700 delay-300 ${imageReveal.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625" 
                alt="Coalō office building" 
                className="w-full h-auto rounded-2xl shadow-md"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-coalo-moss/30 to-transparent"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 p-6 rounded-xl glass">
              <p className="text-coalo-stone font-medium">
                <span className="block text-2xl font-semibold text-coalo-clay mb-1">Coalō</span>
                <span className="text-sm text-coalo-earth">Latin: "to nurture"</span>
              </p>
            </div>
          </div>

          <div 
            ref={contentReveal.ref} 
            className={`space-y-6 transition-all duration-700 delay-500 ${contentReveal.isIntersecting ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}
          >
            <h3 className="text-2xl md:text-3xl font-display font-semibold text-coalo-stone">Our Story</h3>
            <p className="text-coalo-stone/90">
              The name "Coalō" derives from the Latin word meaning "to nurture" and resonates with the Kwalo clan, 
              symbolizing our commitment to nurturing both brands and communities through thoughtful advertising.
            </p>
            <p className="text-coalo-stone/90">
              Founded on principles of innovation and community connection, we've developed an AI-driven approach to outdoor 
              advertising that transforms how brands engage with audiences in urban spaces.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
              <div className="p-5 rounded-xl bg-white/70 border border-coalo-sand/30">
                <h4 className="font-semibold text-coalo-clay mb-2">Our Mission</h4>
                <p className="text-sm text-coalo-stone/80">To create advertising experiences that add value to communities while helping brands grow authentically.</p>
              </div>
              <div className="p-5 rounded-xl bg-white/70 border border-coalo-sand/30">
                <h4 className="font-semibold text-coalo-clay mb-2">Our Vision</h4>
                <p className="text-sm text-coalo-stone/80">A world where outdoor advertising strengthens community bonds and enables sustainable brand growth.</p>
              </div>
            </div>
            
            <div className="pt-4">
              <a href="#quote" className="btn-primary">
                Start Your Journey With Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
