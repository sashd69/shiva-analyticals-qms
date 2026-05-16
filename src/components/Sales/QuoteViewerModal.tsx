import React from 'react';
import { X, Download, Printer, Copy } from 'lucide-react';
import { Quote } from '../../types';
import { downloadQuotePDF } from '../../utils/pdfGenerator';

interface QuoteViewerModalProps {
  quote: Quote;
  onClose: () => void;
}

const QuoteViewerModal: React.FC<QuoteViewerModalProps> = ({ quote, onClose }) => {
  const handleDownload = () => {
    downloadQuotePDF(quote);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`Quotation ${quote.id}: ${quote.title} - ₹${quote.finalAmount.toLocaleString()}`);
    alert('Quotation details copied to clipboard!');
  };

  const termsAndConditions = [
    "Sample Quantity: 25g for Method feasibility & method verification, and 50 per batch analysis",
    "The following consumables needs to be provided along with the sample:",
    "a. Guard column: 3 mm x 2 cm; 5 μm packing LB4",
    "b. Analytical column: 3 mm x 25 cm; 5 μm packing LB4",
    "c. Suppressor: CSRS_300, 2mm",
    "Method verification will cover the following mandatory parameters:",
    "• Specificity & System Suitability",
    "• Linearity",
    "• LOQ verification (25% of the specification)",
    "• Method Precision",
    "• Accuracy (LOQ 100% & 150% of the specification)",
    "• Solution Stability (24 Hrs.)",
    "TAT: 2 weeks for Method feasibility & method verification, and 5 working days for the batch analysis",
    "As per the requirements of Drugs & Cosmetics Act, product manufacturing license number needs to be provided for getting test report in Form- 39",
    "The sample type viz., Batch Release / OOS Sample / R&D Testing, must be mentioned during sample submission.",
    "Failure results of a finished product sample will be intimated to Drugs Controller Department, Karnataka for any repeat analysis additional charges will be levied as per regulatory requirement.",
    "Additional 18% GST as per existing Government notification.",
    "This offer is valid for 3 month(s) from the date of this quotation",
    "Total liability of our lab is limited to the invoiced amount",
    "100% Advance",
    "By NEFT/DD/Cheque in favour of \"Shiva Analyticals (India) Private Limited\".",
    "Payable at Hoskeote, Bangalore"
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">QUOTATION ({quote.id})</h2>
              <p className="text-gray-600">Professional Laboratory Services Quotation</p>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                title="Download PDF with Terms & Conditions"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                title="Print Quotation"
              >
                <Printer className="h-4 w-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy Details"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Quotation Format */}
          <div className="border-2 border-black bg-white">
            {/* Header */}
            <div className="border-b-2 border-black p-4 text-center">
              <h1 className="text-xl font-bold">QUOTATION ({quote.id})</h1>
            </div>

            {/* Sub and Ref */}
            <div className="border-b border-black p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-medium">Sub:</span> {quote.title}
                </div>
                <div>
                  <span className="font-medium">Ref:</span> {quote.id}
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="border-b border-black p-4">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="font-medium mb-2">Customer Name & Address</div>
                  <div className="whitespace-pre-line">{quote.customerAddress}</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <div className="font-medium">Kind Attention</div>
                    <div className="border border-black p-2 h-8">{quote.kindAttention}</div>
                  </div>
                  <div>
                    <div className="font-medium">Email Id</div>
                    <div className="border border-black p-2 h-8">{quote.emailId}</div>
                  </div>
                  <div>
                    <div className="font-medium">Phone</div>
                    <div className="border border-black p-2 h-8">{quote.phoneNumber}</div>
                  </div>
                  <div>
                    <div className="font-medium">Mobile</div>
                    <div className="border border-black p-2 h-8">{quote.mobileNumber}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Greeting */}
            <div className="border-b border-black p-4">
              <p>Dear Sir/Madam,</p>
              <p>We thank you for the enquiry and wish to quote our charges below:</p>
            </div>

            {/* Test Details Table */}
            <div className="border-b border-black">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-black">
                    <th className="border-r border-black p-2 text-left font-medium">S.No</th>
                    <th className="border-r border-black p-2 text-left font-medium">Product/Material/Parameter</th>
                    <th className="border-r border-black p-2 text-left font-medium">Test Name</th>
                    <th className="border-r border-black p-2 text-left font-medium">Test Method</th>
                    <th className="border-r border-black p-2 text-center font-medium">Qty</th>
                    <th className="border-r border-black p-2 text-right font-medium">Price/Batch</th>
                    <th className="p-2 text-right font-medium">Total Amount Rs.</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.tests.map((test, index) => (
                    <tr key={test.id} className="border-b border-black">
                      <td className="border-r border-black p-2">{index + 1}</td>
                      <td className="border-r border-black p-2">{test.productMaterial}</td>
                      <td className="border-r border-black p-2">{test.testName}</td>
                      <td className="border-r border-black p-2">{test.testMethod}</td>
                      <td className="border-r border-black p-2 text-center">{test.quantity}</td>
                      <td className="border-r border-black p-2 text-right">₹{test.unitPrice.toLocaleString()}</td>
                      <td className="p-2 text-right">₹{test.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))}
                  {/* Empty rows for spacing */}
                  <tr className="border-b border-black">
                    <td className="border-r border-black p-2 h-12"></td>
                    <td className="border-r border-black p-2"></td>
                    <td className="border-r border-black p-2"></td>
                    <td className="border-r border-black p-2"></td>
                    <td className="border-r border-black p-2"></td>
                    <td className="border-r border-black p-2"></td>
                    <td className="p-2"></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Totals */}
            <div className="p-4">
              <div className="flex justify-end">
                <div className="w-80">
                  <div className="grid grid-cols-2 gap-2 text-right">
                    <div className="font-medium">Sub Total</div>
                    <div>₹{quote.subtotal.toLocaleString()}</div>
                    
                    <div className="font-medium">Additional Charges</div>
                    <div>₹{quote.additionalCharges.toLocaleString()}</div>
                    
                    <div className="font-medium border-t border-black pt-1">Total</div>
                    <div className="border-t border-black pt-1">₹{quote.totalAmount.toLocaleString()}</div>
                    
                    {quote.taxType === 'CGST_SGST' ? (
                      <>
                        <div className="font-medium">CGST</div>
                        <div>{quote.cgstRate}%: ₹{quote.cgstAmount.toLocaleString()}</div>
                        
                        <div className="font-medium">SGST</div>
                        <div>{quote.sgstRate}%: ₹{quote.sgstAmount.toLocaleString()}</div>
                        
                        <div className="font-medium">IGST</div>
                        <div>0%: ₹0</div>
                      </>
                    ) : (
                      <>
                        <div className="font-medium">CGST</div>
                        <div>0%: ₹0</div>
                        
                        <div className="font-medium">SGST</div>
                        <div>0%: ₹0</div>
                        
                        <div className="font-medium">IGST</div>
                        <div>{quote.igstRate}%: ₹{quote.igstAmount.toLocaleString()}</div>
                      </>
                    )}
                    
                    <div className="font-medium">Total Amount</div>
                    <div>₹{(quote.totalAmount + quote.totalTaxAmount).toLocaleString()}</div>
                    
                    <div className="font-medium">Round Off</div>
                    <div>₹{quote.roundOff.toFixed(2)}</div>
                    
                    <div className="font-bold text-lg border-t border-black pt-1">Final Amount</div>
                    <div className="font-bold text-lg border-t border-black pt-1">₹{quote.finalAmount.toLocaleString()}</div>
                  </div>
                  
                  <div className="mt-4 text-sm text-gray-700 border-t border-black pt-2">
                    <div className="font-medium mb-1">Amount in Words:</div>
                    <div className="italic">{quote.amountInWords}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="border-t-2 border-black p-4">
              <h3 className="font-bold text-center mb-4">TERMS AND CONDITIONS</h3>
              <div className="space-y-2 text-sm">
                {termsAndConditions.map((term, index) => (
                  <div key={index} className="flex">
                    <span className="mr-2">{index + 1}.</span>
                    <span>{term}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Company Details */}
            <div className="border-t border-black p-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="font-medium">Company Details:</div>
                  <div>MSME registration number is UDYAM-KR-02-0000566</div>
                  <div>GST ID: 29AACCS8234K1ZA</div>
                  <div>PAN Number: AACCS8234K</div>
                </div>
                <div>
                  <div className="font-medium">Bank Details:</div>
                  <div>Bank Account No: 20420400638O</div>
                  <div>IFSC Code: KA820000432</div>
                  <div>Kotak Mahindra Bank Ltd.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">Created:</div>
                <div>{new Date(quote.createdAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Expires:</div>
                <div>{new Date(quote.expiresAt).toLocaleDateString()}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Status:</div>
                <div className="capitalize">{quote.status}</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Priority:</div>
                <div className="capitalize">{quote.priority}</div>
              </div>
            </div>
            {quote.notes && (
              <div className="mt-4">
                <div className="font-medium text-gray-700 mb-1">Notes:</div>
                <div>{quote.notes}</div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-3 mt-6 pt-6 border-t">
            <button
              onClick={handleDownload}
              className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF with Terms & Conditions
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteViewerModal;