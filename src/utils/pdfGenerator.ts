
// PDF generation utility for Coalō quote system
// In a real application, this would use a library like jsPDF or PDFMake

import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateQuotePDF = (
  tier: 'standard' | 'pro' | 'premium',
  name: string,
  companyName: string,
  phone: string, // Ensure this is added
  duration: number = 1,
  isAnnual: boolean = true,
  address: string = ''
): void => 

{
  // --- Data Preparation ---
  // (Same data preparation as before - ensure helpers are correct)
  const currentDate = format(new Date(), 'dd MMMM yyyy'); // Use format from template
  const tierDetails = getTierDetails(tier);
  const pricing = getPricingDetails(tier);
  const unitPrice = isAnnual ? pricing.annualPrice : pricing.monthlyPrice;
  // NOTE: Template uses 'Unit cost' for the price of ONE unit (month/year).
  // If your pricing.annualPrice/monthlyPrice is already for the *total duration*,
  // you might need to calculate the single unit price here. Assuming it's per unit:
  const lineItemCost = unitPrice * duration; // Cost for this line item duration
  const subtotal = lineItemCost; // Assuming only one line item for the plan
  const vatRate = 0.15; // 15% VAT for South Africa
  const vatAmount = subtotal * vatRate;
  const total = subtotal + vatAmount;

  const currentCount = localStorage.getItem('quoteCounter') || '0';
  const quoteNumber = `QUO-${new Date().getFullYear()}-${parseInt(currentCount) + 1}`; // Match template format if needed, e.g., #0001
  localStorage.setItem('quoteCounter', (parseInt(currentCount) + 1).toString());

  // --- PDF Generation Initialization ---
  const doc = new jsPDF();
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  const leftMargin = 15;
  const rightMargin = pageWidth - 15;
  let currentY = 20; // Starting Y position

  // --- 1. HEADER ---
  // Coalo Logo (Left)
  const logoUrl = '/images/coalo97x30quo.webp';
  const logoWidthPt = 73; // Approx 97.1px
  const logoHeightPt = 23; // Approx 30.7px
  try {
    doc.addImage(logoUrl, 'WEBP', leftMargin, currentY, logoWidthPt, logoHeightPt);
  } catch (e) {
    console.error("Error adding logo image:", e);
    doc.setFontSize(8).text("Logo Error", leftMargin, currentY + 10);
  }

  // Coalo Contact Info (Below Logo)
  let leftColY = currentY + logoHeightPt + 5;
  doc.setFontSize(10).setFont(undefined, 'normal');
  doc.text('COALO (PTY) LTD', leftMargin, leftColY); // Use your company details
  leftColY += 5;
  doc.text('23 Wesley Street, The Hill, Mthatha, 5099', leftMargin, leftColY);
  leftColY += 5;
  doc.text(`T: +27 72 031 1487`, leftMargin, leftColY);
  leftColY += 5;
  doc.text(`E: luzukoyena@gmail.com`, leftMargin, leftColY);
  // Add VAT Number if applicable
  // leftColY += 5;
  // doc.text(`VAT Reg: YOUR_VAT_NUMBER`, leftMargin, leftColY);


  // "QUOTE" Heading, Number, Date (Right)
  let rightColX = rightMargin;
  doc.setFontSize(18).setFont(undefined, 'bold');
  doc.text('QUOTE', rightColX, currentY + 5, { align: 'right' }); // Use "QUOTE"
  doc.setFontSize(10).setFont(undefined, 'normal');
  doc.text(`Quote no. ${quoteNumber}`, rightColX, currentY + 15, { align: 'right' });
  doc.text(`Date ${currentDate}`, rightColX, currentY + 20, { align: 'right' });

  // --- 2. Billed To Section ---
  // Position below the left column info
  currentY = leftColY + 15; // Add space
  doc.setFont(undefined, 'bold');
  doc.text('Billed to', leftMargin, currentY);
  currentY += 6;
  doc.setFont(undefined, 'normal');
  doc.text(name, leftMargin, currentY);
  currentY += 5;
  if (companyName) {
      doc.text(companyName, leftMargin, currentY);
      currentY += 5;
  }
  doc.text(address || 'N/A', leftMargin, currentY); // Might need multi-line handling if long
  currentY += 5;
  doc.text(phone, leftMargin, currentY);
  currentY += 15; // Space before table

  // --- 3. BODY (Table) ---
  // **FIXED**: Prepare clean data for the table
  const tableColumn = ["Service description", "Qty", "Unit cost (ZAR)"]; // Match template headings
  const tableRows: (string | number)[][] = [];

  const quantity = duration; // Simple quantity
  // Format the quantity (e.g., "01", "12") - jsPDF-AutoTable usually treats numbers correctly
  // const formattedQuantity = duration.toString().padStart(2, '0'); // Example if padding needed

  // **FIXED**: Add ONLY the main plan item, not features here
  tableRows.push([
    `${tierDetails.name} Plan (${isAnnual ? 'Annual' : 'Monthly'} Billing)`, // Description
    quantity, // Quantity
    formatCurrency(unitPrice) // Unit cost for ONE month/year
  ]);

  // --- Generate Main Table ---
  autoTable(doc, {
    startY: currentY,
    head: [tableColumn],
    body: tableRows,
    theme: 'plain', // Match template (no grid lines except header bottom)
    headStyles: {
      fillColor: [255, 255, 255], // White background
      textColor: [0, 0, 0], // Black text
      fontStyle: 'bold',
      lineWidth: { bottom: 0.5 }, // Line below header
      lineColor: [0, 0, 0],
    },
    styles: { fontSize: 10, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 'auto' }, // Description column
      1: { cellWidth: 20, halign: 'right' }, // Qty column
      2: { cellWidth: 40, halign: 'right' }  // Unit cost column
    },
    didDrawPage: function (data) {
      // Update Y position for content after the table
      currentY = data.cursor?.y ?? currentY;
    }
  });

  currentY += 5; // Space after table

  // --- 4. TOTALS Section ---
  // Create a separate small table or use text alignment for totals, aligned right
  const totalsStartX = pageWidth / 2 + 10; // Start totals table/text past the middle
  const totalsEndX = rightMargin;

  // Simple text alignment method:
  doc.setFontSize(10);
  doc.text('Subtotal', totalsStartX, currentY, { align: 'left' });
  doc.text(formatCurrency(subtotal), totalsEndX, currentY, { align: 'right' });
  currentY += 6;
  doc.text(`Tax/VAT (${vatRate * 100}%)`, totalsStartX, currentY, { align: 'left' });
  doc.text(formatCurrency(vatAmount), totalsEndX, currentY, { align: 'right' });
  currentY += 6;
  doc.setFont(undefined, 'bold'); // Make total bold
  doc.text('TOTAL', totalsStartX, currentY, { align: 'left' });
  doc.text(formatCurrency(total), totalsEndX, currentY, { align: 'right' });
  currentY += 15; // Space after totals

  // --- 5. FOOTER ---
  // Place footer elements near the bottom of the page
  const footerY = pageHeight - 35; // Adjust this value to position footer
  currentY = footerY;

  doc.setFontSize(9).setFont(undefined, 'normal');
  doc.text('Payment Information', leftMargin, currentY);
  // Add Coalo's VAT number here if applicable, similar to template's Tax Reg No.
  doc.text(`VAT Registration: YOUR_VAT_NUMBER`, rightMargin, currentY, { align: 'right'});
  currentY += 5;
  doc.text(`Bank name: ${getBankingDetails().bank}`, leftMargin, currentY); // Use helper
  currentY += 5;
  doc.text(`Account number: ${getBankingDetails().accountNumber}`, leftMargin, currentY);
  currentY += 5;
  // doc.text(`Routing code: ${getBankingDetails().branchCode}`, leftMargin, currentY); // Routing code isn't standard in SA, use Branch code if needed

  currentY = footerY + 5; // Reset Y slightly for second column of footer text
  doc.setFontSize(8); // Smaller text for terms/disclaimer
  doc.text('Terms:', rightMargin - 70, currentY, {align: 'left', maxWidth: 70}); // Adjust X and maxWidth
  currentY += 4;
  doc.text(`Quote valid for 30 days.`, rightMargin - 70, currentY, {align: 'left', maxWidth: 70});
  currentY += 4;
  doc.text(`Payment due within 14 days.`, rightMargin - 70, currentY, {align: 'left', maxWidth: 70});
  currentY += 6;
  doc.text('Disclaimer:', rightMargin - 70, currentY, {align: 'left', maxWidth: 70});
  currentY += 4;
  // Combine disclaimer parts - adjust wording as needed
  doc.text(`This quote is provided for informational purposes only and subject to change. E&OE. Subject to standard T&Cs.`, rightMargin - 70, currentY, {align: 'left', maxWidth: 70});


  // --- 6. Trigger Download ---
  doc.save(`${quoteNumber}.pdf`);
};

