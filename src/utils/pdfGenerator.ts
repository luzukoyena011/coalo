// src/utils/pdfGenerator.ts

import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure this import is present

// -- Helper Functions (Defined at the bottom, make sure they are correct) ---
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

  // --- DEBUGGING LOGS (Check browser console for these values) ---
  console.log('--- generateQuotePDF Start ---');
  console.log('Received Tier:', tier);
  console.log('Received Name:', name);
  console.log('Received Company:', companyName);
  console.log('Received Phone:', phone, '| Type:', typeof phone);
  console.log('Received Duration:', duration, '| Type:', typeof duration);
  console.log('Received isAnnual:', isAnnual);
  console.log('Received Address:', address);
  console.log('-----------------------------');
  // --- END DEBUGGING LOGS ---

  try {
    // --- 1. Data Preparation ---
    const currentDate = format(new Date(), 'dd MMMM yyyy'); // Include year
    const tierDetails = getTierDetails(tier);
    const pricing = getPricingDetails(tier);

    if (!pricing || !tierDetails) {
      console.error("Invalid tier selected or pricing/tier details missing.");
      alert("Error: Could not retrieve details for the selected tier.");
      return;
    }
    const numericDuration = Number(duration);
    if (isNaN(numericDuration) || numericDuration <= 0) {
        console.error("Invalid duration value received:", duration);
        alert("Error: Invalid duration value provided.");
        return;
     }

    const unitPrice = isAnnual ? pricing.annualPrice : pricing.monthlyPrice;
    const lineItemCost = unitPrice * numericDuration;
    const subtotal = lineItemCost;
    const vatRate = 0.15;
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;

    const currentCount = localStorage.getItem('quoteCounter') || '0';
    const quoteNumber = `QUO-${new Date().getFullYear()}-${parseInt(currentCount) + 1}`;
    localStorage.setItem('quoteCounter', (parseInt(currentCount) + 1).toString());

    // --- 2. PDF Document Initialization ---
    const doc = new jsPDF('p', 'pt', 'a4'); // Units in points, A4 page size
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const leftMargin = 40;
    const rightMargin = pageWidth - 40;
    let currentY = 50; // Initial top margin

    // --- 3. Header Section ---
    // Logo (Top Left)
    const logoUrl = '/images/coalo97x30quo.webp'; // Ensure this path is correct in /public
    const logoWidthPt = 66.8902; // User's exact width
    const logoHeightPt = 22.5058; // User's exact height
    try {
      doc.addImage(logoUrl, 'WEBP', leftMargin, currentY, logoWidthPt, logoHeightPt);
    } catch (imgError) {
      console.error("Error adding logo image:", imgError);
      doc.setFontSize(8).text("Logo Error", leftMargin, currentY + 10);
    }

    // Company DETAILS (Top Right)
    let rightColY = currentY;
    const rightColX = rightMargin;
    const companyDetailFontSize = 9; // Size 9
    const companyDetailLineHeight = 11;

    doc.setFontSize(companyDetailFontSize).setFont(undefined, 'normal');
    doc.text('23 Wesley Street, The Hill, Mthatha, 5099', rightColX, rightColY, { align: 'right' });
    rightColY += companyDetailLineHeight;
    doc.text(`E: luzukoyena@gmail.com`, rightColX, rightColY, { align: 'right' });

    const vatNumber = "YOUR_VAT_NUMBER"; // <<<--- FILL THIS IN IF APPLICABLE
    if (vatNumber && vatNumber !== "YOUR_VAT_NUMBER") {
        rightColY += companyDetailLineHeight;
        doc.setFontSize(companyDetailFontSize).setFont(undefined,'normal');
        doc.text(`VAT Reg: ${vatNumber}`, rightColX, rightColY, { align: 'right' });
    }

    // --- Set Y below header ---
    currentY = Math.max(currentY + logoHeightPt, rightColY) + 20;

    // --- 4. QUOTE Details Block (Left) ---
    doc.setFontSize(18).setFont(undefined, 'bold'); // Size 18 Title
    doc.text('QUOTE', leftMargin, currentY);
    currentY += 18;
    doc.setFontSize(10).setFont(undefined, 'normal'); // Size 10 Details
    doc.text(`Quote no. ${quoteNumber}`, leftMargin, currentY);
    currentY += 12;
    doc.text(`Date: ${currentDate}`, leftMargin, currentY);
    currentY += 20;

    // --- 5. Billing For Section (Left) ---
    doc.setFontSize(10).setFont(undefined, 'bold'); // Size 10 Heading
    doc.text('Billing for', leftMargin, currentY);
    currentY += 14;
    doc.setFont(undefined, 'normal').setFontSize(9); // Size 9 Details
    const billingLineHeight = 11;

    doc.text(name || '[No Name Provided]', leftMargin, currentY);
    currentY += billingLineHeight;
    if (companyName) {
        doc.text(companyName, leftMargin, currentY);
        currentY += billingLineHeight;
    }
    const billingAddress = `${address || '[No Address Provided]'}`;
    const addressMaxWidth = (pageWidth / 2) - leftMargin;
    const addressLines = doc.splitTextToSize(billingAddress, addressMaxWidth);
    doc.text(addressLines, leftMargin, currentY);
    currentY += (addressLines.length * billingLineHeight);
    const billingPhone = `${phone || '[No Phone Provided]'}`;
    doc.text(billingPhone, leftMargin, currentY);
    currentY += 25; // Space before table

    // --- 6. Body Table Data Preparation (Including Features) ---
    const tableColumn = ["Service description", "Qty", "Unit cost (ZAR)"];
    const tableRows: (string | number)[][] = [];

    const description = `${tierDetails.name} Plan (${isAnnual ? 'Annual' : 'Monthly'} Billing)`;
    const quantity = numericDuration; // Use validated number
    const formattedUnitPrice = formatCurrency(unitPrice);

    tableRows.push([ description, quantity, formattedUnitPrice ]);

    // Add features back
    if (tierDetails && tierDetails.features && tierDetails.features.length > 0) {
      tierDetails.features.forEach(feature => {
        tableRows.push([`    • ${feature}`, '', '']); // Indented feature
      });
    }

    // --- Generate Main Table ---
    autoTable(doc, {
      startY: currentY,
      head: [tableColumn],
      body: tableRows,
      theme: 'plain',
      headStyles: {
        fillColor: [255, 255, 255], textColor: [0, 0, 0],
        fontStyle: 'bold', fontSize: 10, // Size 10 Header
        lineWidth: { bottom: 0.3 }, lineColor: [0, 0, 0],
      },
      styles: { fontSize: 9, cellPadding: 3 }, // Size 9 Body
      columnStyles: {
        0: { cellWidth: 'auto' }, // Description
        1: { cellWidth: 30, halign: 'right' }, // Qty
        2: { cellWidth: 60, halign: 'right' }  // Unit cost
      },
      didParseCell: function (data) {
         const isFeatureRow = data.row.index > 0;
         if (data.section === 'body' && isFeatureRow && data.column.index > 0) {
            const cellContent = data.cell.raw?.toString().trim() ?? '';
            if(cellContent === '') { data.cell.styles.lineWidth = 0; } // Hide borders
         }
      },
      didDrawPage: function (data) { currentY = data.cursor?.y ?? currentY; }
    });

    currentY += 8; // Space after table

    // --- 7. Totals Section (Right Aligned) ---
    const totalsStartX = pageWidth / 2 + 30;
    const totalsEndX = rightMargin;
    const totalsFontSize = 9; // Size 9
    const totalsLineHeight = 11;

    doc.setFontSize(totalsFontSize).setFont(undefined, 'normal');
    doc.text('Subtotal', totalsStartX, currentY, { align: 'left' });
    doc.text(formatCurrency(subtotal), totalsEndX, currentY, { align: 'right' });
    currentY += totalsLineHeight;
    doc.text(`VAT (${vatRate * 100}%)`, totalsStartX, currentY, { align: 'left' });
    doc.text(formatCurrency(vatAmount), totalsEndX, currentY, { align: 'right' });
    currentY += totalsLineHeight;
    doc.setFont(undefined, 'bold'); // Bold TOTAL
    doc.text('TOTAL', totalsStartX, currentY, { align: 'left' });
    doc.text(formatCurrency(total), totalsEndX, currentY, { align: 'right' });
    currentY += 25; // Space after totals

    // --- 8. Footer ---
    const footerStartY = pageHeight - 55; // Position footer
    currentY = footerStartY;
    const footerFontSize = 8; // Size 8
    const footerLineHeight = 10;

    const bankingDetails = getBankingDetails();

    doc.setFontSize(footerFontSize + 1).setFont(undefined, 'bold'); // Size 9 Bold Heading
    doc.text('Payment Information', leftMargin, currentY);
    doc.setFontSize(footerFontSize).setFont(undefined, 'normal'); // Size 8 Normal Text
    currentY += footerLineHeight;
    doc.text(`Bank: ${bankingDetails.bank}`, leftMargin, currentY);
    currentY += footerLineHeight;
    doc.text(`Account No: ${bankingDetails.accountNumber}`, leftMargin, currentY); // Ensure string from helper
    currentY += footerLineHeight;
    doc.text(`Beneficiary: ${bankingDetails.beneficiaryName}`, leftMargin, currentY);

    // Reset Y for second column (Terms/Disclaimer), align near right margin
    currentY = footerStartY;
    const termsX = rightMargin - 100; // Adjust X position
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
    currentY += footerLineHeight + 2;
    doc.text('Disclaimer:', termsX, currentY);
    currentY += footerLineHeight;
    const disclaimerText = `E&OE. Subject to standard T&Cs. Quote provided for informational purposes.`;
    const disclaimerLines = doc.splitTextToSize(disclaimerText, termsMaxWidth);
    doc.text(disclaimerLines, termsX, currentY, { align: 'left' });


    // --- 9. Save and Download PDF ---
    doc.save(`${quoteNumber}.pdf`);
    console.log("PDF generation process completed successfully.");

  } catch (error) {
    console.error("Error generating PDF:", error);
    alert(`An error occurred while generating the PDF quote: ${error instanceof Error ? error.message : String(error)}`);
  }
}; // End of generateQuotePDF function

