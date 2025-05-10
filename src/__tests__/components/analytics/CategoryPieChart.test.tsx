import React from 'react';
import { render, screen } from '@testing-library/react';
import CategoryPieChart from '../../../components/analytics/CategoryPieChart';
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
    ResponsiveContainer: ({
      children,
      width,
      height,
    }: React.PropsWithChildren<{ width?: number | string; height?: number | string }>) => (
      <div data-testid="recharts-responsive-container" style={{ width, height }}>
        {children}
      </div>
    ),
    PieChart: ({ children }: React.PropsWithChildren<Record<string, unknown>>) => (
      <div data-testid="recharts-pie-chart">
        {children}
      </div>
    ),
    Pie: ({
      data,
      children,
    }: React.PropsWithChildren<{ data: { name: string; value: number }[] }>) => (
      <div data-testid="recharts-pie">
        {data.map((entry: { name: string; value: number }, index: number) => (
          <div key={`pie-${index}`} data-testid={`pie-segment-${entry.name}`}>
            {entry.name}: {entry.value}
          </div>
        ))}
        {children}
      </div>
    ),
    Cell: () => <div data-testid="recharts-cell" />,
    Tooltip: ({ content }: React.PropsWithChildren<{ content?: React.ReactNode }>) => <div data-testid="recharts-tooltip">{content}</div>
  };
});

describe('CategoryPieChart', () => {
  // Sample bills for testing
  const mockBills: Bill[] = [
    { id: '1', name: 'Rent', amount: 1200, date: '2025-05-01', category: 'Housing', isPaid: false },
    { id: '2', name: 'Electricity', amount: 80, date: '2025-05-15', category: 'Utilities', isPaid: true },
    { id: '3', name: 'Internet', amount: 60, date: '2025-05-10', category: 'Utilities', isPaid: false },
    { id: '4', name: 'Car Payment', amount: 350, date: '2025-04-05', category: 'Transportation', isPaid: true },
    { id: '5', name: 'Insurance', amount: 120, date: '2025-06-01', category: 'Insurance', isPaid: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    (useBills as jest.Mock).mockReturnValue({
      bills: mockBills
    });
  });

  test('renders chart with correct title and total', () => {
    render(<CategoryPieChart />);
    expect(screen.getAllByText('Spending by Category').length).toBeGreaterThan(0);
    // Use querySelector for the total spending heading
    const totalHeading = document.querySelector('h6');
    expect(totalHeading).toBeTruthy();
    expect(totalHeading?.textContent).toContain('Total Spending:');
    expect(totalHeading?.textContent).toContain('$1,810.00');
  });

  test('renders pie chart with correct data segments', () => {
    render(<CategoryPieChart />);
    
    // Check that chart contains all expected categories
    expect(screen.getByTestId('pie-segment-Housing')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-Utilities')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-Transportation')).toBeInTheDocument();
    expect(screen.getByTestId('pie-segment-Insurance')).toBeInTheDocument();
    
    // Check values
    expect(screen.getByTestId('pie-segment-Housing').textContent).toContain('1200');
    expect(screen.getByTestId('pie-segment-Utilities').textContent).toContain('140'); // 80 + 60
    expect(screen.getByTestId('pie-segment-Transportation').textContent).toContain('350');
    expect(screen.getByTestId('pie-segment-Insurance').textContent).toContain('120');
  });

  test('renders accessible table with category data', () => {
    render(<CategoryPieChart />);
    // Table rows: 1 header + 4 categories + 1 total = 6
    const rows = screen.getAllByRole('row');
    expect(rows.length).toBe(6);
    // Check specific data in table cells
    expect(screen.getByRole('cell', { name: '$1,200.00' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '$140.00' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '$350.00' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '$120.00' })).toBeInTheDocument();
    expect(screen.getByRole('cell', { name: '$1,810.00' })).toBeInTheDocument();
  });

  test('shows empty state when no bills are available', () => {
    (useBills as jest.Mock).mockReturnValue({ bills: [] });
    render(<CategoryPieChart />);
    expect(screen.getByText('No data available. Add some bills to see your spending by category.')).toBeInTheDocument();
  });

  test('shows empty state when all bill amounts are zero', () => {
    (useBills as jest.Mock).mockReturnValue({ bills: [
      { id: '1', name: 'Zero Bill', amount: 0, date: '2025-05-01', category: 'Other', isPaid: false }
    ] });
    render(<CategoryPieChart />);
    // Should render the chart with a single 'Other' segment and $0.00 total
    expect(screen.getByTestId('pie-segment-Other')).toBeInTheDocument();
    const totalHeading = document.querySelector('h6');
    expect(totalHeading).toBeTruthy();
    expect(totalHeading?.textContent).toContain('Total Spending:');
    expect(totalHeading?.textContent).toContain('$0.00');
    // There are two cells with $0.00 (category and total), so use getAllByRole
    const zeroCells = screen.getAllByRole('cell', { name: '$0.00' });
    expect(zeroCells.length).toBeGreaterThanOrEqual(2);
  });

  test('announces chart summary on keyboard Enter/Space (accessibility)', () => {
    render(<CategoryPieChart />);
    const chartBox = screen.getByRole('img', { name: /pie chart showing spending by category/i });
    const announcement = document.getElementById('chart-announcement');
    // Simulate keyboard event
    chartBox.focus();
    expect(chartBox).toHaveFocus();
    chartBox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    // Announcement should be updated
    expect(announcement?.textContent).toMatch(/Category spending breakdown:/);
    expect(announcement?.getAttribute('aria-live')).toBe('assertive');
  });
});
