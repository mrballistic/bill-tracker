'use client';

import { ResponsiveBar } from '@nivo/bar';
import { Box, Paper, Typography, useTheme, BoxProps } from '@mui/material';
import React, { ReactNode } from 'react';

// Custom VisuallyHidden component for screen reader accessibility
const VisuallyHidden = ({ children, ...props }: BoxProps & { children: ReactNode }) => (
  <Box
    {...props}
    sx={{
      border: 0, 
      clip: 'rect(0 0 0 0)', 
      height: '1px', 
      margin: '-1px',
      overflow: 'hidden', 
      padding: 0, 
      position: 'absolute', 
      width: '1px',
      whiteSpace: 'nowrap',
      ...props.sx
    }}
  >
    {children}
  </Box>
);
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

  // Create accessible text summary of the chart data for screen readers
  const accessibleSummary = monthlyData.length > 0
    ? `Monthly spending summary: ${monthlyData.map(item => 
        `${item.month}: Total: ${formatCurrency(item.total as number)}, Paid: ${formatCurrency(item.paid as number)}`
      ).join(', ')}`
    : 'No monthly spending data is available.';
  
  return (
    <Paper elevation={2} sx={{ height: 400, p: 3 }}>
      <Typography variant="h6" component="h2" id="bar-chart-title" gutterBottom>
        Monthly Spending
      </Typography>
      
      {/* Visually hidden description for screen readers */}
      <VisuallyHidden>
        <p id="bar-chart-desc">{accessibleSummary}</p>
      </VisuallyHidden>
      
      <Box 
        sx={{ height: 320 }}
        role="img"
        aria-labelledby="bar-chart-title"
        aria-describedby="bar-chart-desc"
      >
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
            
            role="application"
            ariaLabel="Monthly spending bar chart"
            
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
                role="tooltip"
              >
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {props.id === 'total' ? 'Total Bills' : 'Paid Bills'}: {formatCurrency(props.value)}
                </Typography>
              </Box>
            )}
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
                symbolSize: 20
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
      
      {/* Add a table for screen readers with the same data */}
      <VisuallyHidden>
        <table aria-label="Monthly spending data in table format">
          <caption>Monthly Spending Summary</caption>
          <thead>
            <tr>
              <th scope="col">Month</th>
              <th scope="col">Total Bills</th>
              <th scope="col">Paid Bills</th>
            </tr>
          </thead>
          <tbody>
            {monthlyData.map((item) => (
              <tr key={item.month}>
                <th scope="row">{item.month}</th>
                <td>{formatCurrency(item.total as number)}</td>
                <td>{formatCurrency(item.paid as number)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </VisuallyHidden>
    </Paper>
  );
}