// --- Helper Functions (Ensure these are correct and below the main function) ---

const getTierDetails = (tier: 'standard' | 'pro' | 'premium') => {
  const tierDetailsData = {
    standard: { name: 'Standard', features: ['10-second advert', 'Fixed scheduling', 'Static images only', 'Moderate cycle frequency', 'Basic analytics'] },
    pro: { name: 'Pro', features: ['20-second advert', 'Enhanced scheduling flexibility', 'Mix of static and limited dynamic content', 'Higher cycle frequency', 'Detailed analytics dashboard', 'Email support'] },
    premium: { name: 'Premium', features: ['45-second advert', 'Unlimited cycles per day', 'Full creative freedom (video, dynamic or static)', 'AI-driven input', 'QR code discounts for first 100 customers', '24/7 dedicated support', 'Customizable campaigns'] }
  };
  // Ensure a valid object is returned or handle null case earlier
  return tierDetailsData[tier] || { name: 'Unknown Tier', features: [] };
};

export const getPricingDetails = (tier: 'standard' | 'pro' | 'premium') => {
  // Ensure these prices are PER UNIT (per month or per year)
  const pricingData = {
    standard: { monthlyPrice: 10000, annualPrice: 102000 },
    pro: { monthlyPrice: 25000, annualPrice: 255000 },
    premium: { monthlyPrice: 45000, annualPrice: 459000 }
  };
  // Ensure a valid object is returned or handle null case earlier
  return pricingData[tier] || { monthlyPrice: 0, annualPrice: 0 };
};

export const formatCurrency = (amount: number): string => {
  if (typeof amount !== 'number' || isNaN(amount)) { return 'R 0.00'; }
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency', currency: 'ZAR',
    minimumFractionDigits: 2, maximumFractionDigits: 2,
  }).format(amount);
};

// <<<--- VERIFY/UPDATE BANKING DETAILS HERE --->>>
const getBankingDetails = () => {
  return {
    beneficiaryName: 'COALO (PTY) LTD',
    bank: 'FIRST NATIONAL BANK', // Your Bank
    accountNumber: '1234567890', // Coalo's ACTUAL Account Number (as a string)
  };
};