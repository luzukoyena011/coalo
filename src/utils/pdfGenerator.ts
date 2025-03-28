// src/utils/pdfGenerator.ts

// src/utils/pdfGenerator.ts

import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure this import is present

// --- Main PDF Generation Function ---
export const generateQuotePDF = (
  tier: 'standard' | 'pro' | 'premium',
  name: string,
  companyName: string,
  phone: string, // Ensure this parameter is passed correctly as a string
  duration: number = 1, // Ensure this parameter is passed correctly as a number
  isAnnual: boolean = true,
  address: string = '' // Ensure this parameter is passed correctly as a string
): void => { // Return type is void

  // --- DEBUGGING LOGS ---
  // Check the actual values received by this function in the browser console
  console.log('--- generateQuotePDF Start ---');
  console.log('Received Tier:', tier);
  console.log('Received Name:', name);
  console.log('Received Company:', companyName);
  console.log('Received Phone:', phone, '| Type:', typeof phone); // Check value and type
  console.log('Received Duration:', duration, '| Type:', typeof duration); // Check value and type
  console.log('Received isAnnual:', isAnnual);
  console.log('Received Address:', address);
  console.log('-----------------------------');
  // --- END DEBUGGING LOGS ---

  try {
    // --- 1. Data Preparation ---
    const currentDate = format(new Date(), 'dd MMMM yyyy'); // Use 'yyyy' for full year
    const tierDetails = getTierDetails(tier);
    const pricing = getPricingDetails(tier);

    // Ensure pricing and tierDetails are valid
    if (!pricing || !tierDetails) {
      console.error("Invalid tier selected or pricing/tier details missing.");
      alert("Error: Could not retrieve details for the selected tier.");
      return;
    }
    // Ensure duration is a valid number
     const numericDuration = Number(duration);
     if (isNaN(numericDuration) || numericDuration <= 0) {
        console.error("Invalid duration value received:", duration);
        alert("Error: Invalid duration value provided.");
        return;
     }

    const unitPrice = isAnnual ? pricing.annualPrice : pricing.monthlyPrice;
    const lineItemCost = unitPrice * numericDuration; // Use numericDuration
    const subtotal = lineItemCost;
    const vatRate = 0.15; // 15%
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;

    const currentCount = localStorage.getItem('quoteCounter') || '0';
    const quoteNumber = `QUO-${new Date().getFullYear()}-${parseInt(currentCount) + 1}`;
    localStorage.setItem('quoteCounter', (parseInt(currentCount) + 1).toString());

    // --- 2. PDF Document Initialization ---
    const doc = new jsPDF('p', 'pt', 'a4'); // Use 'pt' units, A4 size
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const leftMargin = 40; // Increased margin slightly
    const rightMargin = pageWidth - 40;
    let currentY = 50; // Adjusted starting Y

    // --- 3. Header Section ---
    // Logo (Left)
    const logoUrl = '/images/coalo97x30quo.webp';
    const logoWidthPt = 66.8902; // User's exact width
    const logoHeightPt = 22.5058; // User's exact height
    try {
      doc.addImage(logoUrl, 'WEBP', leftMargin, currentY, logoWidthPt, logoHeightPt);
    } catch (imgError) {
      console.error("Error adding logo image:", imgError);
      doc.setFontSize(8).text("Logo Error", leftMargin, currentY + 10);
    }

    // Coalo Contact Info (Below Logo - Sender Info)
    let leftColY = currentY + logoHeightPt + 10; // Y position below logo
    doc.setFontSize(9).setFont(undefined, 'normal'); // Standard Size 9
    doc.text('COALO (PTY) LTD', leftMargin, leftColY);
    leftColY += 11; // Approx line height for 9pt
    doc.text('23 Wesley Street, The Hill, Mthatha, 5099', leftMargin, leftColY);
    leftColY += 11;
    doc.text(`T: +27 72 031 1487`, leftMargin, leftColY);
    leftColY += 11;
    doc.text(`E: luzukoyena@gmail.com`, leftMargin, leftColY);

    const vatNumber = "YOUR_VAT_NUMBER"; // <<<--- FILL THIS IN IF APPLICABLE
    if (vatNumber && vatNumber !== "YOUR_VAT_NUMBER") {
        leftColY += 11;
        doc.text(`VAT Reg: ${vatNumber}`, leftMargin, leftColY);
    }

    // Quote Title, Number, Date (Right)
    let rightColX = rightMargin;
    let quoteTitleY = currentY + 7; // Align top with logo visually
    doc.setFontSize(18).setFont(undefined, 'bold'); // Size 18 Title
    doc.text('QUOTE', rightColX, quoteTitleY, { align: 'right' });
    doc.setFontSize(10).setFont(undefined, 'normal'); // Size 10 Details
    doc.text(`Quote no. ${quoteNumber}`, rightColX, quoteTitleY + 14, { align: 'right' }); // Spacing below title
    doc.text(`Date: ${currentDate}`, rightColX, quoteTitleY + 26, { align: 'right' }); // Spacing below number

    // --- 4. Billed To Section ---
    currentY = leftColY + 25; // Start below sender info + space
    doc.setFontSize(10).setFont(undefined, 'bold'); // Size 10 Heading
    doc.text('Billed to', leftMargin, currentY);
    currentY += 14; // Space after heading
    doc.setFont(undefined, 'normal').setFontSize(9); // Size 9 Details
    doc.text(name || '[No Name Provided]', leftMargin, currentY);
    currentY += 11;
    if (companyName) {
        doc.text(companyName, leftMargin, currentY);
        currentY += 11;
    }
    // Address (ensure it's a string)
    const billingAddress = `${address || '[No Address Provided]'}`;
    const addressLines = doc.splitTextToSize(billingAddress, (pageWidth / 2) - leftMargin - 10); // Max width for address
    doc.text(addressLines, leftMargin, currentY);
    currentY += (addressLines.length * 11); // Adjust Y based on number of lines

    // Phone (ensure it's a string)
    const billingPhone = `${phone || '[No Phone Provided]'}`;
    doc.text(billingPhone, leftMargin, currentY);
    currentY += 20; // Space before table

    // --- 5. Body Table ---
    const tableColumn = ["Service description", "Qty", "Unit cost (ZAR)"];
    const tableRows: (string | number)[][] = [];

    const description = `${tierDetails.name} Plan (${isAnnual ? 'Annual' : 'Monthly'} Billing)`;
    const quantity = numericDuration; // Use the validated number
    const formattedUnitPrice = formatCurrency(unitPrice);

    tableRows.push([
      description,
      quantity,
      formattedUnitPrice
    ]);
    // Note: Features are NOT included here to match the template PDF.

    // --- Generate Main Table ---
    autoTable(doc, {
      startY: currentY,
      head: [tableColumn],
      body: tableRows,
      theme: 'plain',
      headStyles: {
        fillColor: [255, 255, 255], textColor: [0, 0, 0],
        fontStyle: 'bold', fontSize: 10, // Size 10 Header
        lineWidth: { bottom: 0.5 }, lineColor: [0, 0, 0],
      },
      styles: { fontSize: 9, cellPadding: 3 }, // Size 9 Body text
      columnStyles: {
        0: { cellWidth: 'auto' }, // Description
        1: { cellWidth: 30, halign: 'right' }, // Qty
        2: { cellWidth: 60, halign: 'right' }  // Unit cost
      },
      didDrawPage: function (data) {
        currentY = data.cursor?.y ?? currentY;
      }
    });

    currentY += 8; // Space after table

    // --- 6. Totals Section ---
    const totalsStartX = pageWidth / 2 + 30; // Start further right
    const totalsEndX = rightMargin;
    const totalsFontSize = 9; // Size 9 for totals
    const totalsLineHeight = 11;

    doc.setFontSize(totalsFontSize).setFont(undefined, 'normal');
    doc.text('Subtotal', totalsStartX, currentY, { align: 'left' });
    doc.text(formatCurrency(subtotal), totalsEndX, currentY, { align: 'right' });
    currentY += totalsLineHeight;
    doc.text(`VAT (${vatRate * 100}%)`, totalsStartX, currentY, { align: 'left' });
    doc.text(formatCurrency(vatAmount), totalsEndX, currentY, { align: 'right' });
    currentY += totalsLineHeight;
    doc.setFont(undefined, 'bold'); // Make total bold
    doc.text('TOTAL', totalsStartX, currentY, { align: 'left' });
    doc.text(formatCurrency(total), totalsEndX, currentY, { align: 'right' });
    currentY += 25; // Space after totals

    // --- 7. Footer ---
    const footerStartY = pageHeight - 55; // Position footer higher up
    currentY = footerStartY;
    const footerFontSize = 8; // Size 8 for footer
    const footerLineHeight = 10;

    const bankingDetails = getBankingDetails();

    doc.setFontSize(footerFontSize + 1).setFont(undefined, 'bold'); // Size 9 Bold Heading
    doc.text('Payment Information', leftMargin, currentY);
    doc.setFontSize(footerFontSize).setFont(undefined, 'normal'); // Size 8 Normal Text
    currentY += footerLineHeight;
    doc.text(`Bank: ${bankingDetails.bank}`, leftMargin, currentY);
    currentY += footerLineHeight;
    doc.text(`Account No: ${bankingDetails.accountNumber}`, leftMargin, currentY); // Ensure accountNumber is string from helper
    currentY += footerLineHeight;
    doc.text(`Beneficiary: ${bankingDetails.beneficiaryName}`, leftMargin, currentY);

    // Reset Y for second column (Terms/Disclaimer), align near right margin
    currentY = footerStartY;
    const termsX = rightMargin - 100; // Adjust X position for terms column
    const termsMaxWidth = 95; // Adjust max width

    if (vatNumber && vatNumber !== "YOUR_VAT_NUMBER") {
        doc.setFontSize(footerFontSize + 1).setFont(undefined, 'bold');
        doc.text(`Tax Registration`, termsX, currentY);
        doc.setFontSize(footerFontSize).setFont(undefined, 'normal');
        currentY += footerLineHeight;
        doc.text(`${vatNumber}`, termsX, currentY);
        currentY += footerLineHeight; // Add space if VAT# exists
    }

    doc.setFontSize(footerFontSize + 1).setFont(undefined, 'bold');
    doc.text('Terms:', termsX, currentY);
    doc.setFontSize(footerFontSize).setFont(undefined, 'normal');
    currentY += footerLineHeight;
    doc.text(`Quote valid for 30 days.`, termsX, currentY, { align: 'left', maxWidth: termsMaxWidth });
    currentY += footerLineHeight;
    doc.text(`Payment due within 14 days.`, termsX, currentY, { align: 'left', maxWidth: termsMaxWidth });
    currentY += footerLineHeight + 2; // Extra space before disclaimer
    doc.text('Disclaimer:', termsX, currentY);
    currentY += footerLineHeight;
    const disclaimerText = `E&OE. Subject to standard T&Cs. Quote provided for informational purposes.`;
    const disclaimerLines = doc.splitTextToSize(disclaimerText, termsMaxWidth);
    doc.text(disclaimerLines, termsX, currentY, { align: 'left' });


    // --- 8. Save and Download PDF ---
    doc.save(`${quoteNumber}.pdf`);
    console.log("PDF generation process completed.");

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert(`An error occurred while generating the PDF quote: ${error instanceof Error ? error.message : String(error)}`);
  }
};

