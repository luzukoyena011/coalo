
import { useEffect, useRef, useState } from 'react';
import { useRevealAnimation } from '../utils/animations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MapPin } from 'lucide-react';

declare global {
  interface Window {
    google: any;
  }
}

// Billboard location data
const billboardLocations = [
  {
    id: 'location1',
    name: 'Corner of Nelson Mandela Drive and Eli Spilken',
    traffic: '2000 motorists per hour',
    coordinates: { lat: -33.924, lng: 18.424 } // Example coordinates for Cape Town
  },
  {
    id: 'location2',
    name: 'Corner of Tudor Ndamase Ave and Errol Spring Ave',
    traffic: '1750 motorists per hour',
    coordinates: { lat: -26.204, lng: 28.047 } // Example coordinates for Johannesburg
  },
  {
    id: 'location3',
    name: 'Main Road and Station Street Junction',
    traffic: '3200 motorists per hour',
    coordinates: { lat: -29.857, lng: 31.025 } // Example coordinates for Durban
  }
];

const MapSection = () => {
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(billboardLocations[0]);
  const mapRef = useRef<HTMLDivElement>(null);
  const headerReveal = useRevealAnimation();

  const handleLocationChange = (locationId: string) => {
    const location = billboardLocations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      updateMapLocation(location);
    }
  };

  const updateMapLocation = (location: typeof billboardLocations[0]) => {
    if (!mapRef.current || !mapLoaded) return;
    
    // In a real project, this would update the map to center on the selected location
    // For now, we'll just update the static map content
    mapRef.current.innerHTML = `
      <div class="relative w-full h-full rounded-xl overflow-hidden">
        <img src="https://maps.googleapis.com/maps/api/staticmap?center=${location.coordinates.lat},${location.coordinates.lng}&zoom=15&size=600x400&maptype=roadmap&markers=color:red%7C${location.coordinates.lat},${location.coordinates.lng}&key=YOUR_API_KEY" alt="Map of billboard location" class="w-full h-full object-cover" />
        <div class="absolute inset-0 flex items-center justify-center bg-coalo-stone/20 backdrop-blur-sm">
          <div class="text-center text-white p-6 glass-dark rounded-xl">
            <h3 class="text-xl font-semibold mb-2">${location.name}</h3>
            <p class="mb-2">Located in a prime urban area</p>
            <p class="flex items-center justify-center gap-2 text-coalo-sand mt-2">
              <span class="inline-block w-2 h-2 bg-coalo-sand rounded-full"></span>
              ${location.traffic}
            </p>
          </div>
        </div>
      </div>
    `;
  };

  useEffect(() => {
    // This is a simple implementation for demonstration purposes
    // In a real project, you would use the Google Maps JavaScript API properly
    const loadGoogleMaps = () => {
      if (!mapRef.current || mapLoaded) return;
      
      // Mock data - in a real project, you would load the actual Google Maps API
      console.log("Map would be loaded here with the Google Maps API");
      setMapLoaded(true);
      
      // Initialize with the first location
      updateMapLocation(selectedLocation);
    };

    loadGoogleMaps();

    return () => {
      // Cleanup if needed
    };
  }, [mapLoaded, selectedLocation]);

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-10 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Our Location</h2>
          <p className="section-subtitle">
            Find our digital billboard in a prime location with high visibility and foot traffic.
          </p>
        </div>

        <div className="mb-6">
          <label htmlFor="location-select" className="text-coalo-stone font-medium mb-2 block">
            Select Billboard Location
          </label>
          <Select 
            onValueChange={handleLocationChange}
            defaultValue={selectedLocation.id}
          >
            <SelectTrigger className="w-full md:w-[450px] bg-white">
              <SelectValue placeholder="Select a billboard location" />
            </SelectTrigger>
            <SelectContent>
              {billboardLocations.map(location => (
                <SelectItem key={location.id} value={location.id}>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-coalo-moss" />
                    {location.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-coalo-stone/70 mt-2">
            Traffic at selected location: <span className="font-medium text-coalo-stone">{selectedLocation.traffic}</span>
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
