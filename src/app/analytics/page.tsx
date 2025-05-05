'use client';

import { Container, Typography, Box, Paper } from '@mui/material';
import { useEffect, useState } from 'react';
import { Bill } from '@/models/Bill';
import { BillProvider, useBills } from '@/contexts/BillContext';
import CategoryPieChart from '@/components/analytics/CategoryPieChart';
import MonthlyBarChart from '@/components/analytics/MonthlyBarChart';
import { calculateTotalAmount, getCurrentMonthBills } from '@/lib/billUtils';

function AnalyticsDashboard() {
  const { bills, loading } = useBills();
  const [currentMonthBills, setCurrentMonthBills] = useState<Bill[]>([]);
  
  useEffect(() => {
    if (bills && bills.length > 0) {
      setCurrentMonthBills(getCurrentMonthBills(bills));
    } else {
      setCurrentMonthBills([]);
    }
  }, [bills]);
  
  // Calculate summary statistics with safeguards
  const totalAmount = bills && bills.length ? calculateTotalAmount(bills) : 0;
  const paidBills = bills ? bills.filter(bill => bill.isPaid) : [];
  const unpaidBills = bills ? bills.filter(bill => !bill.isPaid) : [];
  const paidAmount = paidBills.length ? calculateTotalAmount(paidBills) : 0;
  const unpaidAmount = unpaidBills.length ? calculateTotalAmount(unpaidBills) : 0;

  const currentMonthTotal = currentMonthBills.length ? calculateTotalAmount(currentMonthBills) : 0;
  
  // Format currency helper function with improved type checking
  const formatCurrency = (amount: unknown): string => {
    // Ensure the amount is a valid number
    const numericAmount = typeof amount === 'number' ? amount : 0;
    return numericAmount.toFixed(2);
  };
  
  // Loading state
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Typography variant="h6">Loading analytics data...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Financial Analytics
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4 }}>
        Visualize your spending patterns and gain financial insights.
      </Typography>
      
      {/* Summary Cards */}
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 3, 
        mb: 4 
      }}>
        <Box sx={{ 
          flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
          flexGrow: 1
        }}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary">Total Bills</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              {bills ? bills.length : 0}
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ 
          flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
          flexGrow: 1
        }}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%' }}>
            <Typography variant="subtitle2" color="text.secondary">Total Amount</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              ${formatCurrency(totalAmount)}
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ 
          flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
          flexGrow: 1
        }}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: 'success.light' }}>
            <Typography variant="subtitle2" color="text.secondary">Paid Amount</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              ${formatCurrency(paidAmount)}
            </Typography>
            <Typography variant="body2">
              ({paidBills.length} bills)
            </Typography>
          </Paper>
        </Box>
        <Box sx={{ 
          flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(25% - 18px)' },
          flexGrow: 1
        }}>
          <Paper elevation={2} sx={{ p: 2, textAlign: 'center', height: '100%', bgcolor: 'warning.light' }}>
            <Typography variant="subtitle2" color="text.secondary">Unpaid Amount</Typography>
            <Typography variant="h4" sx={{ mt: 1 }}>
              ${formatCurrency(unpaidAmount)}
            </Typography>
            <Typography variant="body2">
              ({unpaidBills.length} bills)
            </Typography>
          </Paper>
        </Box>
      </Box>
      
      {/* Charts */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Monthly Bar Chart - 3/4 width */}
        <Box sx={{ width: '75%' }}>
          <MonthlyBarChart />
        </Box>
        
        {/* Category Pie Chart - Smaller width on larger screens */}
        <Box sx={{ 
          width: { 
            xs: '100%', 
            md: '50%', 
            lg: '25%' 
          } 
        }}>
          <CategoryPieChart />
        </Box>
        
        {/* Current Month Stats */}
        <Box sx={{ width: '100%' }}>
          <Paper elevation={2} sx={{ p: 3, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Current Month Overview
            </Typography>
            <Box sx={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: 3 
            }}>
              <Box sx={{ 
                flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
                flexGrow: 1
              }}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Bills This Month</Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {currentMonthBills.length}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
                flexGrow: 1
              }}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">Total This Month</Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    ${formatCurrency(currentMonthTotal)}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ 
                flexBasis: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
                flexGrow: 1
              }}>
                <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
                  <Typography variant="body2" color="text.secondary">% Paid This Month</Typography>
                  <Typography variant="h5" sx={{ mt: 1 }}>
                    {currentMonthBills.length === 0 
                      ? '0%' 
                      : (currentMonthBills.filter(bill => bill.isPaid).length / currentMonthBills.length * 100).toFixed(0) + '%'}
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Box>
      </Box>
    </Container>
  );
}

// Wrap the component with the BillProvider for state management
export default function AnalyticsPage() {
  return (
    <BillProvider>
      <AnalyticsDashboard />
    </BillProvider>
  );
}
