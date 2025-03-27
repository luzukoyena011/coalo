// src/utils/pdfGenerator.ts

import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable'; // Ensure this import is present

// --- Main PDF Generation Function ---
export const generateQuotePDF = (
  tier: 'standard' | 'pro' | 'premium',
  name: string,
  companyName: string,
  phone: string, // Ensure this parameter is passed from the calling component
  duration: number = 1,
  isAnnual: boolean = true,
  address: string = ''
): void => { // Return type is void

  try { // Add a try-catch block for better error handling
    console.log(`Generating PDF for: ${name}, Tier: ${tier}, Duration: ${Number(duration)} ${isAnnual ? 'year(s)' : 'month(s)'}`);

    // --- 1. Data Preparation ---
    const currentDate = format(new Date(), 'dd MMMM yyyy'); // Format like template
    const tierDetails = getTierDetails(tier);
    const pricing = getPricingDetails(tier);

    // Ensure pricing and tierDetails are valid
    if (!pricing || !tierDetails) {
      console.error("Invalid tier selected or pricing details missing.");
      alert("Error: Could not retrieve pricing details for the selected tier.");
      return;
    }

    const unitPrice = isAnnual ? pricing.annualPrice : pricing.monthlyPrice;
    const lineItemCost = unitPrice * duration;
    const subtotal = lineItemCost; // Assuming only one main service line item
    const vatRate = 0.15; // 15%
    const vatAmount = subtotal * vatRate;
    const total = subtotal + vatAmount;

    const currentCount = localStorage.getItem('quoteCounter') || '0';
    const quoteNumber = `QUO-${new Date().getFullYear()}-${parseInt(currentCount) + 1}`;
    localStorage.setItem('quoteCounter', (parseInt(currentCount) + 1).toString());

    // --- 2. PDF Document Initialization ---
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const leftMargin = 15;
    const rightMargin = pageWidth - 15;
    let currentY = 20; // Initial Y position

    // --- 3. Header Section ---
    // Logo (Left)
    const logoUrl = '/images/coalo97x30quo.webp'; // Path in 'public' folder
    const logoWidthPt = 73; // Approx 97.1px
    const logoHeightPt = 23; // Approx 30.7px
    try {
      doc.addImage(logoUrl, 'WEBP', leftMargin, currentY, logoWidthPt, logoHeightPt);
    } catch (imgError) {
      console.error("Error adding logo image:", imgError);
      doc.setFontSize(8).text("Logo Error", leftMargin, currentY + 10); // Fallback text
    }

    // Coalo Contact Info (Below Logo - Sender Info)
    let leftColY = currentY + logoHeightPt + 6;
    doc.setFontSize(9).setFont(undefined, 'normal'); // Smaller font for address block
    doc.text('COALO (PTY) LTD', leftMargin, leftColY);
    leftColY += 4;
    doc.text('23 Wesley Street, The Hill, Mthatha, 5099', leftMargin, leftColY);
    leftColY += 4;
    doc.text(`T: +27 72 031 1487`, leftMargin, leftColY);
    leftColY += 4;
    doc.text(`E: luzukoyena@gmail.com`, leftMargin, leftColY);
    // Add VAT Number if applicable
    const vatNumber = "YOUR_VAT_NUMBER"; // <<<--- FILL THIS IN IF APPLICABLE
    if (vatNumber && vatNumber !== "YOUR_VAT_NUMBER") {
        leftColY += 4;
        doc.text(`VAT Reg: ${vatNumber}`, leftMargin, leftColY);
    }

    // Quote Title, Number, Date (Right)
    let rightColX = rightMargin;
    doc.setFontSize(18).setFont(undefined, 'bold');
    doc.text('QUOTE', rightColX, currentY + 5, { align: 'right' });
    doc.setFontSize(10).setFont(undefined, 'normal');
    doc.text(`Quote no. ${quoteNumber}`, rightColX, currentY + 15, { align: 'right' });
    doc.text(`Date: ${currentDate}`, rightColX, currentY + 20, { align: 'right' });

    // --- 4. Billed To Section ---
    // Position below the left column info
    currentY = leftColY + 15; // Add space below sender info
    doc.setFontSize(10).setFont(undefined, 'bold');
    doc.text('Billed to', leftMargin, currentY);
    currentY += 6;
    doc.setFont(undefined, 'normal').setFontSize(9); // Smaller font for details
    doc.text(name || '[No Name Provided]', leftMargin, currentY); // Fallback
    currentY += 4;
    if (companyName) {
        doc.text(companyName, leftMargin, currentY);
        currentY += 4;
    }
    // Handle potentially long addresses (basic multi-line split)
    const addressLines = doc.splitTextToSize(address || '[No Address Provided]', (pageWidth / 2) - leftMargin - 5); // Max width approx half page minus margins
    doc.text(addressLines, leftMargin, currentY);
    currentY += (addressLines.length * 4); // Adjust Y based on number of lines
    doc.text(`${phone || '[No Phone Provided]'}`, leftMargin, currentY); // Ensure phone is string
    currentY += 15; // Space before table

    // --- 5. Body Table ---
    const tableColumn = ["Service description", "Qty", "Unit cost (ZAR)"];
    const tableRows: (string | number)[][] = [];

    // Ensure data passed to table is clean (string or number)
    const description = `${tierDetails.name} Plan (${isAnnual ? 'Annual' : 'Monthly'} Billing)`;
    const quantity = duration; // Use the number directly
    const formattedUnitPrice = formatCurrency(unitPrice); // Format here

    tableRows.push([
      description,
      quantity,
      formattedUnitPrice // Pass formatted string
    ]);

    // --- Generate Main Table ---
    autoTable(doc, {
      startY: currentY,
      head: [tableColumn],
      body: tableRows,
      theme: 'plain',
      headStyles: {
        fillColor: [255, 255, 255], // White
        textColor: [0, 0, 0], // Black
        fontStyle: 'bold',
        lineWidth: { bottom: 0.3 }, // Thin line below header
        lineColor: [0, 0, 0],
        fontSize: 10,
      },
      styles: { fontSize: 9, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 'auto' }, // Description column
        1: { cellWidth: 20, halign: 'right' }, // Qty column
        2: { cellWidth: 40, halign: 'right' }  // Unit cost column
      },
      didDrawPage: function (data) {
        currentY = data.cursor?.y ?? currentY; // Update Y pos below table
      }
    });

    currentY += 5; // Space after table

    // --- 6. Totals Section ---
    const totalsStartX = pageWidth / 2 + 10; // Adjust start X as needed
    const totalsEndX = rightMargin;

    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text('Subtotal', totalsStartX, currentY, { align: 'left' });
    doc.text(formatCurrency(subtotal), totalsEndX, currentY, { align: 'right' });
    currentY += 5;
    doc.text(`VAT (${vatRate * 100}%)`, totalsStartX, currentY, { align: 'left' });
    doc.text(formatCurrency(vatAmount), totalsEndX, currentY, { align: 'right' });
    currentY += 5;
    doc.setFont(undefined, 'bold'); // Make total bold
    doc.text('TOTAL', totalsStartX, currentY, { align: 'left' });
    doc.text(formatCurrency(total), totalsEndX, currentY, { align: 'right' });
    currentY += 15; // Space after totals

    // --- 7. Footer ---
    const footerStartY = pageHeight - 35; // Adjust Y to position footer
    currentY = footerStartY;

    const bankingDetails = getBankingDetails(); // Get details from helper

    doc.setFontSize(9).setFont(undefined, 'normal');
    doc.text('Payment Information', leftMargin, currentY);
    if (vatNumber && vatNumber !== "YOUR_VAT_NUMBER") { // Show VAT number if provided earlier
        doc.text(`VAT Registration: ${vatNumber}`, rightMargin, currentY, { align: 'right'});
    } else {
        // If no VAT number, maybe add company reg number? Optional.
        // doc.text(`Reg No: YOUR_REG_NUMBER`, rightMargin, currentY, { align: 'right'});
    }
    currentY += 5;
    doc.text(`Bank: ${bankingDetails.bank}`, leftMargin, currentY);
    currentY += 4;
    doc.text(`Account No: ${bankingDetails.accountNumber}`, leftMargin, currentY); // Keep template literal, ensure accountNumber itself is string if not already
    currentY += 4;
    doc.text(`Beneficiary: ${bankingDetails.beneficiaryName}`, leftMargin, currentY);

    // Reset Y for terms section, align near the right margin
    currentY = footerStartY + 5; // Align top of terms with second line of bank info
    const termsX = rightMargin - 75; // Start terms further left
    const termsMaxWidth = 70; // Max width for terms text

    doc.setFontSize(8); // Smaller text for terms/disclaimer
    doc.text('Terms:', termsX, currentY, { align: 'left', maxWidth: termsMaxWidth });
    currentY += 4;
    doc.text(`Quote valid for 30 days from ${currentDate}.`, termsX, currentY, { align: 'left', maxWidth: termsMaxWidth });
    currentY += 4;
    doc.text(`Payment due within 14 days.`, termsX, currentY, { align: 'left', maxWidth: termsMaxWidth });
    currentY += 6;
    doc.text('Disclaimer:', termsX, currentY, { align: 'left', maxWidth: termsMaxWidth });
    currentY += 4;
    const disclaimerText = `This quote is provided for informational purposes only. E&OE. Subject to standard T&Cs available upon request.`;
    const disclaimerLines = doc.splitTextToSize(disclaimerText, termsMaxWidth);
    doc.text(disclaimerLines, termsX, currentY, { align: 'left' });


    // --- 8. Save and Download PDF ---
    doc.save(`${quoteNumber}.pdf`);
    console.log("PDF generation successful.");

  } catch (error) {
    console.error("Error generating PDF:", error);
    // Optionally show an error message to the user
    alert("An error occurred while generating the PDF quote. Please check the console for details.");
  }
};

