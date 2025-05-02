export interface Bill {
  id: string;
  name: string;
  amount: number;
  date: string;
  category: string;
  isPaid: boolean;
  notes?: string;
}

export type BillFormData = Omit<Bill, 'id'>;

export const BILL_CATEGORIES = [
  'Housing',
  'Utilities',
  'Transportation',
  'Food',
  'Healthcare',
  'Insurance',
  'Entertainment',
  'Subscription',
  'Debt',
  'Other'
];
