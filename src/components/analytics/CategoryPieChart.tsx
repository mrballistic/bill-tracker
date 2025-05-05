'use client';

import { ResponsivePie } from '@nivo/pie';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { getSpendingByCategory, formatCurrency } from '@/lib/staticData';

export default function CategoryPieChart() {
  const theme = useTheme();
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
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]]
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor={theme.palette.text.primary}
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 2]]
            }}
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
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: theme.palette.text.secondary,
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle'
              }
            ]}
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
