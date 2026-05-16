// Number to Words conversion utility for Indian Rupees
export function convertNumberToWords(num: number): string {
  if (num === 0) return 'Zero Rupees Only';
  
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  function convertHundreds(num: number): string {
    let result = '';
    
    if (num >= 100) {
      result += ones[Math.floor(num / 100)] + ' Hundred ';
      num %= 100;
    }
    
    if (num >= 20) {
      result += tens[Math.floor(num / 10)] + ' ';
      num %= 10;
    } else if (num >= 10) {
      result += teens[num - 10] + ' ';
      return result;
    }
    
    if (num > 0) {
      result += ones[num] + ' ';
    }
    
    return result;
  }
  
  // Separate rupees and paise
  const rupees = Math.floor(num);
  const paise = Math.round((num - rupees) * 100);
  
  let result = '';
  
  // Convert rupees
  if (rupees >= 10000000) {
    const crores = Math.floor(rupees / 10000000);
    result += convertHundreds(crores) + (crores === 1 ? 'Crore ' : 'Crores ');
    const remainder = rupees % 10000000;
    
    if (remainder >= 100000) {
      const lakhs = Math.floor(remainder / 100000);
      result += convertHundreds(lakhs) + (lakhs === 1 ? 'Lakh ' : 'Lakhs ');
      const finalRemainder = remainder % 100000;
      if (finalRemainder > 0) {
        result += convertHundreds(finalRemainder);
      }
    } else if (remainder > 0) {
      result += convertHundreds(remainder);
    }
  } else if (rupees >= 100000) {
    const lakhs = Math.floor(rupees / 100000);
    result += convertHundreds(lakhs) + (lakhs === 1 ? 'Lakh ' : 'Lakhs ');
    const remainder = rupees % 100000;
    if (remainder > 0) {
      result += convertHundreds(remainder);
    }
  } else {
    result += convertHundreds(rupees);
  }
  
  // Add "Rupees"
  result = 'Rupees ' + result.trim();
  
  // Add paise if present
  if (paise > 0) {
    result += ' and Paise ' + convertHundreds(paise).trim();
  }
  
  result += ' Only';
  
  return result;
}

export function calculateTax(amount: number, taxType: 'CGST_SGST' | 'IGST') {
  if (taxType === 'CGST_SGST') {
    const cgstRate = 9;
    const sgstRate = 9;
    const cgstAmount = (amount * cgstRate) / 100;
    const sgstAmount = (amount * sgstRate) / 100;
    
    return {
      cgstRate,
      sgstRate,
      igstRate: 0,
      cgstAmount,
      sgstAmount,
      igstAmount: 0,
      totalTaxAmount: cgstAmount + sgstAmount
    };
  } else {
    const igstRate = 18;
    const igstAmount = (amount * igstRate) / 100;
    
    return {
      cgstRate: 0,
      sgstRate: 0,
      igstRate,
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount,
      totalTaxAmount: igstAmount
    };
  }
}