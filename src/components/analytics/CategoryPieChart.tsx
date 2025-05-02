'use client';

import { useTheme } from '@mui/material';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, TooltipProps } from 'recharts';
import { Typography, Paper, Box } from '@mui/material';
import { Bill } from '@/models/Bill';
import { calculateTotalByCategory } from '@/lib/billUtils';

interface CategoryPieChartProps {
  bills: Bill[];
}

export default function CategoryPieChart({ bills }: CategoryPieChartProps) {
  const theme = useTheme();

  // If no bills, show empty state
  if (bills.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography align="center" color="text.secondary">
          No bills to analyze. Add bills to see category breakdown.
        </Typography>
      </Paper>
    );
  }

  // Calculate totals by category
  const totalByCategory = calculateTotalByCategory(bills);
  
  // Convert to array for Recharts
  const data = Object.entries(totalByCategory).map(([name, value]) => ({
    name,
    value
  }));

  // Use a consistent set of colors for categories
  const COLORS = [
    theme.palette.primary.main,
    theme.palette.secondary.main,
    theme.palette.success.main,
    theme.palette.warning.main,
    theme.palette.error.main,
    theme.palette.info.main,
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff8042',
  ];

  // Custom tooltip to display formatted dollar amounts
  const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, boxShadow: theme.shadows[3] }}>
          <Typography variant="body2">{payload[0]?.name}</Typography>
          <Typography variant="body2" fontWeight="bold">
            ${payload[0]?.value?.toFixed(2) || '0.00'}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Spending by Category
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              fill="#8884d8"
              stroke="none"
              dataKey="value"
              
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
           
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
