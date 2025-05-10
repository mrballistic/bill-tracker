import React from 'react';
import { render, screen } from '@testing-library/react';
import MonthlyBarChart from '../../../components/analytics/MonthlyBarChart';
import { useBills } from '../../../contexts/BillContext';
import { Bill } from '../../../models/Bill';

// Mock the BillContext
jest.mock('../../../contexts/BillContext', () => ({
  useBills: jest.fn()
}));

// Mock recharts
jest.mock('recharts', () => {
  const OriginalRechartsModule = jest.requireActual('recharts');
  
  return {
    ...OriginalRechartsModule,
    ResponsiveContainer: ({ children, width, height }: React.PropsWithChildren<{ width?: number | string; height?: number | string }>) => (
      <div data-testid="recharts-responsive-container" style={{ width, height }}>
        {children}
      </div>
    ),
    BarChart: ({
      children,
      data
    }: React.PropsWithChildren<{ data: Array<{ month: string; total: number }> }>) => (
      <div data-testid="recharts-bar-chart">
        {data.map((entry, index) => (
          <div key={`month-${index}`} data-testid={`month-bar-${entry.month}`}>
            {entry.month}: ${entry.total}
          </div>
        ))}
        {children}
      </div>
    ),
    Bar: () => <div data-testid="recharts-bar" />,
    XAxis: () => <div data-testid="recharts-xaxis" />,
    YAxis: () => <div data-testid="recharts-yaxis" />,
    CartesianGrid: () => <div data-testid="recharts-grid" />,
    Tooltip: () => <div data-testid="recharts-tooltip" />,
    Legend: () => <div data-testid="recharts-legend" />
  };
});

describe('MonthlyBarChart', () => {
  // Sample bills spanning multiple months for testing
  const mockBills: Bill[] = [
    { id: '1', name: 'January Rent', amount: 1200, date: '2025-01-01', category: 'Housing', isPaid: true },
    { id: '2', name: 'February Rent', amount: 1200, date: '2025-02-01', category: 'Housing', isPaid: true },
    { id: '3', name: 'March Rent', amount: 1200, date: '2025-03-01', category: 'Housing', isPaid: true },
    { id: '4', name: 'March Utilities', amount: 150, date: '2025-03-15', category: 'Utilities', isPaid: true },
    { id: '5', name: 'April Rent', amount: 1200, date: '2025-04-01', category: 'Housing', isPaid: true },
    { id: '6', name: 'April Utilities', amount: 140, date: '2025-04-15', category: 'Utilities', isPaid: true },
    { id: '7', name: 'May Rent', amount: 1250, date: '2025-05-01', category: 'Housing', isPaid: false },
    { id: '8', name: 'May Utilities', amount: 130, date: '2025-05-15', category: 'Utilities', isPaid: false },
    { id: '9', name: 'May Car Payment', amount: 400, date: '2025-05-10', category: 'Transportation', isPaid: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useBills as jest.Mock).mockReturnValue({
      bills: mockBills
    });
  });

  test('renders chart with correct title', () => {
    render(<MonthlyBarChart />);
    // There are multiple elements with this text (heading, caption)
    expect(screen.getAllByText('Monthly Spending').length).toBeGreaterThan(0);
  });

  test('renders bar chart with correct monthly data', () => {
    render(<MonthlyBarChart />);
    // Check that chart contains all expected months (no leading zeros)
    expect(screen.getByTestId('month-bar-12/2024')).toBeInTheDocument();
    expect(screen.getByTestId('month-bar-1/2025')).toBeInTheDocument();
    expect(screen.getByTestId('month-bar-2/2025')).toBeInTheDocument();
    expect(screen.getByTestId('month-bar-3/2025')).toBeInTheDocument();
    expect(screen.getByTestId('month-bar-4/2025')).toBeInTheDocument();
    expect(screen.getByTestId('month-bar-5/2025')).toBeInTheDocument();
  });

  test('renders accessible table with monthly data', () => {
    render(<MonthlyBarChart />);
    // Table headers: Month, Amount
    expect(screen.getByRole('columnheader', { name: /month/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /amount/i })).toBeInTheDocument();
    // Check table rows contain monthly data
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBeGreaterThan(1); // header + data rows
    expect(screen.getByRole('rowheader', { name: /december 2024/i })).toBeInTheDocument();
    // There are multiple cells with $1,200.00
    expect(screen.getAllByRole('cell', { name: '$1,200.00' }).length).toBeGreaterThan(0);
  });

  test('shows empty state when no bills are available', () => {
    (useBills as jest.Mock).mockReturnValue({ bills: [] });
    render(<MonthlyBarChart />);
    expect(screen.getByText('No data available. Add some bills to see your monthly spending.')).toBeInTheDocument();
  });

  test('properly handles bills with zero amount', () => {
    (useBills as jest.Mock).mockReturnValue({ bills: [
      { id: '1', name: 'Zero Bill', amount: 0, date: '2024-07-01', category: 'Other', isPaid: false },
      { id: '2', name: 'July Bill', amount: 100, date: '2024-07-15', category: 'Other', isPaid: false }
    ] });
    render(<MonthlyBarChart />);
    // The chart should include the previous month (June) and July 2024
    expect(screen.getByTestId('month-bar-6/2024')).toBeInTheDocument();
    expect(screen.getByTestId('month-bar-7/2024')).toBeInTheDocument();
    expect(screen.getByTestId('month-bar-7/2024').textContent).toContain('$100'); // 0 + 100
  });

  test('announces chart summary on keyboard Enter/Space (accessibility)', () => {
    render(<MonthlyBarChart />);
    const chartBox = screen.getByRole('img', { name: /bar chart showing monthly spending trends/i });
    const announcement = document.getElementById('monthly-chart-announcement');
    // Simulate keyboard event
    chartBox.focus();
    expect(chartBox).toHaveFocus();
    chartBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    // Announcement should be updated
    expect(announcement?.textContent).toMatch(/Monthly spending breakdown:/);
    expect(announcement?.getAttribute('aria-live')).toBe('assertive');
  });
});
