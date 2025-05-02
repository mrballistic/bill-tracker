'use client';

import { useTheme } from '@mui/material';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Typography, Paper, Box } from '@mui/material';
import { Bill } from '@/models/Bill';

interface MonthlyBarChartProps {
  bills: Bill[];
}

export default function MonthlyBarChart({ bills }: MonthlyBarChartProps) {
  const theme = useTheme();

  // If no bills, show empty state
  if (bills.length === 0) {
    return (
      <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography align="center" color="text.secondary">
          No bills to analyze. Add bills to see monthly spending trends.
        </Typography>
      </Paper>
    );
  }

  // Group bills by month and calculate totals
  const monthlyData = bills.reduce((acc: Record<string, { total: number, paid: number, unpaid: number }>, bill) => {
    const date = new Date(bill.date);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!acc[monthYear]) {
      acc[monthYear] = { total: 0, paid: 0, unpaid: 0 };
    }
    
    acc[monthYear].total += bill.amount;
    
    if (bill.isPaid) {
      acc[monthYear].paid += bill.amount;
    } else {
      acc[monthYear].unpaid += bill.amount;
    }
    
    return acc;
  }, {});

  // Convert to array and sort by date
  const data = Object.entries(monthlyData)
    .map(([month, values]) => ({
      month,
      ...values
    }))
    .sort((a, b) => {
      const [aMonth, aYear] = a.month.split(' ');
      const [bMonth, bYear] = b.month.split(' ');
      
      const aDate = new Date(`${aMonth} 1, ${aYear}`);
      const bDate = new Date(`${bMonth} 1, ${bYear}`);
      
      return aDate.getTime() - bDate.getTime();
    });

  // Custom tooltip to display formatted dollar amounts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Paper sx={{ p: 1, boxShadow: theme.shadows[3] }}>
          <Typography variant="body2" fontWeight="bold">
            {label}
          </Typography>
          <Typography variant="body2" color={theme.palette.primary.main}>
            Total: ${payload[0].value.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="success.main">
            Paid: ${payload[1].value.toFixed(2)}
          </Typography>
          <Typography variant="body2" color="error.main">
            Unpaid: ${payload[2].value.toFixed(2)}
          </Typography>
        </Paper>
      );
    }
    return null;
  };

  return (
    <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Monthly Spending
      </Typography>
      <Box sx={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis 
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="total" name="Total" fill={theme.palette.primary.main} />
            <Bar dataKey="paid" name="Paid" fill={theme.palette.success.main} />
            <Bar dataKey="unpaid" name="Unpaid" fill={theme.palette.error.main} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}
