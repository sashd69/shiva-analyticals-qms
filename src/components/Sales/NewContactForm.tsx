import React, { useState } from 'react';
import { 
  User, 
  Building, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  X,
  AlertCircle,
  Info
} from 'lucide-react';
import { CustomerContact, ProgressStatus } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface NewContactFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (contact: Omit<CustomerContact, 'id' | 'createdAt' | 'updatedAt' | 'statusHistory'>) => void;
}

const NewContactForm: React.FC<NewContactFormProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    companyName: '',
    contactPerson: '',
    contactPosition: '',
    email: '',
    phone: '',
    address: '',
    progressStatus: 'initial_call' as ProgressStatus,
    notes: '',
    priority: 'medium' as 'low' | 'medium' | 'high'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const { state } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer name is required';
    }
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/.test(formData.phone.replace(/[\s\-]/g, ''))) {
      newErrors.phone = 'Please enter a valid Indian phone number';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
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
      // Simulate API call
      console.log('Submitting contact form:', {
        ...formData,
        salesEmployeeId: state.user?.id
      });
      
      onSave({
        ...formData,
        salesEmployeeId: state.user?.id || ''
      });
      
      // Reset form
      setFormData({
        customerName: '',
        companyName: '',
        contactPerson: '',
        contactPosition: '',
        email: '',
        phone: '',
        address: '',
        progressStatus: 'initial_call',
        notes: '',
        priority: 'medium'
      });
      setCurrentStep(1);
      setErrors({});
      
      onClose();
    } catch (error) {
      console.error('Error saving contact:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Add New Contact</h2>
              <p className="text-gray-600 mt-1">Create a new customer contact record and start tracking their sales progress</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-2"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-8">
              {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep ? 'bg-black text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {step === 1 ? 'Customer Info' : step === 2 ? 'Contact Details' : 'Progress Setup'}
                  </span>
                  {step < totalSteps && <div className="w-16 h-0.5 bg-gray-300 ml-4"></div>}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Step 1: Customer Information */}
            {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Building className="h-5 w-5 mr-2 text-black" />
                Step 1: Customer Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Customer Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => handleInputChange('customerName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.customerName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter customer name"
                  />
                  {errors.customerName && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.customerName}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => handleInputChange('companyName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                      errors.companyName ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter company name"
                  />
                  {errors.companyName && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.companyName}
                    </div>
                  )}
                </div>
              </div>
            </div>
            )}

            {/* Step 2: Contact Person Details */}
            {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <User className="h-5 w-5 mr-2 text-black" />
                Step 2: Contact Person Details
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Person <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.contactPerson}
                    onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.contactPerson ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter contact person name"
                  />
                  {errors.contactPerson && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.contactPerson}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position/Designation
                  </label>
                  <input
                    type="text"
                    value={formData.contactPosition}
                    onChange={(e) => handleInputChange('contactPosition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter position/designation"
                  />
                </div>
              </div>
            </div>
            )}

            {/* Step 3: Contact Information & Progress Setup */}
            {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Mail className="h-5 w-5 mr-2 text-black" />
                Step 3: Contact Information & Progress Setup
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.email ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.phone ? 'border-red-500' : 'border-gray-200'
                    }`}
                    placeholder="+91 98765 43210"
                  />
                  {errors.phone && (
                    <div className="flex items-center mt-1 text-red-600 text-sm">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.phone}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-md font-semibold text-gray-900">Sales Progress Setup</h4>
                
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex items-start">
                    <Info className="h-5 w-5 text-black mr-2 mt-0.5" />
                    <div>
                      <p className="text-black text-sm font-medium">Progress Tracking</p>
                      <p className="text-gray-700 text-sm mt-1">
                        This contact will start at "Initial Call" status. You can update their progress as you move them through: 
                        Initial Call → Offline Meeting → Quotation Phase → Negotiation → Closed Won/Lost
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Priority Level
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => handleInputChange('priority', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Initial Status
                    </label>
                    <select
                      value={formData.progressStatus}
                      onChange={(e) => handleInputChange('progressStatus', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                    >
                      <option value="initial_call">Initial Call</option>
                      <option value="offline_meeting">Offline Meeting</option>
                      <option value="quotation_phase">Quotation Phase</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent ${
                    errors.address ? 'border-red-500' : 'border-gray-200'
                  }`}
                  placeholder="Enter complete address"
                />
                {errors.address && (
                  <div className="flex items-center mt-1 text-red-600 text-sm">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {errors.address}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Initial Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Enter any notes about the initial contact or conversation..."
                />
              </div>
            </div>
            )}

            {/* Form Actions */}
            <div className="flex space-x-3 pt-6 border-t">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={() => setCurrentStep(currentStep - 1)}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors duration-200"
                >
                  Previous
                </button>
              )}
              
              {currentStep < totalSteps ? (
                <button
                  type="button"
                  onClick={() => {
                    if (currentStep === 1) {
                      if (!formData.customerName.trim() || !formData.companyName.trim()) {
                        setErrors({ customerName: !formData.customerName.trim() ? 'Customer name is required' : '', companyName: !formData.companyName.trim() ? 'Company name is required' : '' });
                        return;
                      }
                    } else if (currentStep === 2) {
                      if (!formData.contactPerson.trim()) {
                        setErrors({ contactPerson: 'Contact person is required' });
                        return;
                      }
                    }
                    setErrors({});
                    setCurrentStep(currentStep + 1);
                  }}
                  className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                >
                  Next Step
                </button>
              ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-black hover:bg-gray-800 disabled:bg-gray-600 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating Contact...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Contact & Start Tracking
                  </>
                )}
              </button>
              )}
              
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

export default NewContactForm;