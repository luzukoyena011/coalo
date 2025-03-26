
export interface NavItem {
  label: string;
  href: string;
}

export interface PriceTier {
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  description: string;
  features: string[];
  highlighted?: boolean;
}

export interface ServiceFeature {
  title: string;
  description: string;
  icon?: React.ReactNode;
}

export interface WorkItem {
  title: string;
  description: string;
  image: string;
  results: string;
}

export interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
  preferredContact: 'email' | 'phone';
}

export interface QuoteFormData {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  tier: 'standard' | 'pro' | 'premium';
  address: string;  // Added address field
  duration: number;  // Added duration field
}

export interface BillboardLocation {
  id: string;
  name: string;
  coordinates: [number, number]; // [latitude, longitude]
  trafficVolume: string;
}
