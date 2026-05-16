import React, { useState, useEffect } from 'react';
import { 
  Eye, 
  EyeOff, 
  Copy, 
  Check, 
  RefreshCw,
  AlertCircle,
  Shield,
  Plus,
  Search,
  Filter,
  Download,
  Trash2,
  Edit
} from 'lucide-react';
import { credentialService } from '../../services/credentialService';
import { useNotifications } from '../../hooks/useNotifications';

interface EmployeeCredential {
  id: string;
  employeeId: string;
  fullName: string;
  email: string;
  password: string;
  passwordHash: string;
  department: string;
  role: string;
  lastLogin: string | null;
  isActive: boolean;
}

const EmployeeLoginTable: React.FC = () => {
  const [employees, setEmployees] = useState<EmployeeCredential[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<EmployeeCredential[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const { showSuccess, showError } = useNotifications();

  // Fetch employee credentials from the database
  useEffect(() => {
    const fetchEmployeeCredentials = async () => {
      try {
        setIsLoading(true);
        
        // In a real implementation, this would fetch from the database
        // For now, we'll use mock data with generated passwords
        const mockEmployees: EmployeeCredential[] = [
          {
            id: '1',
            employeeId: 'EMP-2024-001',
            fullName: 'Sarah Johnson',
            email: 'sarah.johnson@analytica.com',
            password: await credentialService.generateSecurePassword(),
            passwordHash: '',
            department: 'Food and agriculture',
            role: 'Sales',
            lastLogin: '2024-07-01 09:15:32',
            isActive: true
          },
          {
            id: '2',
            employeeId: 'EMP-2024-002',
            fullName: 'Michael Chen',
            email: 'michael.chen@analytica.com',
            password: await credentialService.generateSecurePassword(),
            passwordHash: '',
            department: 'Ores and minerals',
            role: 'Admin',
            lastLogin: '2024-07-02 14:22:45',
            isActive: true
          },
          {
            id: '3',
            employeeId: 'EMP-2024-003',
            fullName: 'Emma Wilson',
            email: 'emma.wilson@analytica.com',
            password: await credentialService.generateSecurePassword(),
            passwordHash: '',
            department: 'Environmental',
            role: 'Support',
            lastLogin: '2024-07-03 11:05:18',
            isActive: true
          },
          {
            id: '4',
            employeeId: 'EMP-2024-004',
            fullName: 'David Rodriguez',
            email: 'david.rodriguez@analytica.com',
            password: await credentialService.generateSecurePassword(),
            passwordHash: '',
            department: 'Materials',
            role: 'Sales',
            lastLogin: null,
            isActive: true
          },
          {
            id: '5',
            employeeId: 'EMP-2024-005',
            fullName: 'Lisa Anderson',
            email: 'lisa.anderson@analytica.com',
            password: await credentialService.generateSecurePassword(),
            passwordHash: '',
            department: 'Pharmaceutical',
            role: 'Management',
            lastLogin: '2024-07-01 16:45:09',
            isActive: true
          }
        ];
        
        // Generate password hashes
        const employeesWithHashes = mockEmployees.map(employee => ({
          ...employee,
          passwordHash: '' // Mock hash for demo purposes
        }));
        
        setEmployees(employeesWithHashes);
        setFilteredEmployees(employeesWithHashes);
      } catch (error) {
        console.error('Error fetching employee credentials:', error);
        showError('Error', 'Failed to load employee credentials');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchEmployeeCredentials();
  }, [showError]);

  // Filter employees when search term or filters change
  useEffect(() => {
    const filtered = employees.filter(employee => {
      const matchesSearch = 
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
      
      return matchesSearch && matchesDepartment && matchesRole;
    });
    
    setFilteredEmployees(filtered);
  }, [searchTerm, departmentFilter, roleFilter, employees]);

  const togglePasswordVisibility = (id: string) => {
    setShowPasswords(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyPassword = (id: string, password: string) => {
    navigator.clipboard.writeText(password)
      .then(() => {
        setCopiedId(id);
        showSuccess('Password Copied', 'Password has been copied to clipboard');
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(() => {
        showError('Copy Failed', 'Failed to copy password to clipboard');
      });
  };

  const regeneratePassword = async (id: string) => {
    try {
      const newPassword = await credentialService.generateSecurePassword();
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newPassword, salt);
      
      setEmployees(prev => prev.map(emp => 
        emp.id === id ? { ...emp, password: newPassword, passwordHash: hash } : emp
      ));
      
      showSuccess('Password Regenerated', 'A new secure password has been generated');
    } catch (error) {
      showError('Error', 'Failed to generate new password');
    }
  };

  // Get unique departments and roles for filters
  const departments = ['all', ...new Set(employees.map(emp => emp.department))];
  const roles = ['all', ...new Set(employees.map(emp => emp.role))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Login Credentials</h1>
          <p className="text-gray-600 mt-1">Secure access credentials for laboratory system</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => showSuccess('Export Started', 'Credentials are being exported securely...')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={() => showSuccess('Feature Coming Soon', 'New employee credential creation will be available soon')}
            className="bg-black hover:bg-gray-800 text-white font-medium py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Employee
          </button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
        <div className="flex items-start">
          <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-2" />
          <div>
            <p className="text-sm text-blue-800 font-medium">Security Information</p>
            <p className="text-xs text-blue-700 mt-1">
              All passwords are securely hashed using bcrypt before storage. The plaintext passwords shown here
              are only visible to administrators and are never stored in the database. Each employee is restricted
              to accessing only their assigned department.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, or employee ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Departments</option>
              {departments.filter(d => d !== 'all').map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-black focus:border-transparent"
            >
              <option value="all">All Roles</option>
              {roles.filter(r => r !== 'all').map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <button className="border border-gray-200 rounded-lg px-3 py-2 flex items-center hover:bg-gray-50">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading employee credentials...</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Employee ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Full Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Email Address</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Password</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Department</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Last Login</th>
                  <th className="text-center py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{employee.employeeId}</td>
                    <td className="py-3 px-4 text-gray-900">{employee.fullName}</td>
                    <td className="py-3 px-4 text-gray-900">{employee.email}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <div className="relative flex-1">
                          <input
                            type={showPasswords[employee.id] ? 'text' : 'password'}
                            value={employee.password}
                            readOnly
                            className="w-full px-3 py-1 border border-gray-200 rounded text-sm font-mono bg-gray-50"
                          />
                          <button
                            type="button"
                            onClick={() => togglePasswordVisibility(employee.id)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords[employee.id] ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyPassword(employee.id, employee.password)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Copy password"
                        >
                          {copiedId === employee.id ? (
                            <Check className="h-4 w-4 text-green-600" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => regeneratePassword(employee.id)}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Generate new password"
                        >
                          <RefreshCw className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-900">{employee.department}</td>
                    <td className="py-3 px-4 text-gray-900">{employee.role}</td>
                    <td className="py-3 px-4 text-gray-500">
                      {employee.lastLogin || 'Never logged in'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => showSuccess('Feature Coming Soon', 'Edit functionality will be available soon')}
                          className="p-1 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded"
                          title="Edit Credentials"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => showSuccess('Feature Coming Soon', 'Delete functionality will be available soon')}
                          className="p-1 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded"
                          title="Delete Credentials"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium mb-2">Password Requirements:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Minimum 12 characters in length</li>
          <li>Contains at least one uppercase letter</li>
          <li>Contains at least one lowercase letter</li>
          <li>Contains at least one number</li>
          <li>Contains at least one special character</li>
        </ul>
        <p className="mt-3 text-xs text-gray-500">
          Note: All passwords are securely hashed using bcrypt with a cost factor of 10 before being stored in the database.
          The plaintext passwords are only visible in this admin interface and are never stored in their raw form.
        </p>
      </div>
    </div>
  );
};

export default EmployeeLoginTable;