'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Bill, BillFormData } from '../models/Bill';
import { createBill, sortBillsByDate } from '../lib/billUtils';

// Helper to get the correct base path in both development and production
const getBasePath = () => {
  // In development, this will be empty
  // In production with GitHub Pages, this will be '/bill-tracker' or whatever is set in NEXT_PUBLIC_BASE_PATH
  return process.env.NEXT_PUBLIC_BASE_PATH || '';
};

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
  const [isStatic, setIsStatic] = useState(false);

  // Load bills when component mounts
  useEffect(() => {
    const loadBills = async () => {
      try {
        setLoading(true);
        
        // First try to fetch from API route
        try {
          const basePath = getBasePath();
          const response = await fetch(`${basePath}/api/bills`);
          
          if (response.ok) {
            const data = await response.json();
            setBills(sortBillsByDate(data.bills || []));
            setError(null);
            setIsStatic(false);
            return; // Exit early if API fetch was successful
          }
        } catch (apiError) {
          console.log('API route not available, falling back to localStorage');
          setIsStatic(true);
        }
        
        // Fall back to localStorage if API fetch fails (static deployment)
        try {
          const storedBills = localStorage.getItem(STORAGE_KEY);
          if (storedBills) {
            setBills(sortBillsByDate(JSON.parse(storedBills)));
          } else {
            // Try to fetch the initial data file directly (useful for first load in static deployment)
            try {
              const basePath = getBasePath();
              const staticResponse = await fetch(`${basePath}/data/bills.json`);
              if (staticResponse.ok) {
                const staticData = await staticResponse.json();
                const initialBills = staticData.bills || [];
                setBills(sortBillsByDate(initialBills));
                // Also save to localStorage for future use
                localStorage.setItem(STORAGE_KEY, JSON.stringify(initialBills));
              } else {
                setBills([]);
              }
            } catch (staticError) {
              console.error('Could not load static data file:', staticError);
              setBills([]);
            }
          }
        } catch (localStorageError) {
          console.error('LocalStorage error:', localStorageError);
          setBills([]);
        }
        
      } catch (err) {
        console.error('Error loading bills:', err);
        setError('Failed to load bills');
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
        if (isStatic) {
          // Save to localStorage in static deployment
          localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
        } else {
          // Save bills via API route in development
          const basePath = getBasePath();
          await fetch(`${basePath}/api/bills`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bills }),
          });
        }
      } catch (err) {
        console.error('Error saving bills:', err);
        setError('Failed to save bills');
        
        // Fallback to localStorage if API save fails
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(bills));
        } catch (localStorageError) {
          console.error('LocalStorage error:', localStorageError);
        }
      }
    };

    saveBills();
  }, [bills, loading, isStatic]);

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
