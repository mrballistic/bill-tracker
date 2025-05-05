'use client';

import { ResponsiveBar } from '@nivo/bar';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { getMonthlySummary, formatCurrency } from '@/lib/staticData';

// Define types for bar chart data
interface MonthlyData {
  month: string;
  total: number;
  paid: number;
  // Add index signature to make it compatible with BarDatum
  [key: string]: string | number;
}

export default function MonthlyBarChart() {
  const theme = useTheme();
  
  // Changed function name to match the one in staticData.ts
  const monthlySummaryData = getMonthlySummary();
  
  // Transform data to match the expected format for the bar chart
  // This is placeholder logic - adjust based on your actual data structure
  const monthlyData: MonthlyData[] = monthlySummaryData.map(({ month, amount }) => ({
    month,
    total: amount,
    paid: amount * 0.6, // Placeholder calculation - adjust as needed
  }));
  
  return (
    <Paper elevation={2} sx={{ height: 400, p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Monthly Spending
      </Typography>
      
      <Box sx={{ height: 320 }}>
        {monthlyData.length > 0 ? (
          <ResponsiveBar
            data={monthlyData}
            keys={['total', 'paid']}
            indexBy="month"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={[theme.palette.primary.main, theme.palette.success.main]}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 1.6]]
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Month',
              legendPosition: 'middle',
              legendOffset: 32
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Amount',
              legendPosition: 'middle',
              legendOffset: -40,
              format: (value: number) => {
                return value === 0 ? '$0' : `$${value}`
              }
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{
              from: 'color',
              modifiers: [['darker', 1.6]]
            }}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1
                    }
                  }
                ]
              }
            ]}
            role="application"
            tooltip={(props) => (
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
                  {props.id === 'total' ? 'Total Bills' : 'Paid Bills'}: {formatCurrency(props.value)}
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