// --- Helper Functions (Keep/Update these at the bottom) ---

const getTierDetails = (tier: 'standard' | 'pro' | 'premium') => {
  // ... Your existing implementation ...
  // Make sure the names and features are correct.
  const tiers = {
    standard: { name: 'Standard', features: ['10-second advert', /* ... */] },
    pro: { name: 'Pro', features: ['20-second advert', /* ... */] },
    premium: { name: 'Premium', features: ['45-second advert', /* ... */] }
  };
  return tiers[tier] || tiers.standard;
};

export const getPricingDetails = (tier: 'standard' | 'pro' | 'premium') => {
  // ... Your existing implementation ...
  // Verify these prices are correct for ONE unit (month/year)
  const pricing = {
    standard: { monthlyPrice: 10000, annualPrice: 102000, /* ... */ },
    pro: { monthlyPrice: 25000, annualPrice: 255000, /* ... */ },
    premium: { monthlyPrice: 45000, annualPrice: 459000, /* ... */ }
  };
  return pricing[tier] || pricing.standard;
};

export const formatCurrency = (amount: number): string => {
  // ... Your existing implementation ...
  // Ensure it formats correctly, e.g., R 10,000.00
   return new Intl.NumberFormat('en-ZA', {
     style: 'currency',
     currency: 'ZAR',
     minimumFractionDigits: 2, // Use 2 decimal places like standard invoices
   }).format(amount);
};

// **NEW**: Helper for banking details - FILL WITH YOUR ACTUAL DETAILS
const getBankingDetails = () => {
  return {
    beneficiaryName: 'COALO (PTY) LTD',
    bank: 'FIRST NATIONAL BANK', // Or your bank
    accountNumber: '123456789', // YOUR ACCOUNT NUMBER
    branchCode: '250655', // YOUR BRANCH CODE (Optional)
  };
};