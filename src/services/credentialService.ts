export interface EmployeeCredential {
  id: string;
  employeeId: string;
  profileId: string;
  email: string;
  passwordHash: string;
  departmentId: string | null;
  isActive: boolean;
  passwordLastChanged: string;
  createdAt: string;
  updatedAt: string;
}

export const credentialService = {
  async generateSecurePassword(): Promise<string> {
    const length = 12;
    const uppercaseChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijkmnopqrstuvwxyz';
    const numberChars = '23456789';
    const specialChars = '!@#$%^&*()_+[]{}|;:,.<>?';
    
    const allChars = uppercaseChars + lowercaseChars + numberChars + specialChars;
    
    // Ensure at least one of each character type
    let password = 
      uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length)) +
      lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length)) +
      numberChars.charAt(Math.floor(Math.random() * numberChars.length)) +
      specialChars.charAt(Math.floor(Math.random() * specialChars.length));
    
    // Fill the rest of the password
    for (let i = 4; i < length; i++) {
      password += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    
    // Shuffle the password
    return password.split('').sort(() => 0.5 - Math.random()).join('');
  }
};