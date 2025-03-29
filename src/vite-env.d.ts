
/// <reference types="vite/client" />

// Google Maps API types
declare namespace google {
  namespace maps {
    class LatLng {
      constructor(lat: number, lng: number);
      lat(): number;
      lng(): number;
    }

    class LatLngBounds {
      constructor(sw?: LatLng, ne?: LatLng);
      extend(point: LatLng): LatLngBounds;
    }

    namespace places {
      class Autocomplete {
        constructor(
          inputField: HTMLInputElement,
          opts?: AutocompleteOptions
        );
        addListener(eventName: string, handler: Function): void;
        getPlace(): AutocompletePlace;
      }

      interface AutocompleteOptions {
        bounds?: LatLngBounds;
        componentRestrictions?: { country: string | string[] };
        fields?: string[];
        strictBounds?: boolean;
        types?: string[];
      }

      interface AutocompletePlace {
        address_components?: Array<{
          long_name: string;
          short_name: string;
          types: string[];
        }>;
        formatted_address?: string;
        geometry?: {
          location: LatLng;
          viewport: LatLngBounds;
        };
        name?: string;
        place_id?: string;
      }
    }

    class Map {
      constructor(mapDiv: Element, opts?: MapOptions);
    }

    interface MapOptions {
      center?: LatLng | LatLngLiteral;
      zoom?: number;
    }

    interface LatLngLiteral {
      lat: number;
      lng: number;
    }

    namespace event {
      function clearInstanceListeners(instance: object): void;
    }
  }
}
