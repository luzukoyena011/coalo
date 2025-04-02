
import { useState } from 'react';
import { useRevealAnimation } from '../utils/animations';
import { BillboardLocation } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Map, Pin, MapPin } from 'lucide-react';

// Billboard locations data
const billboardLocations: BillboardLocation[] = [
  {
    id: 'loc1',
    name: 'Corner of Nelson Mandela Drive and Eli Spilken',
    coordinates: [-31.587, 28.783],
    trafficVolume: '2000 motorists per hour'
  },
  {
    id: 'loc2',
    name: 'Corner of Tudor Ndamase Ave and Errol Spring Ave',
    coordinates: [-31.592, 28.776],
    trafficVolume: '1750 motorists per hour'
  },
  {
    id: 'loc3',
    name: 'Madeira Street and York Road',
    coordinates: [-31.603, 28.790],
    trafficVolume: '1500 motorists per hour'
  },
  {
    id: 'loc4',
    name: 'Sutherland Street and Leeds Road',
    coordinates: [-31.589, 28.798],
    trafficVolume: '2200 motorists per hour'
  }
];

const CustomMapSection = () => {
  const [selectedLocation, setSelectedLocation] = useState<BillboardLocation | null>(null);
  const headerReveal = useRevealAnimation();
  const mapReveal = useRevealAnimation();

  const handleLocationChange = (locationId: string) => {
    const location = billboardLocations.find(loc => loc.id === locationId) || null;
    setSelectedLocation(location);
  };

  // Function to generate map URL with marker (in a real app, this would use a mapping API)
  const getMapImageUrl = (location: BillboardLocation) => {
    // This is a placeholder for demonstration - in a real app, you'd use Google Maps, Mapbox, etc.
    // The URL below is just an example and won't work as-is
    return `https://maps.googleapis.com/maps/api/staticmap?center=${location.coordinates[0]},${location.coordinates[1]}&zoom=15&size=600x400&markers=color:red%7C${location.coordinates[0]},${location.coordinates[1]}&key=YOUR_API_KEY`;
  };

  return (
    <section id="location" className="py-20 md:py-28 bg-white">
      <div className="container-custom">
        <div 
          ref={headerReveal.ref} 
          className={`text-center mb-16 transition-all duration-700 ${headerReveal.isIntersecting ? 'opacity-100' : 'opacity-0'}`}
        >
          <h2 className="section-title">Our Locations</h2>
          <p className="section-subtitle">
            Explore our strategic billboard placements across the city for maximum visibility.
          </p>
        </div>

        <div 
          ref={mapReveal.ref} 
          className={`transition-all duration-700 delay-300 ${mapReveal.isIntersecting ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
          <div className="bg-white rounded-xl shadow-sm border border-coalo-sand/10 overflow-hidden mb-8">
            <div className="p-6 border-b border-coalo-sand/10">
              <label htmlFor="location-select" className="block text-sm font-medium text-coalo-stone mb-2">
                Select Billboard Location
              </label>
              <Select 
                onValueChange={handleLocationChange}
                defaultValue=""
              >
                <SelectTrigger id="location-select" className="w-full">
                  <SelectValue placeholder="Choose a billboard location" />
                </SelectTrigger>
                <SelectContent>
                  {billboardLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      {location.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="h-96 bg-coalo-cream/10 relative">
              {selectedLocation ? (
                <>
                  {/* In a real app, this would be an interactive map */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-16 h-16 text-coalo-clay mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-coalo-stone mb-2">{selectedLocation.name}</h3>
                      <p className="text-coalo-stone/80 flex items-center justify-center gap-2">
                        <Map className="w-5 h-5" />
                        {selectedLocation.trafficVolume}
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-coalo-stone/60">
                    <Map className="w-16 h-16 mx-auto mb-4 opacity-40" />
                    <p>Select a billboard location to view on the map</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {billboardLocations.map((location) => (
              <div 
                key={location.id} 
                className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
                  selectedLocation?.id === location.id 
                    ? 'bg-coalo-moss/10 border-2 border-coalo-moss' 
                    : 'bg-white border border-coalo-sand/20 hover:border-coalo-moss/40'
                }`}
                onClick={() => handleLocationChange(location.id)}
              >
                <h4 className="font-medium text-coalo-stone mb-2 text-sm">{location.name}</h4>
                <p className="text-xs text-coalo-stone/70 flex items-center gap-1">
                  <Pin className="w-3 h-3" />
                  {location.trafficVolume}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomMapSection;
