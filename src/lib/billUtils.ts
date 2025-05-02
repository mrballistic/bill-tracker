import { v4 as uuidv4 } from 'uuid';
import { Bill, BillFormData } from '../models/Bill';

/**
 * Creates a new Bill object with a unique ID
 */
export const createBill = (billData: BillFormData): Bill => {
  return {
    id: uuidv4(),
    ...billData,
  };
};

/**
 * Sorts bills by date (most recent first)
 */
export const sortBillsByDate = (bills: Bill[]): Bill[] => {
  return [...bills].sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

/**
 * Groups bills by category
 */
export const groupBillsByCategory = (bills: Bill[]): Record<string, Bill[]> => {
  return bills.reduce((acc: Record<string, Bill[]>, bill) => {
    if (!acc[bill.category]) {
      acc[bill.category] = [];
    }
    acc[bill.category].push(bill);
    return acc;
  }, {});
};

/**
 * Calculates total amount by category
 */
export const calculateTotalByCategory = (bills: Bill[]): Record<string, number> => {
  const groupedBills = groupBillsByCategory(bills);
  const result: Record<string, number> = {};
  
  Object.keys(groupedBills).forEach(category => {
    result[category] = groupedBills[category].reduce(
      (sum, bill) => sum + bill.amount, 
      0
    );
  });
  
  return result;
};

/**
 * Calculates total amount of all bills
 */
export const calculateTotalAmount = (bills: Bill[]): number => {
  return bills.reduce((total, bill) => total + bill.amount, 0);
};

/**
 * Get bills for the current month
 */
export const getCurrentMonthBills = (bills: Bill[]): Bill[] => {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return bills.filter(bill => {
    const billDate = new Date(bill.date);
    return billDate.getMonth() === currentMonth && 
           billDate.getFullYear() === currentYear;
  });
};
