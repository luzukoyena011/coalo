import { useState, useCallback, useEffect } from 'react';
import { useRevealAnimation } from '../utils/animations';
import { BillboardLocation } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Map as MapIcon, Pin, MapPin } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

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

// Map container styles
const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

// Default center (average of billboard locations)
const defaultCenter = {
  lat: -31.59275, // Average latitude
  lng: 28.78675   // Average longitude
};

const MapSection = () => {
  const [selectedLocation, setSelectedLocation] = useState<BillboardLocation | null>(null);
  const [selectedMarker, setSelectedMarker] = useState<BillboardLocation | null>(null);
  const [mapRef, setMapRef] = useState<google.maps.Map | null>(null);
  const headerReveal = useRevealAnimation();
  const mapReveal = useRevealAnimation();

  // Load Google Maps API
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''
  });

  const onMapLoad = useCallback((map: google.maps.Map) => {
    setMapRef(map);
  }, []);

  // Pan to selected location when it changes
  useEffect(() => {
    if (mapRef && selectedLocation) {
      mapRef.panTo({ 
        lat: selectedLocation.coordinates[0], 
        lng: selectedLocation.coordinates[1] 
      });
      mapRef.setZoom(16);
    }
  }, [selectedLocation, mapRef]);

  const handleLocationChange = (locationId: string) => {
    const location = billboardLocations.find(loc => loc.id === locationId) || null;
    setSelectedLocation(location);
  };

  const handleMarkerClick = (location: BillboardLocation) => {
    setSelectedMarker(location);
    if (mapRef) {
      mapRef.panTo({ 
        lat: location.coordinates[0], 
        lng: location.coordinates[1] 
      });
    }
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
              {loadError && (
                  <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-coalo-stone/60">
                    <p className="text-red-500">Error loading Google Maps. Please check your API key.</p>
                  </div>
                    </div>
              )}
              
              {!isLoaded && !loadError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-coalo-stone/60">
                    <p>Loading map...</p>
                  </div>
                </div>
              )}
              
              {isLoaded && !loadError && (
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={
                    selectedLocation 
                      ? { lat: selectedLocation.coordinates[0], lng: selectedLocation.coordinates[1] } 
                      : defaultCenter
                  }
                  zoom={selectedLocation ? 16 : 14}
                  options={{
                    mapTypeControl: false,
                    streetViewControl: false,
                    zoomControl: true,
                    fullscreenControl: false,
                    styles: [
                      {
                        featureType: "poi",
                        elementType: "labels",
                        stylers: [{ visibility: "off" }]
                      }
                    ]
                  }}
                  onLoad={onMapLoad}
                >
                  {billboardLocations.map((location) => (
                    <Marker
                      key={location.id}
                      position={{ 
                        lat: location.coordinates[0], 
                        lng: location.coordinates[1] 
                      }}
                      onClick={() => handleMarkerClick(location)}
                      icon={{
                        url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
                        scaledSize: new window.google.maps.Size(40, 40)
                      }}
                      animation={
                        selectedLocation?.id === location.id 
                          ? window.google.maps.Animation.BOUNCE 
                          : undefined
                      }
                    />
                  ))}
                  
                  {selectedMarker && (
                    <InfoWindow
                      position={{ 
                        lat: selectedMarker.coordinates[0], 
                        lng: selectedMarker.coordinates[1] 
                      }}
                      onCloseClick={() => setSelectedMarker(null)}
                    >
                      <div className="p-2">
                        <h3 className="font-medium text-sm mb-1">{selectedMarker.name}</h3>
                        <p className="text-xs text-gray-600">{selectedMarker.trafficVolume}</p>
                      </div>
                    </InfoWindow>
                  )}
                </GoogleMap>
              )}
              
              {!isLoaded && !selectedLocation && !loadError && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-coalo-stone/60">
                    <MapIcon className="w-16 h-16 mx-auto mb-4 opacity-40" />
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

export default MapSection;
