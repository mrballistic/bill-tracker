import {
  staticBills,
  formatCurrency,
  formatDate,
  getTotalAmount,
  getUnpaidAmount,
  getCategories,
  getSpendingByCategory,
  getMonthlySummary
} from '../../lib/staticData';

describe('staticData', () => {
  describe('staticBills array', () => {
    test('should contain valid bills', () => {
      expect(Array.isArray(staticBills)).toBe(true);
      expect(staticBills.length).toBeGreaterThan(0);
      
      // Check structure of a bill
      const firstBill = staticBills[0];
      expect(firstBill).toHaveProperty('id');
      expect(firstBill).toHaveProperty('name');
      expect(firstBill).toHaveProperty('amount');
      expect(firstBill).toHaveProperty('date');
      expect(firstBill).toHaveProperty('category');
      expect(firstBill).toHaveProperty('isPaid');
    });
    
    test('should have valid data types for bill properties', () => {
      staticBills.forEach(bill => {
        expect(typeof bill.id).toBe('string');
        expect(typeof bill.name).toBe('string');
        expect(typeof bill.amount).toBe('number');
        expect(typeof bill.date).toBe('string');
        expect(typeof bill.category).toBe('string');
        expect(typeof bill.isPaid).toBe('boolean');
        if (bill.notes !== undefined) {
          expect(typeof bill.notes).toBe('string');
        }
      });
    });
  });
  
  describe('formatCurrency', () => {
    test('should format numbers as USD currency', () => {
      expect(formatCurrency(1234.56)).toBe('$1,234.56');
      expect(formatCurrency(0)).toBe('$0.00');
      expect(formatCurrency(1000000)).toBe('$1,000,000.00');
      expect(formatCurrency(0.99)).toBe('$0.99');
      expect(formatCurrency(-50.5)).toBe('-$50.50');
    });
  });
  
  describe('formatDate', () => {
    test('should format date strings to readable format', () => {
      expect(formatDate('2025-05-10')).toBe('May 10, 2025');
      expect(formatDate('2025-01-01')).toBe('Jan 1, 2025');
      expect(formatDate('2025-12-31')).toBe('Dec 31, 2025');
    });
    
    test('should handle different date inputs', () => {
      // Test with different date formats
      const date = new Date(2025, 5, 15);  // June 15, 2025
      const isoString = date.toISOString().split('T')[0]; // '2025-06-15'
      
      expect(formatDate(isoString)).toBe('Jun 15, 2025');
    });
  });
  
  describe('getTotalAmount', () => {
    test('should calculate the sum of all bill amounts', () => {
      // Calculate expected total manually for comparison
      const expectedTotal = staticBills.reduce((sum, bill) => sum + bill.amount, 0);
      expect(getTotalAmount()).toBe(expectedTotal);
      expect(typeof getTotalAmount()).toBe('number');
    });
  });
  
  describe('getUnpaidAmount', () => {
    test('should calculate the sum of unpaid bill amounts', () => {
      // Calculate expected unpaid total manually for comparison
      const expectedUnpaidTotal = staticBills
        .filter(bill => !bill.isPaid)
        .reduce((sum, bill) => sum + bill.amount, 0);
        
      expect(getUnpaidAmount()).toBe(expectedUnpaidTotal);
      expect(typeof getUnpaidAmount()).toBe('number');
    });
    
    test('should be less than or equal to the total amount', () => {
      expect(getUnpaidAmount()).toBeLessThanOrEqual(getTotalAmount());
    });
  });
  
  describe('getCategories', () => {
    test('should return an array of unique categories', () => {
      const categories = getCategories();
      
      // Check that result is an array
      expect(Array.isArray(categories)).toBe(true);
      
      // Check that all items are strings
      categories.forEach(category => {
        expect(typeof category).toBe('string');
      });
      
      // Check that the array contains unique values
      const uniqueCategories = new Set(categories);
      expect(categories.length).toBe(uniqueCategories.size);
      
      // Check that categories found in bills are present in the result
      staticBills.forEach(bill => {
        expect(categories).toContain(bill.category);
      });
    });
  });
  
  describe('getSpendingByCategory', () => {
    test('should return spending breakdown by category', () => {
      const spendingByCategory = getSpendingByCategory();
      
      // Check that result is an array
      expect(Array.isArray(spendingByCategory)).toBe(true);
      
      // Make a manual calculation to verify results
      const categorySums: Record<string, number> = {};
      staticBills.forEach(bill => {
        if (!categorySums[bill.category]) {
          categorySums[bill.category] = 0;
        }
        categorySums[bill.category] += bill.amount;
      });
      
      // Check that each category has the correct sum
      spendingByCategory.forEach(item => {
        expect(item).toHaveProperty('category');
        expect(item).toHaveProperty('amount');
        expect(typeof item.category).toBe('string');
        expect(typeof item.amount).toBe('number');
        
        // Compare with our manually calculated sums
        expect(item.amount).toBe(categorySums[item.category]);
      });
      
      // Check that all categories are covered
      const categoryNames = spendingByCategory.map(item => item.category);
      Object.keys(categorySums).forEach(category => {
        expect(categoryNames).toContain(category);
      });
    });
    
    test('should sum to the total amount', () => {
      const spendingByCategory = getSpendingByCategory();
      const totalFromCategories = spendingByCategory.reduce((sum, item) => sum + item.amount, 0);
      
      expect(totalFromCategories).toBe(getTotalAmount());
    });
  });
  
  describe('getMonthlySummary', () => {
    test('should return spending by month', () => {
      const monthlySummary = getMonthlySummary();
      
      // Check that result is an array
      expect(Array.isArray(monthlySummary)).toBe(true);
      
      // Make a manual calculation to verify results
      const monthTotals: Record<string, number> = {};
      staticBills.forEach(bill => {
        const date = new Date(bill.date);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthTotals[key]) {
          monthTotals[key] = 0;
        }
        monthTotals[key] += bill.amount;
      });
      
      // Check that all expected months are present and have correct sums
      expect(monthlySummary.length).toBe(Object.keys(monthTotals).length);
      
      // Verify the structure of the returned items
      monthlySummary.forEach(item => {
        expect(item).toHaveProperty('month');
        expect(item).toHaveProperty('amount');
        expect(typeof item.month).toBe('string');
        expect(typeof item.amount).toBe('number');
        
        // Extract the year-month from the formatted string (e.g., "May 2025" -> "2025-05")
        const parts = item.month.split(' ');
        const year = parts[1];
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthIndex = monthNames.indexOf(parts[0]);
        const monthKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}`;
        
        // Compare with our manually calculated sums
        expect(item.amount).toBe(monthTotals[monthKey]);
      });
    });
    
    test('should sum to the total amount', () => {
      const monthlySummary = getMonthlySummary();
      const totalFromMonths = monthlySummary.reduce((sum, item) => sum + item.amount, 0);
      
      expect(totalFromMonths).toBe(getTotalAmount());
    });
    
    test('should return months in chronological order', () => {
      const monthlySummary = getMonthlySummary();
      
      // Extract month and year from formatted strings
      const parsedDates = monthlySummary.map(item => {
        const [month, year] = item.month.split(' ');
        const monthIndex = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].indexOf(month);
        return { month: monthIndex, year: parseInt(year) };
      });
      
      // Check if sorted chronologically
      for (let i = 1; i < parsedDates.length; i++) {
        const prev = parsedDates[i - 1];
        const curr = parsedDates[i];
        
        const prevDate = new Date(prev.year, prev.month);
        const currDate = new Date(curr.year, curr.month);
        
        expect(prevDate.getTime()).toBeLessThanOrEqual(currDate.getTime());
      }
    });
  });
});
