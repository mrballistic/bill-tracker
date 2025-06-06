'use client';

import { useMemo } from 'react';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { useBills } from '@/contexts/BillContext';
import { calculateTotalByCategory } from '@/lib/billUtils';

// Define interfaces for our data structures
interface CategoryDataItem {
  category: string;
  total: number;
}

interface ChartDataItem {
  name: string;
  value: number;
  formattedValue: string;
}

export default function CategoryPieChart() {
  const theme = useTheme();
  const { bills } = useBills();
  
  // Calculate category totals
  const categoryData = useMemo(() => {
    const totals = calculateTotalByCategory(bills);
    return Object.entries(totals).map(([category, total]): CategoryDataItem => ({
      category,
      total
    }));
  }, [bills]);
  
  // Define chart colors based on theme
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.error.main,
    theme.palette.warning.main,
    theme.palette.info.main,
    theme.palette.success.main,
    // Generate additional colors for more categories
    ...Array.from({ length: 10 }, (_, i) => 
      theme.palette.mode === 'dark' 
        ? `hsl(${i * 36}, 70%, 50%)`
        : `hsl(${i * 36}, 60%, 45%)`
    )
  ];
  
  // Format data for visualization and table
  const chartData = useMemo(() => {
    return categoryData.map((category: CategoryDataItem): ChartDataItem => ({
      name: category.category,
      value: category.total,
      formattedValue: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
      }).format(category.total)
    }));
  }, [categoryData]);
  
  // Calculate total spending for the summary
  const totalSpending = useMemo(() => {
    // Ensure categoryData is an array before using reduce
    if (Array.isArray(categoryData)) {
      return categoryData.reduce((sum, category) => sum + (category.total || 0), 0);
    }
    return 0; // Return 0 if categoryData is not an array
  }, [categoryData]);
  
  // Format total spending for display
  const formattedTotal = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(totalSpending);

  // Define interface for tooltip props
  interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      payload: {
        formattedValue: string;
      };
    }>;
  }

  // Custom tooltip for better accessibility
  const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
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
          <Typography variant="subtitle2">{payload[0].name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {payload[0].payload.formattedValue}
          </Typography>
        </Box>
      );
    }
    return null;
  };

  // Creating the accessible chart summary
  const chartSummary = chartData.map((item: ChartDataItem) => 
    `${item.name}: ${item.formattedValue}`
  ).join(', ');

  // Handle keyboard focus for the chart
  const handleChartKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Announce chart summary for screen readers
      const announcement = document.getElementById('chart-announcement');
      if (announcement) {
        announcement.textContent = `Category spending breakdown: ${chartSummary}. Total spending: ${formattedTotal}`;
        announcement.setAttribute('aria-live', 'assertive');
        setTimeout(() => {
          announcement.setAttribute('aria-live', 'off');
        }, 3000);
      }
    }
  };

  return (
    <Paper 
      elevation={2} 
      sx={{ p: 3, mb: 3, height: '100%' }}
      aria-label="Category spending breakdown chart"
    >
      <Typography variant="h6" component="h2" gutterBottom>
        Spending by Category
      </Typography>
      
      {/* Hidden element for screen reader announcements */}
      <div id="chart-announcement" className="sr-only" aria-live="off"></div>
      
      {/* Text description for screen readers */}
      <Typography 
        component="div" 
        className="sr-only"
        aria-live="polite"
      >
        This pie chart shows spending by category. {chartSummary}.
        Total spending across all categories: {formattedTotal}.
      </Typography>

      {chartData.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
          <Typography variant="body1" color="text.secondary">
            No data available. Add some bills to see your spending by category.
          </Typography>
        </Box>
      ) : (
        <>
          <Box 
            tabIndex={0} 
            aria-label={`Pie chart showing spending by category. Total spending: ${formattedTotal}`}
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
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  strokeWidth={0}
                >
                  {chartData.map((entry: ChartDataItem, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </Box>
          
          {/* Accessible HTML table alternative */}
          <table className="sr-only">
            <caption>Spending by Category</caption>
            <thead>
              <tr>
                <th scope="col">Category</th>
                <th scope="col">Amount</th>
                <th scope="col">Percentage</th>
              </tr>
            </thead>
            <tbody>
              {chartData.map((item: ChartDataItem, index: number) => (
                <tr key={index}>
                  <th scope="row">{item.name}</th>
                  <td>{item.formattedValue}</td>
                  <td>{((item.value / totalSpending) * 100).toFixed(1)}%</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Total</th>
                <td>{formattedTotal}</td>
                <td>100%</td>
              </tr>
            </tbody>
          </table>
          
          <Typography variant="subtitle1" sx={{ mt: 2, textAlign: 'center' }}>
            Total Spending: {formattedTotal}
          </Typography>
        </>
      )}
    </Paper>
  );
}
