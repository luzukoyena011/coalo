
// Fake PDF generator function - in a real application, you would use a library like jsPDF
// This is a mock function for the demo
export const generateQuotePDF = (
  tier: 'standard' | 'pro' | 'premium',
  name: string,
  companyName: string
): string => {
  console.log(`Generating PDF quote for ${tier} tier, for ${name} from ${companyName}`);
  
  // Increment counter in localStorage
  const currentCount = localStorage.getItem('quoteCounter') || '0';
  localStorage.setItem('quoteCounter', (parseInt(currentCount) + 1).toString());
  
  // In a real application, return a download URL or Blob
  return 'quote.pdf';
};

// Get pricing details based on tier
export const getPricingDetails = (tier: 'standard' | 'pro' | 'premium') => {
  const pricing = {
    standard: {
      monthlyPrice: 10000,
      annualPrice: 102000,
      originalAnnualPrice: 120000,
      totalAnnual: 1224000,
    },
    pro: {
      monthlyPrice: 25000,
      annualPrice: 255000,
      originalAnnualPrice: 300000,
      totalAnnual: 3060000,
    },
    premium: {
      monthlyPrice: 45000,
      annualPrice: 459000,
      originalAnnualPrice: 540000,
      totalAnnual: 6108000,
    },
  };

  return pricing[tier];
};

// Format currency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 0,
  }).format(amount);
};
