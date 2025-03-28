
// src/components/QuoteSection.tsx (Illustrative Example - ADAPT TO YOUR CODE)

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

// --- Assume these UI components exist (replace with your actual imports) ---
import { Button } from "@/components/ui/button"; // Example
import { Input } from "@/components/ui/input";   // Example
import { Label } from "@/components/ui/label";   // Example
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Example
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"; // Example
// -----------------------------------------------------------------------

import { generateQuotePDF } from '../utils/pdfGenerator'; // Adjust path if needed

// Define type for form data state
interface QuoteFormData {
  name: string;
  companyName: string;
  phone: string;
  address: string; // This will hold the autocomplete result
  tier: 'standard' | 'pro' | 'premium';
  duration: number;
  isAnnual: boolean;
}

function QuoteSection() {
  // State for the form data
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    companyName: '',
    phone: '',
    address: '',
    tier: 'standard',
    duration: 1, // Default duration
    isAnnual: true, // Default billing cycle
  });

  // State for Google Maps script loading
  const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false);

  // Refs for Autocomplete
  const addressInputRef = useRef<HTMLInputElement>(null); // Ref for the address input element
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null); // Ref for the Autocomplete instance

  // --- Google Script Loader Effect ---
  useEffect(() => {
    const loader = new Loader({
      apiKey: "YOUR_GOOGLE_API_KEY", // <<<--- PASTE YOUR API KEY HERE
      version: "weekly",
      libraries: ["places"], // Specify the 'places' library
    });

    loader.load().then(() => {
      console.log("Google Maps script loaded.");
      setIsGoogleScriptLoaded(true);
    }).catch(e => {
      console.error("Error loading Google Maps script:", e);
      // Handle script loading error (e.g., show message to user)
    });
  }, []); // Runs once on component mount

  // --- Initialize Autocomplete Effect ---
  useEffect(() => {
    // Run only after script is loaded AND the input element exists AND autocomplete isn't already attached
    if (isGoogleScriptLoaded && addressInputRef.current && !autocompleteRef.current) {
      // Create the Autocomplete instance
      const autocomplete = new window.google.maps.places.Autocomplete(
        addressInputRef.current,
        {
          types: ['address'], // Suggest only full street addresses
          componentRestrictions: { country: 'za' }, // Restrict to South Africa
          fields: ['formatted_address'], // Get the formatted address string
        }
      );
      autocompleteRef.current = autocomplete; // Store instance

      // Add listener for when the user selects a place
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        console.log("Place Selected by Autocomplete:", place);

        if (place && place.formatted_address) {
          // Update the address in the form state
          setFormData(prev => ({
            ...prev,
            address: place.formatted_address || ''
          }));
        } else {
          console.log('Autocomplete selection did not provide formatted address.');
          // Keep manually typed text if selection fails? Optional.
          // setFormData(prev => ({ ...prev, address: addressInputRef.current?.value || '' }));
        }
      });
    }

    // Optional cleanup (might be needed depending on component lifecycle)
    // return () => {
    //   if (autocompleteRef.current) {
    //     // Attempts to remove listeners associated with the autocomplete instance
    //     window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
    //     console.log("Autocomplete listeners cleared.");
    //   }
    // };

  }, [isGoogleScriptLoaded]); // Dependency: Re-run if script load status changes


  // --- Form Input Change Handler ---
  // Adapt this to how you handle state changes (e.g., if using react-hook-form)
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleRadioChange = useCallback((name: string, value: string) => {
      if (name === 'billingCycle') {
          setFormData(prev => ({ ...prev, isAnnual: value === 'annual' }));
      } else if (name === 'duration') {
          // Assuming radio buttons for duration like '1', '6', '12' months/years
          setFormData(prev => ({ ...prev, duration: parseInt(value, 10) || 1 }));
      } else {
         setFormData(prev => ({ ...prev, [name]: value }));
      }
  }, []);


  // --- Form Submission Handler ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting Form Data:", formData); // Debug: Check data before sending

    // Validate required fields (add more validation as needed)
    if (!formData.name || !formData.phone || !formData.address) {
        alert("Please fill in Name, Phone, and Address.");
        return;
    }

    // Call the PDF generator function with the current form state
    generateQuotePDF(
      formData.tier,
      formData.name,
      formData.companyName,
      formData.phone, // Pass the phone string
      formData.duration, // Pass the duration number
      formData.isAnnual,
      formData.address // Pass the address string (potentially from Autocomplete)
    );
  };

  // --- JSX Structure (Example - Adapt to your UI) ---
  return (
    <section id="get-quote" className="py-12 md:py-24"> {/* Example section */}
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Get Your Quote</h2>
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Company Name (Optional) */}
          <div>
            <Label htmlFor="companyName">Company Name (Optional)</Label>
            <Input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleInputChange}
            />
          </div>

          {/* Phone */}
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel" // Use type="tel" for phone numbers
              value={formData.phone}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Address with Autocomplete */}
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              ref={addressInputRef} // Attach the ref here
              id="address"
              name="address"
              type="text"
              placeholder="Start typing your address..."
              value={formData.address} // Controlled by state
              onChange={handleInputChange} // Handles manual typing
              required
              disabled={!isGoogleScriptLoaded} // Optionally disable until script loads
            />
             {!isGoogleScriptLoaded && <p className="text-xs text-muted-foreground">Loading address suggestions...</p>}
          </div>

          {/* Tier Selection (Example using Select) */}
           <div>
             <Label htmlFor="tier">Select Plan</Label>
             <Select
                name="tier"
                value={formData.tier}
                onValueChange={(value) => handleSelectChange('tier', value)}
             >
               <SelectTrigger id="tier">
                 <SelectValue placeholder="Select a plan" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="standard">Standard</SelectItem>
                 <SelectItem value="pro">Pro</SelectItem>
                 <SelectItem value="premium">Premium</SelectItem>
               </SelectContent>
             </Select>
           </div>

          {/* Billing Cycle (Example using RadioGroup) */}
           <div>
                <Label>Billing Cycle</Label>
                <RadioGroup
                    name="billingCycle"
                    value={formData.isAnnual ? 'annual' : 'monthly'}
                    onValueChange={(value) => handleRadioChange('billingCycle', value)}
                    className="flex space-x-4 mt-2"
                >
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="monthly" id="monthly" />
                        <Label htmlFor="monthly">Monthly</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <RadioGroupItem value="annual" id="annual" />
                        <Label htmlFor="annual">Annual (Save ~15%)</Label>
                    </div>
                </RadioGroup>
           </div>

           {/* Duration (Example - adapt based on how user selects duration) */}
           <div>
               <Label htmlFor="duration">Duration ({formData.isAnnual ? 'Years' : 'Months'})</Label>
               <Input
                   id="duration"
                   name="duration"
                   type="number"
                   min="1"
                   value={formData.duration}
                   onChange={handleInputChange} // Ensure this updates duration number
                   required
               />
           </div>


          {/* Submit Button */}
          <Button type="submit" className="w-full">
            Generate Quote PDF
          </Button>
        </form>
      </div>
    </section>
  );
}

export default QuoteSection;