'use client';

import React, { useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { BarChart, Bar, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useBills } from '@/contexts/BillContext';
import type { Bill } from '@/models/Bill';

/**
 * Groups bills by month and calculates the total amount for each month
 * @param bills Array of bill objects
 * @returns Array of objects with month (MM/YYYY) and total amount
 */
export const groupBillsByMonth = (bills: Bill[]): { month: string; total: number }[] => {
  // Create a map to store totals by month
  const monthlyTotals = new Map<string, number>();

  // Process each bill
  bills.forEach(bill => {
    // Make sure we have a valid date and amount
     if (!bill.date || typeof bill.amount !== 'number') return;

    // Format the month as MM/YYYY
    const date = new Date(bill.date);
    const month = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    // Add to the existing total or set a new one
    const currentTotal = monthlyTotals.get(month) || 0;
    monthlyTotals.set(month, currentTotal + bill.amount);
  });

  // Convert the map to an array of objects
  return Array.from(monthlyTotals).map(([month, total]) => ({
    month,
    total
  }));
};

export default function MonthlyBarChart() {
  const theme = useTheme();
  const { bills } = useBills();
  
  // Group bills by month
  const monthlyData = useMemo(() => {
    const monthlyTotals: {[key: string]: number} = {};
    
    bills.forEach(bill => {
      if (!bill.date || typeof bill.amount !== 'number') return;
      
      const date = new Date(bill.date);
      // Format consistently as MM/YYYY to match groupBillsByMonth
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = 0;
      }
      
      monthlyTotals[monthYear] += bill.amount;
    });

    return Object.entries(monthlyTotals).map(([month, total]) => ({
      month,
      total
    }));
  }, [bills]);
  
  // Format for chart display
  const chartData = useMemo(() => {
    return monthlyData.map(monthGroup => {
      // Safely extract month and year
      const parts = monthGroup.month.split('/');
      const monthIndex = parseInt(parts[0]) - 1; // 0-based month index
      const year = parseInt(parts[1]);
      
      // Create a valid date object
      const date = new Date(year, monthIndex);
      
      return {
        month: monthGroup.month,
        total: monthGroup.total,
        formattedTotal: new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(monthGroup.total),
        monthName: date.toLocaleString('default', { month: 'long' }),
        year: year.toString()
      };
    }).sort((a, b) => {
      // Sort by month in chronological order
      const [aMonth, aYear] = a.month.split('/').map(n => parseInt(n));
      const [bMonth, bYear] = b.month.split('/').map(n => parseInt(n));
      return (aYear * 12 + aMonth) - (bYear * 12 + bMonth);
    });
  }, [monthlyData]);

  // Calculate highest monthly total for accessible description
  const highestMonth = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((max, current) => 
      current.total > max.total ? current : max, chartData[0]);
  }, [chartData]);

  // Calculate lowest monthly total for accessible description
  const lowestMonth = useMemo(() => {
    if (chartData.length === 0) return null;
    return chartData.reduce((min, current) => 
      current.total < min.total ? current : min, chartData[0]);
  }, [chartData]);

  // Creating the accessible chart summary
  const chartSummary = chartData.map(item => 
    `${item.monthName} ${item.year}: ${item.formattedTotal}`
  ).join('; ');

  // Handle keyboard focus for the chart
  const handleChartKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Announce chart summary for screen readers
      const announcement = document.getElementById('monthly-chart-announcement');
      if (announcement) {
        let message = `Monthly spending breakdown: ${chartSummary}.`;
        if (highestMonth) {
          message += ` Highest spending in ${highestMonth.monthName} at ${highestMonth.formattedTotal}.`;
        }
        if (lowestMonth) {
          message += ` Lowest spending in ${lowestMonth.monthName} at ${lowestMonth.formattedTotal}.`;
        }
        
        announcement.textContent = message;
        announcement.setAttribute('aria-live', 'assertive');
        setTimeout(() => {
          announcement.setAttribute('aria-live', 'off');
        }, 3000);
      }
    }
  };

  // Define type for our custom tooltip props
  type CustomTooltipProps = {
    active?: boolean;
    payload?: {
      payload: {
        month: string;
        total: number;
        formattedTotal: string;
        monthName: string;
        year: string;
      };
      value?: number;
      name?: string;
    }[];
    label?: string;
  };

  // Custom tooltip for better accessibility
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      const monthData = payload[0].payload;
      return (
        <Box
          sx={{
            backgroundColor: 'background.paper',
            p: 2,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            boxShadow: 1,
          }}
          role="tooltip"
          aria-live="polite"
        >
          <Typography variant="subtitle2">{monthData.monthName} {monthData.year}</Typography>
          <Typography variant="body2" color="text.secondary">
            {monthData.formattedTotal}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ p: 3, mb: 3, height: '100%' }}
      aria-label="Monthly spending bar chart"
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Monthly Spending
      </Typography>
      
      {/* Hidden element for screen reader announcements */}
      <div id="monthly-chart-announcement" className="sr-only" aria-live="off"></div>
      
      {/* Text description for screen readers */}
      <Typography 
        component="div" 
        className="sr-only"
        aria-live="polite"
      >
        This bar chart shows spending by month. {chartSummary}
        {highestMonth && `Highest spending was in ${highestMonth.monthName} at ${highestMonth.formattedTotal}.`}
        {lowestMonth && `Lowest spending was in ${lowestMonth.monthName} at ${lowestMonth.formattedTotal}.`}
      </Typography>

      {chartData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography variant="body1" color="text.secondary">
            No data available. Add some bills to see your monthly spending.
          </Typography>
        </Box>
      ) : (
        <>
          <Box 
            tabIndex={0} 
            aria-label="Bar chart showing monthly spending trends"
            onKeyDown={handleChartKeyDown}
            sx={{ 
              height: 300, 
              '&:focus-visible': {
                outline: '2px solid',
                outlineColor: 'primary.main',
                outlineOffset: '2px',
              } 
            }}
            role="img"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
               
                <Tooltip content={<CustomTooltip />} />
               
                <Bar 
                  dataKey="total" 
                  name="Monthly Spending" 
                  fill={theme.palette.primary.main} 
                  role="graphics-object"
                  aria-label="Monthly spending data"
                />
              </BarChart>
            </ResponsiveContainer>
          </Box>
          
          {/* Accessible HTML table alternative */}
          <table className="sr-only">
            <caption>Monthly Spending</caption>
            <thead>
              <tr>
                <th scope="col">Month</th>
                <th scope="col">Amount</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item, index) => (
                <tr key={index}>
                  <th scope="row">{item.monthName} {item.year}</th>
                  <td>{item.formattedTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </Paper>
  );
}
