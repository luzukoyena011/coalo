
import { useEffect, useRef, useState } from 'react';
import { useRevealAnimation } from '../utils/animations';

declare global {
  interface Window {
    google: any;
  }
}

const MapSection = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const headerReveal = useRevealAnimation();

  useEffect(() => {
    // This is a simple implementation for demonstration purposes
    // In a real project, you would use the Google Maps JavaScript API properly
    const loadGoogleMaps = () => {
      if (!mapRef.current || mapLoaded) return;
      
      // Mock data - in a real project, you would load the actual Google Maps API
      console.log("Map would be loaded here with the Google Maps API");
      setMapLoaded(true);
      
      // Simulate map with a background image and overlay for now
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div class="relative w-full h-full rounded-xl overflow-hidden">
            <img src="https://maps.googleapis.com/maps/api/staticmap?center=Johannesburg,South+Africa&zoom=13&size=600x400&maptype=roadmap&markers=color:red%7CJohannesburg,South+Africa&key=YOUR_API_KEY" alt="Map of billboard location" class="w-full h-full object-cover" />
            <div class="absolute inset-0 flex items-center justify-center bg-coalo-stone/20 backdrop-blur-sm">
              <div class="text-center text-white p-6 glass-dark rounded-xl">
                <h3 class="text-xl font-semibold mb-2">Our Digital Billboard</h3>
                <p>Located in the heart of urban Johannesburg</p>
                <p class="mt-2 text-sm opacity-80">Interactive map would display here</p>
              </div>
            </div>
          </div>
        `;
      }
    };

    loadGoogleMaps();

    return () => {
      // Cleanup if needed
    };
  }, [mapLoaded]);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Our Location</h2>
          <p className="section-subtitle">
            Find our digital billboard in a prime location with high visibility and foot traffic.
          </p>
        </div>

        <div className="rounded-xl overflow-hidden shadow-lg h-[400px] md:h-[500px]" ref={mapRef}>
          <div className="w-full h-full bg-coalo-sand/30 flex items-center justify-center">
            <div className="animate-pulse text-coalo-earth">Loading map...</div>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-xl shadow-sm border border-coalo-sand/20">
            <h3 className="text-lg font-semibold text-coalo-stone mb-2">Location Details</h3>
            <p className="text-coalo-stone/80 text-sm">
              Our digital billboard is strategically positioned in a high-traffic area with excellent visibility from multiple vantage points.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-coalo-sand/20">
            <h3 className="text-lg font-semibold text-coalo-stone mb-2">Daily Impressions</h3>
            <p className="text-coalo-stone/80 text-sm">
              On average, our billboard receives over 25,000 daily views from diverse demographic groups, ensuring maximum exposure.
            </p>
          </div>
          
          <div className="p-6 bg-white rounded-xl shadow-sm border border-coalo-sand/20">
            <h3 className="text-lg font-semibold text-coalo-stone mb-2">Area Demographics</h3>
            <p className="text-coalo-stone/80 text-sm">
              The surrounding area features a mix of business professionals, shoppers, and local residents, offering broad audience reach.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
