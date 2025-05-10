import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock BillForm, BillTable, and BillProvider
jest.mock('@/components/bills/BillForm', () => {
  const MockBillForm = () => <div data-testid="bill-form">Mock BillForm</div>;
  MockBillForm.displayName = 'MockBillForm';
  return MockBillForm;
});
jest.mock('@/components/bills/BillTable', () => {
  const MockBillTable = () => <div data-testid="bill-table">Mock BillTable</div>;
  MockBillTable.displayName = 'MockBillTable';
  return MockBillTable;
});
jest.mock('@/contexts/BillContext', () => ({
  BillProvider: ({ children }: React.PropsWithChildren<object>) => <div data-testid="bill-provider">{children}</div>
}));

describe('Home (page.tsx)', () => {
  it('renders headings, sections, and mocks', () => {
    render(<Home />);
    // Main headings
    expect(screen.getByRole('heading', { name: /bill management/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /add new bill/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /your bills/i })).toBeInTheDocument();
    // Subtitle
    expect(screen.getByText(/track and manage your financial obligations/i)).toBeInTheDocument();
    // BillForm and BillTable
    expect(screen.getByTestId('bill-form')).toBeInTheDocument();
    expect(screen.getByTestId('bill-table')).toBeInTheDocument();
    // BillProvider wrapper
    expect(screen.getByTestId('bill-provider')).toBeInTheDocument();
  });
});
