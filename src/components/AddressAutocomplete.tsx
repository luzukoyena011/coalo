import React, { useEffect, useRef, useState } from 'react';
import { googleMapsLoader } from '../utils/googleMapsLoader';

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
  id?: string;
}

const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  required = false,
  placeholder = 'Enter address',
  className = '',
  id = 'address',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  useEffect(() => {
    // Load Google Maps API using the shared loader
    googleMapsLoader.load()
      .then(() => {
        setIsLoaded(true);
      })
      .catch(err => {
        console.error('Error loading Google Maps API:', err);
      });

    return () => {
      // Clean up autocomplete when component unmounts
      if (autocomplete) {
        // No direct way to destroy autocomplete, but we can remove listeners
        google.maps.event.clearInstanceListeners(autocomplete);
      }
    };
  }, [autocomplete]);

  useEffect(() => {
    // Initialize autocomplete once Google Maps is loaded and input ref is available
    if (isLoaded && inputRef.current && !autocomplete) {
      const autocompleteInstance = new google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['formatted_address']
      });

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place && place.formatted_address) {
          onChange(place.formatted_address);
        }
      });

      setAutocomplete(autocompleteInstance);
    }
  }, [isLoaded, inputRef, onChange, autocomplete]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Update the input value in the parent component
    onChange(e.target.value);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      id={id}
      value={value}
      onChange={handleInputChange}
      required={required}
      placeholder={placeholder}
      className={className}
      autoComplete="off" // Disable browser's native autocomplete
    />
  );
};

export default AddressAutocomplete;
