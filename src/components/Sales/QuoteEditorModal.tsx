import React, { useState } from 'react';
import { X, Save, Plus, Trash2 } from 'lucide-react';
import { Quote, QuoteTest } from '../../types';

interface QuoteEditorModalProps {
  quote: Quote;
  onClose: () => void;
  onSave: (quoteData: any) => void;
}

const QuoteEditorModal: React.FC<QuoteEditorModalProps> = ({ quote, onClose, onSave }) => {
  const [editedQuote, setEditedQuote] = useState({
    ...quote,
    tests: [...quote.tests]
  });

  const handleTestChange = (testId: string, field: string, value: any) => {
    setEditedQuote(prev => ({
      ...prev,
      tests: prev.tests.map(test => {
        if (test.id === testId) {
          const updatedTest = { ...test, [field]: value };
          if (field === 'quantity' || field === 'unitPrice') {
            updatedTest.totalPrice = updatedTest.quantity * updatedTest.unitPrice;
          }
          return updatedTest;
        }
        return test;
      })
    }));
  };

  const handleRemoveTest = (testId: string) => {
    setEditedQuote(prev => ({
      ...prev,
      tests: prev.tests.filter(test => test.id !== testId)
    }));
  };

  const calculateTotals = () => {
    const subtotal = editedQuote.tests.reduce((sum, test) => sum + test.totalPrice, 0);
    const cgst = subtotal * 0.09;
    const sgst = subtotal * 0.09;
    const total = subtotal + cgst + sgst;
    
    return { subtotal, cgst, sgst, total };
  };

  const { subtotal, cgst, sgst, total } = calculateTotals();

  const handleSave = () => {
    const updatedQuote = {
      ...editedQuote,
      status: editedQuote.status,
      priority: editedQuote.priority,
      title: editedQuote.title,
      expiresAt: editedQuote.expiresAt,
      notes: editedQuote.notes,
      totalAmount: subtotal,
      cgstAmount: cgst,
      sgstAmount: sgst,
      totalTaxAmount: cgst + sgst,
      finalAmount: total,
      updatedAt: new Date().toISOString()
    };
    onSave(updatedQuote);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Edit Quote: {quote.id}</h2>
              <p className="text-gray-600">Modify quotation details and tests</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Quote Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quote Title
              </label>
              <input
                type="text"
                value={editedQuote.title}
                onChange={(e) => setEditedQuote(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expires At
              </label>
              <input
                type="date"
                value={editedQuote.expiresAt.split('T')[0]}
                onChange={(e) => setEditedQuote(prev => ({ ...prev, expiresAt: e.target.value + 'T23:59:59Z' }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                value={editedQuote.priority}
                onChange={(e) => setEditedQuote(prev => ({ ...prev, priority: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={editedQuote.status}
                onChange={(e) => setEditedQuote(prev => ({ ...prev, status: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Tests Table */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Tests</h3>
              <button
                onClick={() => {
                  const newTest: QuoteTest = {
                    id: `test-${Date.now()}`,
                    testId: '',
                    testName: 'New Test',
                    category: 'General',
                    unitPrice: 0,
                    quantity: 1,
                    totalPrice: 0,
                    turnaroundTime: 24
                  };
                  setEditedQuote(prev => ({
                    ...prev,
                    tests: [...prev.tests, newTest]
                  }));
                }}
                className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-3 rounded-lg flex items-center transition-colors duration-200"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Test
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 p-3 text-left">Test Name</th>
                    <th className="border border-gray-200 p-3 text-left">Category</th>
                    <th className="border border-gray-200 p-3 text-left">Quantity</th>
                    <th className="border border-gray-200 p-3 text-left">Unit Price (₹)</th>
                    <th className="border border-gray-200 p-3 text-left">Total Price (₹)</th>
                    <th className="border border-gray-200 p-3 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {editedQuote.tests.map((test) => (
                    <tr key={test.id}>
                      <td className="border border-gray-200 p-3">
                        <input
                          type="text"
                          value={test.testName}
                          onChange={(e) => handleTestChange(test.id, 'testName', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-200 p-3">
                        <input
                          type="text"
                          value={test.category}
                          onChange={(e) => handleTestChange(test.id, 'category', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-200 p-3">
                        <input
                          type="number"
                          min="1"
                          value={test.quantity}
                          onChange={(e) => handleTestChange(test.id, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-200 p-3">
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={test.unitPrice}
                          onChange={(e) => handleTestChange(test.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-2 py-1 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-200 p-3 text-right font-medium">
                        ₹{test.totalPrice.toLocaleString()}
                      </td>
                      <td className="border border-gray-200 p-3">
                        <button
                          onClick={() => handleRemoveTest(test.id)}
                          className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="mb-6">
            <div className="flex justify-end">
              <div className="w-80 bg-gray-50 rounded-lg p-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Sub Total:</span>
                    <span className="font-medium">₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>CGST (9%):</span>
                    <span className="font-medium">₹{cgst.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SGST (9%):</span>
                    <span className="font-medium">₹{sgst.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between">
                    <span className="font-bold">Final Amount:</span>
                    <span className="font-bold text-lg">₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={editedQuote.notes || ''}
              onChange={(e) => setEditedQuote(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add any additional notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex space-x-3 pt-6 border-t">
            <button
              onClick={handleSave}
              className="flex-1 bg-black hover:bg-gray-800 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuoteEditorModal;