'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bill, BillFormData } from '../models/Bill';
import { createBill, sortBillsByDate } from '../lib/billUtils';

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

  // Load bills from local storage when component mounts
  useEffect(() => {
    const loadBills = async () => {
      try {
        setLoading(true);
        // Fetch bills from API route
        const response = await fetch('/api/bills');
        
        if (!response.ok) {
          throw new Error('Failed to load bills');
        }
        
        const data = await response.json();
        setBills(sortBillsByDate(data.bills));
        setError(null);
      } catch (err) {
        console.error('Error loading bills:', err);
        setError('Failed to load bills');
        // Initialize with empty array if we can't load bills
        setBills([]);
      } finally {
        setLoading(false);
      }
    };

    loadBills();
  }, []);

  // Save bills whenever the state changes
  useEffect(() => {
    const saveBills = async () => {
      // Skip saving on initial load
      if (loading) return;
      
      try {
        // Save bills via API route
        await fetch('/api/bills', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bills }),
        });
      } catch (err) {
        console.error('Error saving bills:', err);
        setError('Failed to save bills');
      }
    };

    saveBills();
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
