'use client';

import { ResponsivePie } from '@nivo/pie';
import { Box, Paper, Typography } from '@mui/material';
import { visuallyHidden } from '@mui/utils';
import { getSpendingByCategory, formatCurrency } from '@/lib/staticData';

export default function CategoryPieChart() {
  const categoryData = getSpendingByCategory();
  
  // Transform data for the pie chart
  const chartData = categoryData.map(({ category, amount }) => ({
    id: category,
    label: category,
    value: amount,
    formattedValue: formatCurrency(amount)
  }));

  // Create accessible text summary of the chart data for screen readers
  const accessibleSummary = chartData.length > 0
    ? `Spending by category: ${chartData.map(item => `${item.label}: ${item.formattedValue}`).join(', ')}`
    : 'No spending data by category is available.';

  return (
    <Paper elevation={2} sx={{ height: 400, p: 3 }}>
      <Typography variant="h6" component="h2" id="pie-chart-title" gutterBottom>
        Spending by Category
      </Typography>
      {/* Visually hidden description for screen readers */}
      <Box sx={visuallyHidden}>
        <p id="pie-chart-desc">{accessibleSummary}</p>
      </Box>
      
      <Box 
        sx={{ height: 320 }}
        role="img" 
        aria-labelledby="pie-chart-title"
        aria-describedby="pie-chart-desc"
      >
        {chartData.length > 0 ? (
          <ResponsivePie
            data={chartData}
            margin={{ top: 20, right: 30, bottom: 30, left: 30 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'nivo' }}
            enableArcLabels={false}
            enableArcLinkLabels={false}
            role="application"
            tooltip={({ datum }) => (
              <Box
                sx={{
                  p: 1,
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  boxShadow: 1
                }}
                role="tooltip"
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {datum.label}: {datum.data.formattedValue}
                </Typography>
              </Box>
            )}
           
          />
        ) : (
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No data available
            </Typography>
          </Box>
        )}
      </Box>
      {/* Add a table for screen readers with the same data */}
      <Box sx={visuallyHidden}>
        <table aria-label="Category spending data in table format">
          <thead>
            <tr>
              <th scope="col">Category</th>
              <th scope="col">Amount</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item) => (
              <tr key={item.id}>
                <th scope="row">{item.label}</th>
                <td>{item.formattedValue}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
        </Paper>
      );
    }
