
// PDF generation utility for Coalō quote system
// In a real application, this would use a library like jsPDF or PDFMake

import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generateQuotePDF = (
  tier: 'standard' | 'pro' | 'premium',
  name: string,
  companyName: string,
  phone: string,
  duration: number = 1,
  isAnnual: boolean = true,
  address: string = ''
): void => 
{
  // --- Data Preparation (Uses helper functions defined below) ---
  const currentDate = format(new Date(), 'dd MMMM yyyy'); // Corrected format
  const tierDetails = getTierDetails(tier);
  const pricing = getPricingDetails(tier);
  const unitPrice = isAnnual ? pricing.annualPrice : pricing.monthlyPrice;
  const subtotal = unitPrice * duration;
  const vat = subtotal * 0.15;
  const total = subtotal + vat;

  const currentCount = localStorage.getItem('quoteCounter') || '0';
  const quoteNumber = `QUO-${new Date().getFullYear()}-${parseInt(currentCount) + 1}`;
  localStorage.setItem('quoteCounter', (parseInt(currentCount) + 1).toString());

  // --- PDF Generation Initialization ---
  const doc = new jsPDF(); // Create new PDF document
  const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
  const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
  let currentY = 15; // Top margin

  // --- 1. HEADER ---
  // Add Logo
  const logoUrl = '/images/coalo97x30quo.webp'; // Path in 'public' folder
  // Convert your pixel dimensions to points (approx 1px = 0.75pt)
  const logoWidthPt = 73; // Approx 97.1px * 0.75
  const logoHeightPt = 23; // Approx 30.7px * 0.75
  const logoX = 15; // Left margin
  const logoY = currentY;

  try {
    // Add the logo image. You might need to adjust width/height slightly for best results.
    doc.addImage(logoUrl, 'WEBP', logoX, logoY, logoWidthPt, logoHeightPt);
  } catch (e) {
    console.error("Error adding logo image:", e);
    doc.setFontSize(8);
    doc.text("Logo Error", logoX, logoY + logoHeightPt / 2); // Fallback text
  }

  // Add Company Info (Centered)
  const centerX = pageWidth / 2;
  const companyInfoY = logoY + 5; // Start company info slightly below logo top
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('COALO (PTY) LTD', centerX, companyInfoY, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont(undefined, 'normal');
  doc.text('Nurturing Brands, Uniting Communities', centerX, companyInfoY + 7, { align: 'center' });
  doc.text('23 Wesley Street, The Hill, Mthatha, 5099', centerX, companyInfoY + 12, { align: 'center' });
  doc.text('luzukoyena@gmail.com, +27 72 031 1487', centerX, companyInfoY + 17, { align: 'center' });

  // Update currentY to be below the header section
  currentY = Math.max(logoY + logoHeightPt, companyInfoY + 17) + 15; // Add 15pt space after header

  // --- 2. DETAILS Section ---
  doc.setFontSize(11);
  doc.setFont(undefined, 'bold');
  doc.text('QUOTE DETAILS', 15, currentY);
  currentY += 7; // Space after heading
  doc.setFont(undefined, 'normal');
  doc.setFontSize(10); // Slightly smaller font for details
  doc.text(`Quote Number: ${quoteNumber}`, 15, currentY);
  doc.text(`Date: ${currentDate}`, pageWidth - 15, currentY, { align: 'right' });
  currentY += 6;
  doc.text(`Name: ${name}`, 15, currentY);
  currentY += 6;
  doc.text(`Company: ${companyName || 'N/A'}`, 15, currentY); // Handle potentially empty company
  currentY += 6;
  doc.text(`Address: ${address || 'N/A'}`, 15, currentY); // Handle potentially empty address
  currentY += 6;
  doc.text(`Mobile Number: ${phone}`, 15, currentY); // Use the 'phone' parameter
  currentY += 12; // Add space before table

  // --- 3. BODY (Table) ---
  const tableColumn = ["Description", "Quantity", "Amount (ZAR)"];
  const tableRows: (string | number)[][] = [];

  // Main plan item row
  tableRows.push([
    `${tierDetails.name} Plan - ${isAnnual ? 'Annual' : 'Monthly'} Billing`,
    `${duration} ${isAnnual ? (duration > 1 ? 'Years' : 'Year') : (duration > 1 ? 'Months' : 'Month')}`,
    formatCurrency(subtotal) // Use subtotal here (cost for the full duration)
  ]);

  // Add feature rows (indented)
  tierDetails.features.forEach(feature => {
    tableRows.push([`    • ${feature}`, '', '']); // Indent features using spaces
  });

  // Add empty row for spacing before totals
  tableRows.push(['', '', '']);

  // Add Subtotal, VAT, Total rows
  tableRows.push(['Subtotal', '', formatCurrency(subtotal)]);
  tableRows.push(['VAT (15%)', '', formatCurrency(vat)]);
  tableRows.push(['Grand Total', '', formatCurrency(total)]);

  // Generate the table using autoTable
  autoTable(doc, {
    startY: currentY,
    head: [tableColumn],
    body: tableRows,
    theme: 'grid',
    headStyles: { fillColor: [34, 48, 41], textColor: [255, 255, 255] }, // Dark green header
    styles: { fontSize: 9, cellPadding: 2 }, // Base style
    columnStyles: {
      0: { cellWidth: 'auto' }, // Description column wider
      1: { cellWidth: 35, halign: 'center' }, // Quantity column centered
      2: { cellWidth: 40, halign: 'right' }  // Amount column right-aligned
    },
    // Style the total rows
    didParseCell: function (data) {
       const isTotalRow = data.row.index >= data.table.body.length - 3; // Identify last 3 rows
       if (data.section === 'body' && isTotalRow) {
           data.cell.styles.fontStyle = 'bold'; // Make text bold
           if (data.column.index === 2) { // Amount column
               data.cell.styles.halign = 'right'; // Ensure right alignment
           }
           // Remove border for quantity column in total rows if desired
           if (data.column.index === 1) {
               data.cell.styles.lineWidth = 0;
           }
       }
       // Remove border for feature quantity/amount cells
       const isFeatureRow = data.row.index > 0 && data.row.index < data.table.body.length - 3;
       if (data.section === 'body' && isFeatureRow && data.column.index > 0) {
           data.cell.styles.lineWidth = 0;
       }
    },
    // Get Y position after table is drawn
    didDrawPage: function (data) {
      currentY = data.cursor?.y ?? currentY + 20; // Update Y pos below table
    }
  });

  currentY += 10; // Space after table

  // --- 4. FOOTER ---
  // Check if footer fits on the current page, add new page if needed
   const footerHeight = 50; // Estimate height needed for footer
   if (currentY > pageHeight - footerHeight) {
     doc.addPage();
     currentY = 20; // Reset Y for new page
   }

  // Add Banking Details
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Banking Details:', 15, currentY);
  currentY += 6;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9); // Slightly smaller font for footer details
  doc.text('BENEFICIARY NAME: COALO (PTY) LTD', 15, currentY);
  currentY += 5;
  // Fetch details from your original quoteData structure or hardcode
  doc.text('BENEFICIARY BANK: FIRST NATIONAL BANK', 15, currentY);
  currentY += 5;
  doc.text('BENEFICIARY ACCOUNT NO: 123456789', 15, currentY); // Replace with actual if different
  currentY += 10;

  // Add Terms and Conditions
  doc.setFont(undefined, 'bold');
  doc.setFontSize(10);
  doc.text('Terms and Conditions:', 15, currentY);
  currentY += 6;
  doc.setFont(undefined, 'normal');
  doc.setFontSize(9);
  doc.text(`• Payment: Payment due within 14 days of invoice date.`, 15, currentY);
  currentY += 5;
  doc.text(`• Quotation Validity: This quotation is valid for 30 days from ${currentDate}.`, 15, currentY);
  currentY += 5;
  doc.text(`• Disclaimer: All prices are inclusive of VAT. E&OE. Subject to standard T&Cs.`, 15, currentY);

  // --- 5. Trigger Download ---
  doc.save(`${quoteNumber}.pdf`); // Save the PDF with the quote number as filename
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
      monthlyPrice: 10000, // Updated from 8500 to 10000 to match PricingSection
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
