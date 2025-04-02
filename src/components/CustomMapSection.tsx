import { useState, useRef, useEffect } from 'react';
import { useRevealAnimation } from '../utils/animations';
import { BillboardLocation } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Map as MapIcon, Pin, MapPin } from 'lucide-react';
import { googleMapsLoader } from '../utils/googleMapsLoader';

// Define Google Maps types directly
declare global {
  interface Window {
    google: typeof google;
  }
}

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
  const [mapLoaded, setMapLoaded] = useState(false);
  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const [currentMarker, setCurrentMarker] = useState<google.maps.marker.AdvancedMarkerElement | google.maps.Marker | null>(null);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const headerReveal = useRevealAnimation();
  const mapReveal = useRevealAnimation();

  // Initialize Google Maps API
  useEffect(() => {
    const initMap = async () => {
      try {
        // Use the shared loader instead of creating a new one
        await googleMapsLoader.load();
        setMapLoaded(true);
      } catch (error) {
        console.error("Error loading Google Maps API:", error);
      }
    };

    initMap();
  }, []);

  // Create or update the map when a location is selected
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !selectedLocation || !window.google) return;

    const { coordinates } = selectedLocation;
    const position = { lat: coordinates[0], lng: coordinates[1] };

    // If map doesn't exist yet, create it
    if (!googleMap) {
      const map = new window.google.maps.Map(mapRef.current, {
        center: position,
        zoom: 15,
        mapTypeControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        zoomControl: true
      });
      setGoogleMap(map);
      
      // Create standard marker first - simpler and more reliable
      const marker = new window.google.maps.Marker({
        position,
        map,
        title: selectedLocation.name
      });
      setCurrentMarker(marker);
      
      // Add info window for the marker
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${selectedLocation.name}</h3>
            <p>${selectedLocation.trafficVolume}</p>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });
      
      // Automatically open info window
      infoWindow.open(map, marker);
    } else {
      // Update the existing map
      googleMap.setCenter(position);
      
      // Remove existing marker
      if (currentMarker) {
        // Handle both marker types
        if ('setMap' in currentMarker) {
          currentMarker.setMap(null);
        } else if ('map' in currentMarker) {
          currentMarker.map = null;
        }
      }
      
      // Create standard marker - simpler and more reliable
      const marker = new window.google.maps.Marker({
        position,
        map: googleMap,
        title: selectedLocation.name
      });
      setCurrentMarker(marker);
      
      // Add info window for standard marker
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <h3 style="font-weight: bold; margin-bottom: 5px;">${selectedLocation.name}</h3>
            <p>${selectedLocation.trafficVolume}</p>
          </div>
        `
      });
      
      marker.addListener('click', () => {
        infoWindow.open(googleMap, marker);
      });
      
      // Automatically open info window
      infoWindow.open(googleMap, marker);
    }
  }, [selectedLocation, mapLoaded, googleMap]);

  // Clean up Google Maps instances on unmount
  useEffect(() => {
    return () => {
      if (currentMarker) {
        // Handle both marker types
        if ('setMap' in currentMarker) {
          currentMarker.setMap(null);
        } else if ('map' in currentMarker) {
          currentMarker.map = null;
        }
      }
      setGoogleMap(null);
    };
  }, []); // We want this to run only on unmount

  const handleLocationChange = (locationId: string) => {
    const location = billboardLocations.find(loc => loc.id === locationId) || null;
    setSelectedLocation(location);
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
              {/* Google Maps container */}
              <div 
                ref={mapRef} 
                className="w-full h-full"
                style={{ display: selectedLocation && mapLoaded ? 'block' : 'none' }}
              />
              
              {/* Placeholder when no location is selected */}
              {!selectedLocation && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-coalo-stone/60">
                    <MapIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
                    <p>Select a billboard location to view on the map</p>
                  </div>
                </div>
              )}
              
              {/* Loading indicator when location is selected but map isn't loaded */}
              {selectedLocation && !mapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-12 h-12 border-4 border-coalo-moss/30 border-t-coalo-moss rounded-full animate-spin mb-4 mx-auto"></div>
                    <p className="text-coalo-stone">Loading map...</p>
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
