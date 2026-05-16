import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Quote } from '../types';

export const generateQuotePDF = (quote: Quote): string => {
  const doc = new jsPDF();
  
  // Add header
  doc.setFontSize(18);
  doc.text(`QUOTATION (${quote.id})`, 105, 15, { align: 'center' });
  
  // Add company logo/info
  doc.setFontSize(10);
  doc.text('Shiva Analyticals (India) Private Limited', 14, 30);
  doc.text('MSME registration number: UDYAM-KR-02-0000566', 14, 35);
  doc.text('GST ID: 29AACCS8234K1ZA', 14, 40);
  doc.text('PAN Number: AACCS8234K', 14, 45);
  
  // Add quotation details
  doc.setFontSize(11);
  doc.text(`Date: ${new Date(quote.createdAt).toLocaleDateString()}`, 14, 55);
  doc.text(`Valid Until: ${new Date(quote.expiresAt).toLocaleDateString()}`, 14, 60);
  
  // Add customer details
  doc.setFillColor(240, 240, 240);
  doc.rect(14, 65, 182, 25, 'F');
  doc.setFontSize(12);
  doc.text('Customer Details:', 16, 70);
  doc.setFontSize(10);
  doc.text(`Name: ${quote.customerName}`, 16, 75);
  doc.text(`Company: ${quote.companyName}`, 16, 80);
  doc.text(`Address: ${quote.customerAddress.split('\n')[0]}`, 16, 85);
  
  doc.text(`Attention: ${quote.kindAttention}`, 120, 75);
  doc.text(`Email: ${quote.emailId}`, 120, 80);
  doc.text(`Phone: ${quote.phoneNumber}`, 120, 85);
  
  // Add quote title
  doc.setFontSize(12);
  doc.text(`Subject: ${quote.title}`, 14, 100);
  
  // Add tests table
  doc.setFontSize(10);
  doc.text('Dear Sir/Madam,', 14, 110);
  doc.text('We thank you for the enquiry and wish to quote our charges below:', 14, 115);
  
  const tableHeaders = [
    ['S.No', 'Product/Material', 'Test Name', 'Test Method', 'Qty', 'Price/Batch (₹)', 'Total Amount (₹)']
  ];
  
  const tableData = quote.tests.map((test, index) => [
    (index + 1).toString(),
    test.productMaterial,
    test.testName,
    test.testMethod,
    test.quantity.toString(),
    test.unitPrice.toLocaleString(),
    test.totalPrice.toLocaleString()
  ]);
  
  autoTable(doc, {
    head: tableHeaders,
    body: tableData,
    startY: 120,
    theme: 'grid',
    headStyles: { fillColor: [66, 66, 66] },
    styles: { fontSize: 8 }
  });
  
  // Add pricing summary
  const finalY = (doc as any).lastAutoTable.finalY + 10;
  
  doc.text('Pricing Summary:', 130, finalY);
  doc.text(`Sub Total: ₹${quote.subtotal.toLocaleString()}`, 130, finalY + 5);
  
  if (quote.additionalCharges > 0) {
    doc.text(`Additional Charges: ₹${quote.additionalCharges.toLocaleString()}`, 130, finalY + 10);
    doc.text(`Total: ₹${quote.totalAmount.toLocaleString()}`, 130, finalY + 15);
  } else {
    doc.text(`Total: ₹${quote.totalAmount.toLocaleString()}`, 130, finalY + 10);
  }
  
  let taxY = quote.additionalCharges > 0 ? finalY + 20 : finalY + 15;
  
  if (quote.taxType === 'CGST_SGST') {
    doc.text(`CGST (${quote.cgstRate}%): ₹${quote.cgstAmount.toLocaleString()}`, 130, taxY);
    doc.text(`SGST (${quote.sgstRate}%): ₹${quote.sgstAmount.toLocaleString()}`, 130, taxY + 5);
  } else {
    doc.text(`IGST (${quote.igstRate}%): ₹${quote.igstAmount.toLocaleString()}`, 130, taxY);
  }
  
  doc.text(`Total Tax: ₹${quote.totalTaxAmount.toLocaleString()}`, 130, taxY + 10);
  
  if (quote.roundOff !== 0) {
    doc.text(`Round Off: ₹${quote.roundOff.toFixed(2)}`, 130, taxY + 15);
  }
  
  doc.setFontSize(12);
  doc.text(`Final Amount: ₹${quote.finalAmount.toLocaleString()}`, 130, taxY + 20);
  doc.setFontSize(9);
  doc.text(`Amount in Words: ${quote.amountInWords}`, 130, taxY + 25);
  
  // Add terms and conditions
  const termsY = taxY + 35;
  doc.setFontSize(11);
  doc.text('TERMS AND CONDITIONS', 105, termsY, { align: 'center' });
  doc.setFontSize(8);
  
  const terms = [
    "Sample Quantity: 25g for Method feasibility & method verification, and 50 per batch analysis",
    "TAT: 2 weeks for Method feasibility & method verification, and 5 working days for the batch analysis",
    "Additional 18% GST as per existing Government notification",
    "This offer is valid for 3 month(s) from the date of this quotation",
    "Total liability of our lab is limited to the invoiced amount",
    "100% Advance",
    "By NEFT/DD/Cheque in favour of \"Shiva Analyticals (India) Private Limited\"",
    "Payable at Hoskeote, Bangalore"
  ];
  
  terms.forEach((term, index) => {
    doc.text(`${index + 1}. ${term}`, 14, termsY + 5 + (index * 4));
  });
  
  // Add signature
  const signatureY = termsY + 5 + (terms.length * 4) + 10;
  doc.text('For Shiva Analyticals (India) Private Limited', 140, signatureY);
  doc.text('Authorized Signatory', 140, signatureY + 15);
  
  // Save the PDF
  return doc.output('datauristring');
};

export const downloadQuotePDF = (quote: Quote): void => {
  const pdfOutput = generateQuotePDF(quote);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = pdfOutput;
  link.download = `Quotation_${quote.id}.pdf`;
  
  // Append to the document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};