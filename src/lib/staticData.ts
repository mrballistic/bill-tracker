import { Bill } from '@/models/Bill';

// Sample static bill data for the static version of the app
export const staticBills: Bill[] = [
  {
    id: 'a1s2d3f4-g5h6-j7k8-l9p0-o1i2u3y4t5r6',
    name: 'Auto Repair',
    amount: 350,
    date: '2025-05-10',
    category: 'Transportation',
    isPaid: false,
    notes: 'Brake service and oil change'
  },
  {
    id: 'd1f2g3h4-j5k6-l7p8-o9i0-u1y2t3r4e5w6',
    name: 'Dentist',
    amount: 175,
    date: '2025-05-07',
    category: 'Health',
    isPaid: false,
    notes: 'Routine checkup and cleaning'
  },
  {
    id: 'a9b8c7d6-e5f4-g3h2-i1j0-k9l8m7n6o5p4',
    name: 'Property Tax',
    amount: 875,
    date: '2025-05-05',
    category: 'Housing',
    isPaid: false,
    notes: 'Quarterly payment'
  },
  {
    id: '111aaa-222bbb-333ccc-444ddd-555eee',
    name: 'Microsoft 365',
    amount: 9.99,
    date: '2025-05-03',
    category: 'Software',
    isPaid: false,
    notes: 'Family subscription'
  },
  {
    id: '5aeb6305-2bf9-4438-8d40-7f0a66a60067',
    name: 'Gas',
    amount: 15,
    date: '2025-05-02',
    category: 'Utilities',
    isPaid: true,
    notes: 'I like cooking with gas'
  },
  {
    id: 'fe987612-3a4b-5c6d-7e8f-9a0b1c2d3e4f',
    name: 'Internet',
    amount: 79.99,
    date: '2025-05-01',
    category: 'Utilities',
    isPaid: false,
    notes: 'Fiber optic plan'
  },
  {
    id: '1a1a2b2b-3c3c-4d4d-5e5e-6f6f7g7g8h8h',
    name: 'Adobe Creative Cloud',
    amount: 52.99,
    date: '2025-05-01',
    category: 'Software',
    isPaid: false,
    notes: 'Annual plan paid monthly'
  },
  {
    id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
    name: 'Cell Phone',
    amount: 65.50,
    date: '2025-04-28',
    category: 'Communications',
    isPaid: true,
    notes: 'Family plan'
  },
  {
    id: 'aaaa1111-bbbb-2222-cccc-3333dddd4444',
    name: 'Spotify',
    amount: 14.99,
    date: '2025-04-28',
    category: 'Entertainment',
    isPaid: true,
    notes: 'Family plan'
  },
  {
    id: 't1r2e3w4-q5a6-s7d8-f9g0-h1j2k3l4p5o6',
    name: 'Restaurant',
    amount: 118.92,
    date: '2025-04-28',
    category: 'Food',
    isPaid: true,
    notes: 'Special celebration'
  }
];

// Helper functions for static bill operations

// Format currency to USD
export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

// Format date to a more readable format
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Get total bills amount
export const getTotalAmount = () => {
  return staticBills.reduce((total, bill) => total + bill.amount, 0);
};

// Get unpaid bills amount
export const getUnpaidAmount = () => {
  return staticBills
    .filter(bill => !bill.isPaid)
    .reduce((total, bill) => total + bill.amount, 0);
};

// Get all unique categories
export const getCategories = () => {
  const categories = new Set(staticBills.map(bill => bill.category));
  return Array.from(categories);
};

// Get spending by category
export const getSpendingByCategory = () => {
  const categoryTotals: Record<string, number> = {};
  
  staticBills.forEach(bill => {
    if (categoryTotals[bill.category]) {
      categoryTotals[bill.category] += bill.amount;
    } else {
      categoryTotals[bill.category] = bill.amount;
    }
  });
  
  return Object.entries(categoryTotals).map(([category, amount]) => ({
    category,
    amount
  }));
};

// Get monthly spending
export const getMonthlySummary = () => {
  const monthlyData: Record<string, number> = {};
  
  staticBills.forEach(bill => {
    const date = new Date(bill.date);
    const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (monthlyData[monthYear]) {
      monthlyData[monthYear] += bill.amount;
    } else {
      monthlyData[monthYear] = bill.amount;
    }
  });
  
  // Sort by month-year
  return Object.entries(monthlyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([monthYear, amount]) => {
      const [year, month] = monthYear.split('-');
      const date = new Date(Number(year), Number(month) - 1);
      const monthName = date.toLocaleString('en-US', { month: 'short' });
      
      return {
        month: `${monthName} ${year}`,
        amount
      };
    });
};