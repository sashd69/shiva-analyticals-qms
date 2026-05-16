import { SalesTarget, MonthlyTarget, TargetNotification } from '../types';

// Helper function to generate monthly targets
const generateMonthlyTargets = (annualTarget: number, year: number, actualData?: Partial<Record<number, number>>): MonthlyTarget[] => {
  const monthlyTargets: MonthlyTarget[] = [];
  const baseMonthlyTarget = Math.round(annualTarget / 12);
  
  let remainingShortfall = 0;
  let remainingMonths = 12;
  
  for (let month = 1; month <= 12; month++) {
    const isCurrentOrPastMonth = new Date() > new Date(year, month - 1, 1);
    const actualAmount = isCurrentOrPastMonth 
      ? (actualData?.[month] || Math.round(Math.random() * baseMonthlyTarget * 1.2)) 
      : 0;
    
    let targetAmount = baseMonthlyTarget;
    
    // For past months, distribute shortfall to future months
    if (month > 1 && isCurrentOrPastMonth) {
      const previousMonth = monthlyTargets[month - 2];
      if (previousMonth.actualAmount < previousMonth.targetAmount) {
        const shortfall = previousMonth.targetAmount - previousMonth.actualAmount;
        remainingShortfall += shortfall;
      }
    }
    
    // Adjust target for current and future months
    if (!isCurrentOrPastMonth || month === new Date().getMonth() + 1) {
      const adjustedAmount = remainingMonths > 0 
        ? Math.round(remainingShortfall / remainingMonths) 
        : 0;
      
      targetAmount += adjustedAmount;
    }
    
    const shortfall = isCurrentOrPastMonth ? Math.max(0, targetAmount - actualAmount) : 0;
    const achievementPercentage = isCurrentOrPastMonth 
      ? Math.min(100, Math.round((actualAmount / targetAmount) * 100)) 
      : 0;
    
    monthlyTargets.push({
      month,
      targetAmount,
      adjustedAmount: targetAmount !== baseMonthlyTarget ? targetAmount : undefined,
      actualAmount,
      shortfall,
      personalTarget: Math.round(targetAmount * (1 + Math.random() * 0.2)), // 0-20% higher
      isAdjusted: targetAmount !== baseMonthlyTarget,
      achievementPercentage
    });
    
    if (!isCurrentOrPastMonth) {
      remainingMonths--;
    }
  }
  
  return monthlyTargets;
};

// Mock sales targets
export const mockSalesTargets: SalesTarget[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    year: 2024,
    annualTarget: 12000000,
    monthlyTargets: generateMonthlyTargets(12000000, 2024, {
      1: 1050000,
      2: 980000,
      3: 1100000,
      4: 950000,
      5: 1200000,
      6: 1050000,
      7: 900000
    }),
    notes: 'Focus on pharmaceutical clients this year',
    createdBy: 'Lisa Anderson',
    createdAt: '2024-01-05T10:30:00Z',
    updatedAt: '2024-07-15T14:20:00Z'
  },
  {
    id: '2',
    employeeId: '2',
    employeeName: 'Michael Chen',
    year: 2024,
    annualTarget: 10000000,
    monthlyTargets: generateMonthlyTargets(10000000, 2024, {
      1: 800000,
      2: 850000,
      3: 900000,
      4: 750000,
      5: 820000,
      6: 880000,
      7: 830000
    }),
    notes: 'Target increased by 10% from last year based on performance',
    createdBy: 'Lisa Anderson',
    createdAt: '2024-01-05T11:15:00Z',
    updatedAt: '2024-07-15T14:25:00Z'
  },
  {
    id: '3',
    employeeId: '3',
    employeeName: 'Emma Wilson',
    year: 2024,
    annualTarget: 8500000,
    monthlyTargets: generateMonthlyTargets(8500000, 2024, {
      1: 700000,
      2: 680000,
      3: 750000,
      4: 720000,
      5: 690000,
      6: 710000,
      7: 730000
    }),
    createdBy: 'Lisa Anderson',
    createdAt: '2024-01-05T11:45:00Z',
    updatedAt: '2024-07-15T14:30:00Z'
  },
  {
    id: '4',
    employeeId: '4',
    employeeName: 'David Rodriguez',
    year: 2024,
    annualTarget: 9500000,
    monthlyTargets: generateMonthlyTargets(9500000, 2024, {
      1: 820000,
      2: 790000,
      3: 810000,
      4: 830000,
      5: 800000,
      6: 850000,
      7: 780000
    }),
    notes: 'New focus on materials testing clients',
    createdBy: 'Lisa Anderson',
    createdAt: '2024-01-05T12:00:00Z',
    updatedAt: '2024-07-15T14:35:00Z'
  }
];

// Mock target notifications
export const mockTargetNotifications: TargetNotification[] = [
  {
    id: '1',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    message: 'Your annual sales target for 2024 has been set to ₹1.2 Cr',
    type: 'target_set',
    isRead: true,
    createdAt: '2024-01-05T10:35:00Z',
    createdBy: 'Lisa Anderson'
  },
  {
    id: '2',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    message: 'Your monthly target for March has been adjusted to ₹11.2 Lakhs due to February shortfall',
    type: 'target_adjusted',
    isRead: true,
    createdAt: '2024-03-01T09:15:00Z',
    createdBy: 'System'
  },
  {
    id: '3',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    message: 'Congratulations! You exceeded your May target by ₹1.5 Lakhs',
    type: 'target_achieved',
    isRead: true,
    createdAt: '2024-06-01T08:30:00Z',
    createdBy: 'System'
  },
  {
    id: '4',
    employeeId: '2',
    employeeName: 'Michael Chen',
    message: 'Your annual sales target for 2024 has been set to ₹1 Cr',
    type: 'target_set',
    isRead: true,
    createdAt: '2024-01-05T11:20:00Z',
    createdBy: 'Lisa Anderson'
  },
  {
    id: '5',
    employeeId: '2',
    employeeName: 'Michael Chen',
    message: 'You missed your April target by ₹1 Lakh. Remaining months have been adjusted.',
    type: 'target_missed',
    isRead: false,
    createdAt: '2024-05-01T09:00:00Z',
    createdBy: 'System'
  },
  {
    id: '6',
    employeeId: '3',
    employeeName: 'Emma Wilson',
    message: 'Your annual sales target for 2024 has been set to ₹85 Lakhs',
    type: 'target_set',
    isRead: true,
    createdAt: '2024-01-05T11:50:00Z',
    createdBy: 'Lisa Anderson'
  },
  {
    id: '7',
    employeeId: '4',
    employeeName: 'David Rodriguez',
    message: 'Your annual sales target for 2024 has been set to ₹95 Lakhs',
    type: 'target_set',
    isRead: true,
    createdAt: '2024-01-05T12:05:00Z',
    createdBy: 'Lisa Anderson'
  },
  {
    id: '8',
    employeeId: '1',
    employeeName: 'Sarah Johnson',
    message: 'Your July target was missed by ₹1 Lakh. August target has been adjusted.',
    type: 'target_missed',
    isRead: false,
    createdAt: '2024-08-01T08:15:00Z',
    createdBy: 'System'
  }
];

// Helper function to calculate target progress
export const calculateTargetProgress = (target: SalesTarget) => {
  const totalAchieved = target.monthlyTargets.reduce((sum, month) => sum + month.actualAmount, 0);
  const totalTarget = target.annualTarget;
  const achievementPercentage = Math.round((totalAchieved / totalTarget) * 100);
  const remainingAmount = totalTarget - totalAchieved;
  
  // Determine if on track based on current month and achievement
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const targetToDate = target.monthlyTargets
    .filter(m => m.month <= currentMonth)
    .reduce((sum, m) => sum + m.targetAmount, 0);
  
  const isOnTrack = totalAchieved >= targetToDate * 0.95; // Within 5% is considered on track
  
  return {
    totalAchieved,
    achievementPercentage,
    remainingAmount,
    isOnTrack
  };
};