// --- Helper Functions (Ensure these are correct) ---

const getTierDetails = (tier: 'standard' | 'pro' | 'premium') => {
  const tierDetailsData = {
    standard: { name: 'Standard', features: ['10-second advert', 'Fixed scheduling', 'Static images only', 'Moderate cycle frequency', 'Basic analytics'] },
    pro: { name: 'Pro', features: ['20-second advert', 'Enhanced scheduling flexibility', 'Mix of static and limited dynamic content', 'Higher cycle frequency', 'Detailed analytics dashboard', 'Email support'] },
    premium: { name: 'Premium', features: ['45-second advert', 'Unlimited cycles per day', 'Full creative freedom (video, dynamic or static)', 'AI-driven input', 'QR code discounts for first 100 customers', '24/7 dedicated support', 'Customizable campaigns'] }
  };
  return tierDetailsData[tier] || null; // Return null if tier is invalid
};

export const getPricingDetails = (tier: 'standard' | 'pro' | 'premium') => {
  // Ensure these prices are PER UNIT (per month or per year)
  const pricingData = {
    standard: { monthlyPrice: 10000, annualPrice: 102000, /* other fields if needed */ },
    pro: { monthlyPrice: 25000, annualPrice: 255000, /* other fields if needed */ },
    premium: { monthlyPrice: 45000, annualPrice: 459000, /* other fields if needed */ }
  };
  return pricingData[tier] || null; // Return null if tier is invalid
};

export const formatCurrency = (amount: number): string => {
  // Ensure formatting provides ZAR symbol and desired decimals
  if (typeof amount !== 'number' || isNaN(amount)) {
    return 'R 0.00'; // Fallback for invalid input
  }
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Helper for banking details - <<<--- VERIFY/UPDATE THESE DETAILS --->>>
const getBankingDetails = () => {
  return {
    beneficiaryName: 'COALO (PTY) LTD',
    bank: 'FIRST NATIONAL BANK', // Or your bank
    accountNumber: '1234567890', // YOUR ACCOUNT NUMBER // <<<--- ENSURE THIS IS A STRING
    // branchCode: '250655', // Optional: Add if needed
  };
};
