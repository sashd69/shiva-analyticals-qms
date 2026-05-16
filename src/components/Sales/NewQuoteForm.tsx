import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  User, 
  Building, 
  Plus, 
  Trash2, 
  Save, 
  X,
  AlertCircle,
  Search,
  Calculator,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';
import { Quote, QuoteTest, LaboratoryTest, CustomerContact } from '../../types';
import { mockTests } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { calculateTax, convertNumberToWords } from '../../utils/numberToWords';

interface NewQuoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  contacts: CustomerContact[];
  onSave: (quote: Omit<Quote, 'id' | 'createdAt' | 'updatedAt' | 'version' | 'versionHistory' | 'attachments' | 'lastAutoSave'>) => void;
}

const NewQuoteForm: React.FC<NewQuoteFormProps> = ({ isOpen, onClose, contacts, onSave }) => {
  const { state } = useAuth();
  const [formData, setFormData] = useState({
    customerContactId: '',
    customerName: '',
    companyName: '',
    customerAddress: '',
    kindAttention: '',
    emailId: '',
    phoneNumber: '',
    mobileNumber: '',
    title: '',
    status: 'draft' as const,
    expiresAt: '',
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    additionalCharges: 0,
    taxType: 'CGST_SGST' as 'CGST_SGST' | 'IGST' | 'LUT',
    department: '',
    departmentId: ''
  });

  const [selectedTests, setSelectedTests] = useState<QuoteTest[]>([]);
  const [testSearchTerm, setTestSearchTerm] = useState('');
  const [showTestSelector, setShowTestSelector] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Set department from auth context
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      department: state.selectedDepartment || '',
      departmentId: state.selectedDepartment || ''
    }));
  }, [state.selectedDepartment]);

  const filteredTests = mockTests.filter(test => 
    test.name.toLowerCase().includes(testSearchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(testSearchTerm.toLowerCase())
  );

  const calculateTotals = () => {
    const subtotal = selectedTests.reduce((sum, test) => sum + test.totalPrice, 0);
    const totalAfterCharges = subtotal + formData.additionalCharges;
    
    const taxCalculation = calculateTax(totalAfterCharges, formData.taxType);
    const totalWithTax = totalAfterCharges + taxCalculation.totalTaxAmount;
    const roundOff = Math.round(totalWithTax) - totalWithTax;
    const finalAmount = Math.round(totalWithTax);
    
    return {
      subtotal,
      totalAfterCharges,
      ...taxCalculation,
      lutAmount: taxCalculation.totalTaxAmount,
      roundOff,
      finalAmount,
      amountInWords: convertNumberToWords(finalAmount)
    };
  };

  const totals = calculateTotals();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerContactId) {
      newErrors.customerContactId = 'Please select a customer';
    }
    if (!formData.title.trim()) {
      newErrors.title = 'Quote title is required';
    }
    if (!formData.customerAddress.trim()) {
      newErrors.customerAddress = 'Customer address is required';
    }
    if (!formData.emailId.trim()) {
      newErrors.emailId = 'Email ID is required';
    }
    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required';
    }
    if (!formData.expiresAt) {
      newErrors.expiresAt = 'Expiry date is required';
    } else {
      const expiryDate = new Date(formData.expiresAt);
      const today = new Date();
      if (expiryDate <= today) {
        newErrors.expiresAt = 'Expiry date must be in the future';
      }
    }
    if (selectedTests.length === 0) {
      newErrors.tests = 'At least one test must be selected';
    }
    if (!formData.department) {
      newErrors.department = 'Department is required. Please select a department first.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onSave({
        ...formData,
        tests: selectedTests,
        totalAmount: totals.totalAfterCharges,
        subtotal: totals.subtotal,
        cgstRate: totals.cgstRate,
        sgstRate: totals.sgstRate,
        igstRate: totals.igstRate,
        cgstAmount: totals.cgstAmount,
        sgstAmount: totals.sgstAmount,
        igstAmount: totals.igstAmount,
        totalTaxAmount: totals.totalTaxAmount,
        roundOff: totals.roundOff, 
        department: formData.department,
        departmentId: formData.departmentId,
        finalAmount: totals.finalAmount,
        amountInWords: totals.amountInWords
      });
      
      // Reset form
      setFormData({
        customerContactId: '',
        customerName: '',
        companyName: '',
        customerAddress: '',
        kindAttention: '',
        emailId: '',
        phoneNumber: '',
        mobileNumber: '',
        title: '',
        status: 'draft',
        expiresAt: '',
        notes: '',
        priority: 'medium',
        additionalCharges: 0,
        taxType: 'CGST_SGST',
        department: state.selectedDepartment || '',
        departmentId: state.selectedDepartment || ''
      });
      setSelectedTests([]);
      
      onClose();
    } catch (error) {
      console.error('Error saving quote:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCustomerChange = (contactId: string) => {
    const contact = contacts.find(c => c.id === contactId);
    if (contact) {
      setFormData(prev => ({
        ...prev,
        customerContactId: contactId,
        customerName: contact.customerName,
        companyName: contact.companyName,
        customerAddress: contact.address,
        kindAttention: contact.contactPerson,
        emailId: contact.email,
        phoneNumber: contact.phone,
        mobileNumber: contact.phone
      }));
    }
    if (errors.customerContactId) {
      setErrors(prev => ({ ...prev, customerContactId: '' }));
    }
  };

  const addTest = (test: LaboratoryTest) => {
    const newQuoteTest: QuoteTest = {
      id: `${selectedTests.length + 1}`,
      testId: test.id,
      productMaterial: test.category,
      testName: test.name,
      testMethod: test.methodology,
      category: test.category,
      unitPrice: test.unitPrice,
      quantity: 1,
      totalPrice: test.unitPrice,
      turnaroundTime: test.turnaroundTime
    };
    
    setSelectedTests(prev => [...prev, newQuoteTest]);
    setShowTestSelector(false);
    setTestSearchTerm('');
    
    if (errors.tests) {
      setErrors(prev => ({ ...prev, tests: '' }));
    }
  };

  const updateTestQuantity = (testId: string, quantity: number) => {
    if (quantity < 1) return;
    
    setSelectedTests(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          quantity,
          totalPrice: test.unitPrice * quantity
        };
      }
      return test;
    }));
  };

  const updateTestField = (testId: string, field: string, value: string) => {
    setSelectedTests(prev => prev.map(test => {
      if (test.id === testId) {
        return {
          ...test,
          [field]: value
        };
      }
      return test;
    }));
  };

  const removeTest = (testId: string) => {
    setSelectedTests(prev => prev.filter(test => test.id !== testId));
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Set default expiry date to 30 days from now
  React.useEffect(() => {
    if (!formData.expiresAt) {
      const defaultExpiry = new Date();
      defaultExpiry.setDate(defaultExpiry.getDate() + 30);
      setFormData(prev => ({
        ...prev,
        expiresAt: defaultExpiry.toISOString().split('T')[0]
      }));
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Quotation</h2>
              <p className="text-gray-600 mt-1">Generate a professional quotation with complete details</p>
              <p className="text-blue-600 font-medium mt-1">Department: {formData.department}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Customer Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-black" />
                Customer Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Customer <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.customerContactId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.customerContactId ? 'border-red-500' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Choose a customer...</option>
                    {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                        {contact.customerName} - {contact.companyName}
                      </option>
                    ))}
                  </select>
                  {errors.customerContactId && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.customerContactId}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quote Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.title ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter quote title"
                  />
                  {errors.title && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.title}
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name & Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.customerAddress}
                    onChange={(e) => handleInputChange('customerAddress', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.customerAddress ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter complete customer address"
                  />
                  {errors.customerAddress && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.customerAddress}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Kind Attention
                    </label>
                    <input
                      type="text"
                      value={formData.kindAttention}
                      onChange={(e) => handleInputChange('kindAttention', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                      placeholder="Contact person name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email ID <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={formData.emailId}
                      onChange={(e) => handleInputChange('emailId', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                        errors.emailId ? 'border-red-500' : 'border-gray-200'
                      }`}
                      placeholder="customer@company.com"
                    />
                    {errors.emailId && (
                      <div className="flex items-center mt-1 text-red-600 text-sm">
                        <AlertCircle className="h-4 w-4 mr-1" />
                        {errors.emailId}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {errors.department && (
                <div className="bg-red-50 p-3 rounded-lg mb-4">
                  <div className="flex items-center text-red-700">
                    <AlertCircle className="h-5 w-5 mr-2" />
                    {errors.department}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.phoneNumber ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="+91 11 1234 5678"
                  />
                  {errors.phoneNumber && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phoneNumber}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* Quote Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-black" />
                Quote Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.expiresAt}
                    onChange={(e) => handleInputChange('expiresAt', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.expiresAt ? 'border-red-500' : 'border-gray-200'
                    }`}
                  />
                  {errors.expiresAt && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.expiresAt}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority Level
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Type
                  </label>
                  <select
                    value={formData.taxType}
                    onChange={(e) => handleInputChange('taxType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="CGST_SGST">CGST + SGST (9% + 9%)</option>
                    <option value="IGST">IGST (18%)</option>
                    <option value="LUT">LUT (0%)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Test Selection */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Test Details</h3>
                <button
                  type="button"
                  onClick={() => setShowTestSelector(!showTestSelector)}
                  className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Test
                </button>
              </div>

              {errors.tests && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {errors.tests}
                </div>
              )}

              {/* Test Selector */}
              {showTestSelector && (
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="mb-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        value={testSearchTerm}
                        onChange={(e) => setTestSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                        placeholder="Search tests..."
                      />
                    </div>
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto space-y-2">
                    {filteredTests.map(test => (
                      <div
                        key={test.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:border-gray-300 cursor-pointer"
                        onClick={() => addTest(test)}
                      >
                        <div>
                          <div className="font-medium text-gray-900">{test.name}</div>
                          <div className="text-sm text-gray-600">{test.category} • {test.methodology}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900">₹{test.unitPrice.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">per test</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Selected Tests Table */}
              {selectedTests.length > 0 && (
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">S.No</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Product/Material/Parameter</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Test Name</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Test Method</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Qty</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Price/Batch (₹)</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900">Total Amount (₹)</th>
                        <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTests.map((test, index) => (
                        <tr key={test.id} className="border-t border-gray-200">
                          <td className="py-3 px-4">{index + 1}</td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={test.productMaterial}
                              onChange={(e) => updateTestField(test.id, 'productMaterial', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-black text-sm"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={test.testName}
                              onChange={(e) => updateTestField(test.id, 'testName', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-black text-sm"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="text"
                              value={test.testMethod}
                              onChange={(e) => updateTestField(test.id, 'testMethod', e.target.value)}
                              className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-black text-sm"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={test.quantity}
                              onChange={(e) => updateTestQuantity(test.id, parseInt(e.target.value))}
                              className="w-20 px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-black text-sm"
                            >
                              {[...Array(100)].map((_, i) => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 px-4 text-right font-medium">₹{test.unitPrice.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right font-bold">₹{test.totalPrice.toLocaleString()}</td>
                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => removeTest(test.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Pricing Summary */}
            {selectedTests.length > 0 && (
              <div className="space-y-6">
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <Calculator className="h-5 w-5 text-black mr-2" />
                    <h4 className="font-semibold text-black">Price Calculation</h4>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-700">Sub Total:</span>
                      <span className="font-medium">₹{totals.subtotal.toLocaleString()}</span>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Additional Charges:
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={formData.additionalCharges}
                          onChange={(e) => handleInputChange('additionalCharges', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                          placeholder="0.00"
                        />
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total:</span>
                        <span className="font-medium">₹{totals.totalAfterCharges.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      {formData.taxType === 'CGST_SGST' ? (
                        <>
                          <div className="flex justify-between">
                            <span className="text-gray-700">CGST (9%):</span>
                            <span className="font-medium">₹{totals.cgstAmount.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-700">SGST (9%):</span>
                            <span className="font-medium">₹{totals.sgstAmount.toLocaleString()}</span>
                          </div>
                        </>
                      ) : formData.taxType === 'IGST' ? (
                        <div className="flex justify-between">
                          <span className="text-gray-700">IGST (18%):</span>
                          <span className="font-medium">₹{totals.igstAmount.toLocaleString()}</span>
                          </div>
                      ) : (
                        <div className="flex justify-between">
                          <span className="text-gray-700">LUT (0%):</span>
                          <span className="font-medium">₹{totals.lutAmount.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-700">Total Amount:</span>
                        <span className="font-medium">₹{(totals.totalAfterCharges + totals.totalTaxAmount).toLocaleString()}</span>
                      </div>
                      
                      <div className="flex justify-between">
                        <span className="text-gray-700">Round Off:</span>
                        <span className="font-medium">₹{totals.roundOff.toFixed(2)}</span>
                      </div>
                      
                      <div className="flex justify-between text-lg font-bold border-t pt-2">
                        <span className="text-black">Final Amount:</span>
                        <span className="text-black">₹{totals.finalAmount.toLocaleString()}</span>
                      </div>
                      
                      <div className="text-sm text-gray-600 italic mt-2">
                        Amount in Words: {totals.amountInWords}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                placeholder="Enter any additional notes or terms for this quote..."
              />
            </div>

            {/* Form Actions */}
            <div className="flex space-x-3 pt-6 border-t">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Quotation
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewQuoteForm;