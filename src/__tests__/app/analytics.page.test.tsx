import React from 'react';
import { render, screen } from '@testing-library/react';
import AnalyticsPage from '@/app/analytics/page';

// Mock charts and BillProvider
jest.mock('@/components/analytics/MonthlyBarChart', () => {
  const MockMonthlyBarChart = () => <div data-testid="monthly-bar-chart">Mock MonthlyBarChart</div>;
  MockMonthlyBarChart.displayName = 'MockMonthlyBarChart';
  return MockMonthlyBarChart;
});
jest.mock('@/components/analytics/CategoryPieChart', () => {
  const MockCategoryPieChart = () => <div data-testid="category-pie-chart">Mock CategoryPieChart</div>;
  MockCategoryPieChart.displayName = 'MockCategoryPieChart';
  return MockCategoryPieChart;
});
jest.mock('@/contexts/BillContext', () => {
  const actual = jest.requireActual('@/contexts/BillContext');
  return {
    ...actual,
    BillProvider: ({ children }: React.PropsWithChildren<object>) => <div data-testid="bill-provider">{children}</div>,
    useBills: jest.fn()
  };
});

import { useBills } from '@/contexts/BillContext';

describe('AnalyticsPage (analytics/page.tsx)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders headings, summary cards, charts, and overview', () => {
    (useBills as jest.Mock).mockReturnValue({
      bills: [
        { id: '1', name: 'Rent', amount: 1000, date: '2025-05-01', category: 'Housing', isPaid: true },
        { id: '2', name: 'Electricity', amount: 100, date: '2025-05-10', category: 'Utilities', isPaid: false }
      ],
      loading: false
    });
    render(<AnalyticsPage />);
    // Headings
    expect(screen.getByRole('heading', { name: /financial analytics/i })).toBeInTheDocument();
    expect(screen.getByText(/visualize your spending patterns/i)).toBeInTheDocument();
    // Summary cards
    expect(screen.getByText('Total Bills')).toBeInTheDocument();
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getByText('Paid Amount')).toBeInTheDocument();
    expect(screen.getByText('Unpaid Amount')).toBeInTheDocument();
    // Charts
    expect(screen.getByTestId('monthly-bar-chart')).toBeInTheDocument();
    expect(screen.getByTestId('category-pie-chart')).toBeInTheDocument();
    // Current Month Overview
    expect(screen.getByRole('heading', { name: /current month overview/i })).toBeInTheDocument();
    expect(screen.getByText(/bills this month/i)).toBeInTheDocument();
    expect(screen.getByText(/total this month/i)).toBeInTheDocument();
    expect(screen.getByText(/% paid this month/i)).toBeInTheDocument();
    // BillProvider wrapper
    expect(screen.getByTestId('bill-provider')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    (useBills as jest.Mock).mockReturnValue({ bills: [], loading: true });
    render(<AnalyticsPage />);
    expect(screen.getByText(/loading analytics data/i)).toBeInTheDocument();
  });
});
