'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bill, BillFormData } from '../models/Bill';
import { createBill, sortBillsByDate } from '../lib/billUtils';

// Storage key for localStorage
const STORAGE_KEY = 'bill-tracker-bills';

interface BillContextType {
  bills: Bill[];
  addBill: (billData: BillFormData) => void;
  updateBill: (id: string, billData: BillFormData) => void;
  deleteBill: (id: string) => void;
  togglePaidStatus: (id: string) => void;
  loading: boolean;
  error: string | null;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

interface BillProviderProps {
  children: ReactNode;
}

export const BillProvider = ({ children }: BillProviderProps) => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.resolve().then(async () => {
      try {
        const storedBills = localStorage.getItem(STORAGE_KEY);
        let billsArr: Bill[] | undefined;
        if (storedBills) {
          try {
            const parsed = JSON.parse(storedBills);
            if (Array.isArray(parsed) && parsed.length > 0) {
              billsArr = parsed;
            }
          } catch {
            // Ignore parse error, fallback to fetch
          }
        }
        if (billsArr && billsArr.length > 0) {
          setBills(sortBillsByDate(billsArr));
        } else {
          // Use basePath for static hosting (e.g., GitHub Pages)
          const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
          const billsUrl = `${basePath}/data/bills.json`;
          try {
            const response = await fetch(billsUrl);
            if (response.ok) {
              const json = await response.json();
              const billsArr = Array.isArray(json.bills) ? json.bills : Array.isArray(json) ? json : [];
              console.log('Fetched bills.json:', billsArr);
              setBills(sortBillsByDate(billsArr));
              localStorage.setItem(STORAGE_KEY, JSON.stringify(billsArr));
            } else {
              setBills([]);
            }
          } catch {
            setBills([]);
          }
        }
        setError(null);
      } catch (e) {
        console.error('Load error:', e);
        setError('Failed to load bills');
        setBills([]);
      } finally {
        setLoading(false);
      }
    });
  }, []);

  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
      } catch {
        setError('Failed to save bills');
      }
    }
  }, [bills, loading]);

  // Add a new bill
  const addBill = (billData: BillFormData) => {
    const newBill = createBill(billData);
    setBills(prev => sortBillsByDate([...prev, newBill]));
  };

  // Update an existing bill
  const updateBill = (id: string, billData: BillFormData) => {
    setBills(prev => 
      sortBillsByDate(
        prev.map(bill => 
          bill.id === id ? { ...bill, ...billData } : bill
        )
      )
    );
  };

  // Delete a bill
  const deleteBill = (id: string) => {
    setBills(prev => prev.filter(bill => bill.id !== id));
  };

  // Toggle the paid status of a bill
  const togglePaidStatus = (id: string) => {
    setBills(prev => 
      prev.map(bill => 
        bill.id === id ? { ...bill, isPaid: !bill.isPaid } : bill
      )
    );
  };

  const value = {
    bills,
    addBill,
    updateBill,
    deleteBill,
    togglePaidStatus,
    loading,
    error,
  };

  return <BillContext.Provider value={value}>{children}</BillContext.Provider>;
};

export const useBills = (): BillContextType => {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBills must be used within a BillProvider');
  }
  return context;
};
