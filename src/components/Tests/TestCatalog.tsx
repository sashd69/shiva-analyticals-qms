import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  FlaskConical, 
  Clock, 
  DollarSign, 
  Star,
  Award,
  Info
} from 'lucide-react';
import { LaboratoryTest } from '../../types';

interface TestCatalogProps {
  tests: LaboratoryTest[];
  onAddToQuote?: (test: LaboratoryTest) => void;
}

const TestCatalog: React.FC<TestCatalogProps> = ({ tests, onAddToQuote }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedTest, setSelectedTest] = useState<LaboratoryTest | null>(null);

  const categories = Array.from(new Set(tests.map(test => test.category)));

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         test.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || test.category === categoryFilter;
    return matchesSearch && matchesCategory && test.isActive;
  });

  const getPopularityColor = (popularity: number) => {
    if (popularity >= 90) return 'text-green-600';
    if (popularity >= 70) return 'text-amber-600';
    return 'text-gray-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Test Catalog</h1>
          <p className="text-gray-600 mt-1">Browse and select from our comprehensive laboratory test menu</p>
        </div>
        <div className="text-sm text-gray-600">
          {filteredTests.length} of {tests.filter(t => t.isActive).length} tests
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tests by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button className="border border-gray-200 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTests.map((test) => (
          <div
            key={test.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
            onClick={() => setSelectedTest(test)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-2">
                <FlaskConical className="h-5 w-5 text-black" />
                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {test.subcategory}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className={`h-4 w-4 ${getPopularityColor(test.popularity)}`} />
                <span className={`text-xs font-medium ${getPopularityColor(test.popularity)}`}>
                  {test.popularity}%
                </span>
              </div>
            </div>

            <h3 className="font-bold text-gray-900 mb-2">{test.name}</h3>
            <p className="text-sm text-gray-600 mb-4 line-clamp-3">{test.description}</p>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <DollarSign className="h-4 w-4 mr-1" />
                  <span>₹{test.unitPrice.toLocaleString()}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{test.turnaroundTime}h</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Method:</span>
                <span className="text-xs font-medium text-gray-700">{test.methodology}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {test.accreditation.map((acc) => (
                <span
                  key={acc}
                  className="inline-flex items-center text-xs font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                >
                  <Award className="h-3 w-3 mr-1" />
                  {acc}
                </span>
              ))}
            </div>

            {onAddToQuote && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onAddToQuote(test);
                }}
                className="w-full bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Add to Quote
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Test Detail Modal */}
      {selectedTest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedTest.name}</h2>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                      {selectedTest.category} • {selectedTest.subcategory}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Star className={`h-4 w-4 ${getPopularityColor(selectedTest.popularity)}`} />
                      <span className={`text-sm font-medium ${getPopularityColor(selectedTest.popularity)}`}>
                        {selectedTest.popularity}% popularity
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedTest(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedTest.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Pricing & Timing</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Unit Price:</span>
                        <span className="font-medium">₹{selectedTest.unitPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Turnaround Time:</span>
                        <span className="font-medium">{selectedTest.turnaroundTime} hours</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Methodology</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Method:</span>
                        <span className="font-medium">{selectedTest.methodology}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Sample Requirements</h3>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                      <p className="text-blue-800">{selectedTest.sampleRequirements}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Accreditations</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTest.accreditation.map((acc) => (
                      <span
                        key={acc}
                        className="inline-flex items-center text-sm font-medium bg-blue-100 text-blue-800 px-3 py-2 rounded-full"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        {acc}
                      </span>
                    ))}
                  </div>
                </div>

                {onAddToQuote && (
                  <div className="flex space-x-3 pt-4 border-t">
                    <button
                      onClick={() => {
                        onAddToQuote(selectedTest);
                        setSelectedTest(null);
                      }}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200"
                    >
                      Add to Quote
                    </button>
                    <button
                      onClick={() => setSelectedTest(null)}
                      className="px-6 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredTests.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FlaskConical className="h-16 w-16 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tests found</h3>
          <p className="text-gray-600">
            {searchTerm || categoryFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'No tests available in the catalog'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TestCatalog;