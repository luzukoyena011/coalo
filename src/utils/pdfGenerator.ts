
// PDF generation utility for Coalō quote system
// In a real application, this would use a library like jsPDF or PDFMake

import { format } from 'date-fns';

export const generateQuotePDF = (
  tier: 'standard' | 'pro' | 'premium',
  name: string,
  companyName: string,
  duration: number = 1,
  isAnnual: boolean = true,
  address: string = ''
): string => {
  console.log(`Generating PDF quote for ${tier} tier, for ${name} from ${companyName}`);
  console.log(`Duration: ${duration} ${isAnnual ? 'years' : 'months'}, Address: ${address}`);
  
  // In a real application, this would create a PDF with the following structure:
  /* 
    HEADER
    - Coalō logo (left-aligned)
    - COALO (PTY) LTD (centered, uppercase)
    - Slogan (centered)
    - Address: 23 Wesley Street, The Hill, Mthatha, 5099
    - Contact: luzukoyena@gmail.com, +27 72 031 1487
    
    DETAILS
    - Date: [generation date]
    - Name: [customer name]
    - Company: [company name]
    - Address: [address]
    - Mobile Number: [phone]
    
    BODY (Table)
    - Description | Quantity | Cost
      - [plan name] | [duration] | [cost]
      - [feature 1]
      - [feature 2]
      - ...
    - Subtotal | | [amount]
    - VAT (15%) | | [amount]
    - Grand Total | | [amount]
    
    FOOTER
    - Banking Details:
      - BENEFICIARY NAME: [name]
      - BENEFICIARY BANK: [bank]
      - BENEFICIARY ACCOUNT NO: [account]
    
    - Terms and Conditions:
      - Payment terms
      - Quotation validity
      - Disclaimer
  */
  
  // Gather the data for the PDF
  const currentDate = format(new Date(), 'dd MMMM yyyy');
  const tierDetails = getTierDetails(tier);
  const pricing = getPricingDetails(tier);
  const unitPrice = isAnnual ? pricing.annualPrice : pricing.monthlyPrice;
  const subtotal = unitPrice * duration;
  const vat = subtotal * 0.15;
  const total = subtotal + vat;
  
  // Increment counter in localStorage to track quote generation
  const currentCount = localStorage.getItem('quoteCounter') || '0';
  const quoteNumber = `QUO-${new Date().getFullYear()}-${parseInt(currentCount) + 1}`;
  localStorage.setItem('quoteCounter', (parseInt(currentCount) + 1).toString());
  
  // In a real implementation, the following information would be used to generate the PDF
  const quoteData = {
    header: {
      company: 'COALO (PTY) LTD',
      slogan: 'Nurturing Brands, Uniting Communities',
      address: '23 Wesley Street, The Hill, Mthatha, 5099',
      email: 'luzukoyena@gmail.com',
      phone: '+27 72 031 1487',
    },
    details: {
      quoteNumber,
      date: currentDate,
      customerName: name,
      companyName,
      address,
    },
    items: {
      description: `${tierDetails.name} Plan - ${isAnnual ? 'Annual' : 'Monthly'} Billing`,
      features: tierDetails.features,
      quantity: `${duration} ${isAnnual ? 'years' : 'months'}`,
      unitPrice,
      subtotal,
      vat,
      total,
    },
    bankingDetails: {
      beneficiaryName: 'COALO (PTY) LTD',
      bank: 'FIRST NATIONAL BANK',
      accountNumber: '123456789',
      branch: 'Mthatha',
      branchCode: '250655',
    },
    termsAndConditions: {
      payment: 'Payment due within 14 days of invoice date.',
      validity: 'This quotation is valid for 30 days from the date of issue.',
      disclaimer: 'All prices are inclusive of VAT. This quote is subject to our standard terms and conditions.'
    }
  };
  
  console.log('Quote data prepared:', quoteData);
  
  // In a real app, we would generate and return a PDF file/URL here
  // For this demo, we just return a placeholder
  return `${quoteNumber}.pdf`;
};

// Get tier details
const getTierDetails = (tier: 'standard' | 'pro' | 'premium') => {
  const tierDetails = {
    standard: {
      name: 'Standard',
      features: [
        '10-second advert',
        'Fixed scheduling',
        'Static images only',
        'Moderate cycle frequency',
        'Basic analytics'
      ]
    },
    pro: {
      name: 'Pro',
      features: [
        '20-second advert',
        'Enhanced scheduling flexibility',
        'Mix of static and limited dynamic content',
        'Higher cycle frequency',
        'Detailed analytics dashboard',
        'Email support'
      ]
    },
    premium: {
      name: 'Premium',
      features: [
        '45-second advert',
        'Unlimited cycles per day',
        'Full creative freedom (video, dynamic or static)',
        'AI-driven input',
        'QR code discounts for first 100 customers',
        '24/7 dedicated support',
        'Customizable campaigns'
      ]
    }
  };

  return tierDetails[tier];
};

// Get pricing details based on tier
export const getPricingDetails = (tier: 'standard' | 'pro' | 'premium') => {
  const pricing = {
    standard: {
      monthlyPrice: 8500,
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
