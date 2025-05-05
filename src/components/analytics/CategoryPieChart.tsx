'use client';

import { ResponsivePie } from '@nivo/pie';
import { Box, Paper, Typography } from '@mui/material';
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

  return (
    <Paper elevation={2} sx={{ height: 400, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Spending by Category
      </Typography>
      
      <Box sx={{ height: 320 }}>
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
    </Paper>
  );
}
