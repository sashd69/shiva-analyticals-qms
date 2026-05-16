import React, { useState } from 'react';
import { 
  Search, 
  Save, 
  Plus,
  Calendar,
  User,
  FileText,
  FlaskConical,
  Package,
  Info,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  Clipboard,
  Download
} from 'lucide-react';
import { SampleRecord, SampleHistory } from '../../types';

interface SampleAnalysisProps {
  samples: SampleHistory[];
  department: string;
  contacts?: any[];
  onSaveSampleDetails: (quoteId: string, sampleData: Omit<SampleRecord, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const SampleAnalysis: React.FC<SampleAnalysisProps> = ({
  samples,
  department,
  contacts = [],
  onSaveSampleDetails,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedQuote, setSelectedQuote] = useState<string>('');
  const [showSampleForm, setShowSampleForm] = useState(false);
  const [sampleFormData, setSampleFormData] = useState({
    sampleType: 'Blood',
    originalQuantity: 0,
    actualSampleValue: 0,
    samplesReceived: 0,
    dateReceived: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [selectedQuoteData, setSelectedQuoteData] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reportGenerating, setReportGenerating] = useState(false);

  // Mock quote data for demonstration
  const mockQuotes = [
    {
      id: 'Q-2024-001',
      customerName: 'Apollo Hospital Delhi',
      title: 'Monthly Laboratory Services Package',
      department: department,
      createdAt: '2024-03-01T09:00:00Z',
      tests: [
        {
          id: '1',
          testId: '1',
          productMaterial: 'Blood Sample',
          testName: 'Complete Blood Count (CBC)',
          testMethod: 'Flow Cytometry',
          category: 'Hematology',
          unitPrice: 3750.00,
          quantity: 100,
          totalPrice: 375000.00,
          turnaroundTime: 24
        },
        {
          id: '2',
          testId: '2',
          productMaterial: 'Serum Sample',
          testName: 'Lipid Profile',
          testMethod: 'Enzymatic Method',
          category: 'Clinical Chemistry',
          unitPrice: 2900.00,
          quantity: 80,
          totalPrice: 232000.00,
          turnaroundTime: 12
        }
      ],
      totalAmount: 607000.00
    },
    {
      id: 'Q-2024-002',
      customerName: 'Fortis Hospital Mumbai',
      title: 'Routine Testing Package',
      department: department,
      createdAt: '2024-02-28T11:20:00Z',
      tests: [
        {
          id: '3',
          testId: '3',
          productMaterial: 'Serum Sample',
          testName: 'Thyroid Function Panel',
          testMethod: 'Chemiluminescent Immunoassay',
          category: 'Endocrinology',
          unitPrice: 7100.00,
          quantity: 25,
          totalPrice: 177500.00,
          turnaroundTime: 24
        }
      ],
      totalAmount: 177500.00
    }
  ];

  // Filter quotes by department and search term
  const filteredQuotes = mockQuotes.filter(quote => 
    quote.department === department && 
    (quote.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
     quote.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
     quote.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSampleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const sampleData = {
        quoteId: selectedQuote,
        sampleType: sampleFormData.sampleType,
        originalQuantity: sampleFormData.originalQuantity,
        actualSampleValue: sampleFormData.actualSampleValue,
        samplesReceived: sampleFormData.samplesReceived,
        dateReceived: sampleFormData.dateReceived,
        receivedBy: 'Current User', // Current user
        notes: sampleFormData.notes
      };

      // Call the actual save function
      await onSaveSampleDetails(selectedQuote, sampleData);

      // Reset form
      setSampleFormData({
        sampleType: '',
        originalQuantity: 0,
        actualSampleValue: 0,
        samplesReceived: 0,
        dateReceived: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setShowSampleForm(false);
      setSelectedQuote('');
      setSelectedQuoteData(null);
      
      // Show success message (you can use a notification system if available)
      alert('Sample analysis saved successfully!');
    } catch (error) {
      console.error('Error saving sample analysis:', error);
      alert('Failed to save sample analysis. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateReport = async () => {
    setReportGenerating(true);
    try {
      // Simulate report generation
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Create a mock report (in a real app, this would generate a PDF or Excel file)
      const reportData = {
        quoteId: selectedQuote,
        customerName: selectedQuoteData?.customerName || 'Unknown',
        generatedAt: new Date().toISOString(),
        sampleData: {
          sampleType: sampleFormData.sampleType,
          quotedQuantity: sampleFormData.originalQuantity,
          actualQuantity: sampleFormData.samplesReceived,
          quotedValue: selectedQuoteData?.tests[0]?.totalPrice || 0,
          actualValue: sampleFormData.actualSampleValue,
          discrepancy: calculateDiscrepancy(
            sampleFormData.samplesReceived, 
            sampleFormData.originalQuantity
          )
        }
      };
      
      console.log('Generated report:', reportData);
      
      // In a real app, this would download a file
      alert('Sample analysis report generated successfully!');
    } catch (error) {
      console.error('Error generating report:', error);
      alert('Failed to generate report. Please try again.');
    } finally {
      setReportGenerating(false);
    }
  };

  const openSampleForm = (quoteId: string) => {
    setSelectedQuote(quoteId);
    const quote = mockQuotes.find(q => q.id === quoteId);
    setSelectedQuoteData(quote);
    setShowSampleForm(true);
    
    // Initialize form with first test data
    if (quote && quote.tests && quote.tests.length > 0) {
      const firstTest = quote.tests[0];
      setSampleFormData({
        sampleType: firstTest.productMaterial,
        originalQuantity: firstTest.quantity,
        actualSampleValue: 0,
        samplesReceived: 0,
        dateReceived: new Date().toISOString().split('T')[0],
        notes: ''
      });
    }
  };

  const calculateDiscrepancy = (actual: number, quoted: number) => {
    if (quoted === 0) return 0;
    return ((actual - quoted) / quoted) * 100;
  };

  // Filter quotes by customer name if contacts are provided
  const getCustomerName = (quoteId: string) => {
    const quote = mockQuotes.find(q => q.id === quoteId);
    return quote?.customerName || 'Unknown Customer';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sample Analysis</h1>
          <p className="text-gray-600 mt-1">Compare actual samples with quoted values</p>
          <p className="text-blue-600 font-medium mt-1">Department: {department}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by quote ID, customer name, or title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Available Quotations */}
      <div className="grid gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Available Quotations</h3>

          {filteredQuotes.length > 0 ? (
            <div className="space-y-4">
              {filteredQuotes.map((quote) => (
                <div 
                  key={quote.id}
                  className="border border-gray-200 hover:border-blue-300 rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                  onClick={() => openSampleForm(quote.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-blue-100 p-2 rounded-lg">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">{quote.id}</h4>
                        <p className="text-sm text-gray-600">{quote.title}</p>
                        <p className="text-sm text-gray-500">{quote.customerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900">₹{quote.totalAmount.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">
                        {quote.tests.length} test{quote.tests.length !== 1 ? 's' : ''}
                      </div>
                      <div className="text-xs text-gray-500">
                        Created: {new Date(quote.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No quotations found in your department</p>
              <p className="text-sm text-gray-500 mt-2">
                {searchTerm ? 'Try adjusting your search criteria' : 'Quotations will appear here once they are created'}
              </p>
            </div>
          )}
        </div>
        
        {/* Sample Analysis Records */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Sample Analysis Records</h3>
            {samples.length > 0 && (
              <div className="flex space-x-3">
                <button 
                  onClick={() => openSampleForm(filteredQuotes[0]?.id || '')}
                  disabled={filteredQuotes.length === 0}
                  className="bg-black hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-2 px-3 rounded-lg flex items-center transition-colors duration-200 text-sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Analysis
                </button>
                <button 
                  onClick={generateReport}
                  disabled={reportGenerating}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-medium py-2 px-3 rounded-lg flex items-center transition-colors duration-200 text-sm"
                >
                  {reportGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Export Report
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          
          {samples.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Quote ID</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Sample Type</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Quoted Qty</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Actual Qty</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Quoted Value</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-900">Actual Value</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-900">Variance</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Date Received</th>
                  </tr>
                </thead>
                <tbody>
                  {samples.flatMap(sample => 
                    sample.sampleRecords.map(record => {
                      const valueDiscrepancy = calculateDiscrepancy(
                        record.actualSampleValue || 0, 
                        record.originalQuantity * 3500 // Assuming 3500 per sample
                      );
                      
                      return (
                        <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 text-gray-900">{sample.quoteId}</td>
                          <td className="py-3 px-4 text-gray-900">{record.sampleType}</td>
                          <td className="py-3 px-4 text-center text-gray-900">{record.originalQuantity}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-medium ${
                              (record.samplesReceived || 0) < record.originalQuantity ? 'text-red-600' : 
                              (record.samplesReceived || 0) > record.originalQuantity ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              {record.samplesReceived || 0}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900">
                            ₹{(record.originalQuantity * 3500).toLocaleString()}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <span className={`font-medium ${
                              (record.actualSampleValue || 0) < (record.originalQuantity * 3500) ? 'text-red-600' : 
                              (record.actualSampleValue || 0) > (record.originalQuantity * 3500) ? 'text-green-600' : 'text-gray-900'
                            }`}>
                              ₹{(record.actualSampleValue || 0).toLocaleString()}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              Math.abs(valueDiscrepancy) < 5 ? 'bg-green-100 text-green-800' :
                              Math.abs(valueDiscrepancy) < 10 ? 'bg-amber-100 text-amber-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {valueDiscrepancy > 0 ? '+' : ''}{valueDiscrepancy.toFixed(1)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            {record.dateReceived ? new Date(record.dateReceived).toLocaleDateString() : 'Not recorded'}
                          </td>
                          <td className="py-3 px-4 text-gray-900">
                            {getCustomerName(sample.quoteId)}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <FlaskConical className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No sample analysis records found</p>
              <p className="text-sm text-gray-500 mt-2">
                Select a quotation above to enter sample data
              </p>
              <button
                onClick={() => openSampleForm(filteredQuotes[0]?.id || '')}
                disabled={filteredQuotes.length === 0}
                className="mt-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-medium py-2 px-4 rounded-lg text-sm"
              >
                {filteredQuotes.length > 0 ? 'Add Sample Analysis' : 'No quotations available'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Sample Comparison Form Modal */}
      {showSampleForm && selectedQuoteData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Sample Analysis</h2>
                  <p className="text-gray-600 mt-1">Quote: {selectedQuoteData?.id} - {selectedQuoteData?.customerName}</p>
                </div>
                <button
                  onClick={() => setShowSampleForm(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="flex items-start">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">Enter Sample Analysis Data</p>
                    <p className="text-sm text-blue-700 mt-1">
                      This quotation contains {selectedQuoteData.tests.length} test{selectedQuoteData.tests.length !== 1 ? 's' : ''} with a total value of ₹{selectedQuoteData.totalAmount.toLocaleString()}.
                      Please enter the actual sample data received for comparison.
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSampleFormSubmit} className="space-y-6">
                {/* Test Comparison Table */}
                <div className="overflow-x-auto">
                  <table className="w-full border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Test Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Sample Type</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Quoted Quantity</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Actual Quantity</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Quoted Value (₹)</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-900">Actual Value (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuoteData.tests.map((test, index) => (
                        <tr key={test.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-gray-900">{test.testName}</td>
                          <td className="py-3 px-4 text-gray-900">{test.productMaterial}</td>
                          <td className="py-3 px-4 text-center text-gray-900">{test.quantity}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                              placeholder="Enter actual quantity"
                              value={index === 0 ? sampleFormData.samplesReceived : 0}
                              onChange={(e) => index === 0 && setSampleFormData(prev => ({ 
                                ...prev, 
                                samplesReceived: parseInt(e.target.value) || 0 
                              }))}
                            />
                          </td>
                          <td className="py-3 px-4 text-right text-gray-900">₹{test.totalPrice.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-right"
                              placeholder="Enter actual value"
                              value={index === 0 ? sampleFormData.actualSampleValue : 0}
                              onChange={(e) => index === 0 && setSampleFormData(prev => ({ 
                                ...prev, 
                                actualSampleValue: parseFloat(e.target.value) || 0 
                              }))}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date of Receipt
                    </label>
                    <input
                      type="date"
                      value={sampleFormData.dateReceived}
                      onChange={(e) => setSampleFormData(prev => ({ ...prev, dateReceived: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Sample Type
                    </label>
                    <select
                      value={sampleFormData.sampleType}
                      onChange={(e) => setSampleFormData(prev => ({ ...prev, sampleType: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select sample type</option>
                      <option value="Blood">Blood</option>
                      <option value="Urine">Urine</option>
                      <option value="Tissue">Tissue</option>
                      <option value="Serum">Serum</option>
                      <option value="Plasma">Plasma</option>
                      <option value="Swab">Swab</option>
                      <option value="Biopsy">Biopsy</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={sampleFormData.notes}
                    onChange={(e) => setSampleFormData(prev => ({ ...prev, notes: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Add any discrepancies, observations, or additional information..."
                  />
                </div>

                {/* Comparison Summary */}
                {sampleFormData.samplesReceived > 0 && sampleFormData.actualSampleValue > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Comparison Summary</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Quantity Comparison</div>
                        <div className="flex items-center">
                          <span className="text-gray-900 font-medium">
                            {selectedQuoteData.tests[0].quantity} (Quoted) vs {sampleFormData.samplesReceived} (Actual)
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            sampleFormData.samplesReceived < selectedQuoteData.tests[0].quantity ? 'bg-red-100 text-red-800' :
                            sampleFormData.samplesReceived > selectedQuoteData.tests[0].quantity ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {calculateDiscrepancy(sampleFormData.samplesReceived, selectedQuoteData.tests[0].quantity).toFixed(1)}% 
                            {sampleFormData.samplesReceived === selectedQuoteData.tests[0].quantity ? ' (Exact Match)' : ''}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Value Comparison</div>
                        <div className="flex items-center">
                          <span className="text-gray-900 font-medium">
                            ₹{selectedQuoteData.tests[0].totalPrice.toLocaleString()} (Quoted) vs ₹{sampleFormData.actualSampleValue.toLocaleString()} (Actual)
                          </span>
                          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                            sampleFormData.actualSampleValue < selectedQuoteData.tests[0].totalPrice ? 'bg-red-100 text-red-800' :
                            sampleFormData.actualSampleValue > selectedQuoteData.tests[0].totalPrice ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {calculateDiscrepancy(sampleFormData.actualSampleValue, selectedQuoteData.tests[0].totalPrice).toFixed(1)}%
                            {sampleFormData.actualSampleValue === selectedQuoteData.tests[0].totalPrice ? ' (Exact Match)' : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex space-x-3 pt-6 border-t">
                  <button
                    type="submit"
                    disabled={isSubmitting || sampleFormData.samplesReceived <= 0}
                    className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-500 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Sample Analysis
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={generateReport}
                    disabled={reportGenerating || sampleFormData.samplesReceived <= 0}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                  >
                    {reportGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Clipboard className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSampleForm(false)}
                    className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SampleAnalysis;