// --- Helper Functions (Verify these are correct) ---

const getTierDetails = (tier: 'standard' | 'pro' | 'premium') => {
  const tierDetailsData = {
    standard: { name: 'Standard', features: ['10-second advert', 'Fixed scheduling', 'Static images only', 'Moderate cycle frequency', 'Basic analytics'] },
    pro: { name: 'Pro', features: ['20-second advert', 'Enhanced scheduling flexibility', 'Mix of static and limited dynamic content', 'Higher cycle frequency', 'Detailed analytics dashboard', 'Email support'] },
    premium: { name: 'Premium', features: ['45-second advert', 'Unlimited cycles per day', 'Full creative freedom (video, dynamic or static)', 'AI-driven input', 'QR code discounts for first 100 customers', '24/7 dedicated support', 'Customizable campaigns'] }
  };
  return tierDetailsData[tier] || null;
};

export const getPricingDetails = (tier: 'standard' | 'pro' | 'premium') => {
  // Ensure these prices are PER UNIT (per month or per year)
  const pricingData = {
    standard: { monthlyPrice: 10000, annualPrice: 102000 },
    pro: { monthlyPrice: 25000, annualPrice: 255000 },
    premium: { monthlyPrice: 45000, annualPrice: 459000 }
  };
  return pricingData[tier] || null;
};

export const formatCurrency = (amount: number): string => {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'R 0.00';
  }
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// <<<--- VERIFY/UPDATE BANKING DETAILS HERE --->>>
const getBankingDetails = () => {
  return {
    beneficiaryName: 'COALO (PTY) LTD',
    bank: 'FIRST NATIONAL BANK', // e.g., FNB, Standard Bank, etc.
    accountNumber: '1234567890', // Coalo's ACTUAL Account Number (as a string)
  };
};