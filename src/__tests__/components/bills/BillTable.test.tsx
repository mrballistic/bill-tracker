import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BillTable from '../../../components/bills/BillTable';
import { useBills } from '../../../contexts/BillContext';
import { Bill } from '../../../models/Bill';

// Mock the BillContext
jest.mock('../../../contexts/BillContext', () => ({
  useBills: jest.fn()
}));

// Mock Dialog from MUI to avoid issues with portal rendering
jest.mock('@mui/material', () => {
  const actual = jest.requireActual('@mui/material');
  return {
    ...actual,
    Dialog: ({ open, children }: { open: boolean; children: React.ReactNode }) => 
      open ? <div data-testid="dialog">{children}</div> : null,
    DialogTitle: ({ children }: { children: React.ReactNode }) => 
      <div data-testid="dialog-title">{children}</div>,
    DialogContent: ({ children }: { children: React.ReactNode }) => 
      <div data-testid="dialog-content">{children}</div>,
    DialogActions: ({ children }: { children: React.ReactNode }) => 
      <div data-testid="dialog-actions">{children}</div>,
  };
});

// Mock BillForm component
jest.mock('../../../components/bills/BillForm', () => {
  return jest.fn(({ initialData, onCancel }) => (
    <div data-testid="bill-form">
      {initialData ? `Editing: ${initialData.name}` : 'New Bill Form'}
      <button onClick={onCancel} data-testid="form-cancel">Cancel</button>
    </div>
  ));
});

describe('BillTable', () => {
  // Sample bills for testing
  const mockBills: Bill[] = [
    { id: '1', name: 'Rent', amount: 1200, date: '2025-05-01', category: 'Housing', isPaid: false },
    { id: '2', name: 'Electricity', amount: 80, date: '2025-05-15', category: 'Utilities', isPaid: true },
    { id: '3', name: 'Internet', amount: 60, date: '2025-05-10', category: 'Utilities', isPaid: false },
    { id: '4', name: 'Car Payment', amount: 350, date: '2025-04-05', category: 'Transportation', isPaid: true },
    { id: '5', name: 'Insurance', amount: 120, date: '2025-06-01', category: 'Insurance', isPaid: false },
    { id: '6', name: 'Phone', amount: 50, date: '2025-05-20', category: 'Utilities', isPaid: false },
  ];

  const mockTogglePaidStatus = jest.fn();
  const mockDeleteBill = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useBills as jest.Mock).mockReturnValue({
      bills: mockBills,
      togglePaidStatus: mockTogglePaidStatus,
      deleteBill: mockDeleteBill
    });
  });

  test('renders table with bills data', () => {
    render(<BillTable />);

    // Check table headers (match actual rendered headers)
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Category')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();

    // Check first 5 bills are displayed (default pagination)
    expect(screen.getByRole('rowheader', { name: 'Rent' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Electricity' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Internet' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Car Payment' })).toBeInTheDocument();
    expect(screen.getByRole('rowheader', { name: 'Insurance' })).toBeInTheDocument();
    // 6th bill shouldn't be visible due to pagination
    expect(screen.queryByRole('rowheader', { name: 'Phone' })).not.toBeInTheDocument();
  });

  test('shows empty state when no bills are available', () => {
    (useBills as jest.Mock).mockReturnValue({
      bills: [],
      togglePaidStatus: mockTogglePaidStatus,
      deleteBill: mockDeleteBill
    });

    render(<BillTable />);

    expect(screen.getByText(/no bills found/i)).toBeInTheDocument();
  });

  test('toggles bill paid status when status chip is clicked', async () => {
    const user = userEvent.setup();
    render(<BillTable />);
    // Find and click the "Mark as paid" button for the first bill
    const paidButtons = screen.getAllByLabelText(/mark as paid/i);
    await user.click(paidButtons[0]);
    expect(mockTogglePaidStatus).toHaveBeenCalledWith('1');
  });

  test('opens view dialog when view button is clicked', async () => {
    const user = userEvent.setup();
    render(<BillTable />);
    // Find and click view button for the first bill
    const viewButtons = screen.getAllByLabelText(/view details for rent/i);
    await user.click(viewButtons[0]);
    // Verify dialog is open and showing correct content
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Bill Details');
    // Use getAllByText and check at least one matches
    expect(screen.getAllByText(/Rent/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/\$1,200.00/).length).toBeGreaterThan(0);
  });

  test('opens edit dialog when edit button is clicked', async () => {
    const user = userEvent.setup();
    render(<BillTable />);
    // Find and click edit button for the first bill
    const editButtons = screen.getAllByLabelText(/edit rent/i);
    await user.click(editButtons[0]);
    // Verify dialog is open with edit form
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('bill-form')).toHaveTextContent('Editing: Rent');
  });

  test('opens delete confirmation when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<BillTable />);
    // Find and click delete button for the first bill
    const deleteButtons = screen.getAllByLabelText(/delete rent/i);
    await user.click(deleteButtons[0]);
    // Verify delete confirmation dialog is open
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    expect(screen.getByTestId('dialog-title')).toHaveTextContent('Delete Bill');
  });

  test('handles pagination correctly', async () => {
    const user = userEvent.setup();
    render(<BillTable />);

    // Initially, first 5 bills are visible, 6th is not
    expect(screen.getByText('Rent')).toBeInTheDocument();
    expect(screen.queryByText('Phone')).not.toBeInTheDocument();

    // Go to next page
    const nextPageButton = screen.getByLabelText(/next page/i);
    await user.click(nextPageButton);

    // Now 6th bill should be visible, but not the first 5
    expect(screen.queryByText('Rent')).not.toBeInTheDocument();
    expect(screen.getByText('Phone')).toBeInTheDocument();
  });

  test('changes rows per page', async () => {
    const user = userEvent.setup();
    render(<BillTable />);
    // Find the select for rows per page (use role combobox and actual label)
    const rowsPerPageSelect = screen.getByRole('combobox', { name: /bills per page/i });
    await user.click(rowsPerPageSelect);
    // Select 10 rows per page (option may be '10')
    const option = screen.getByRole('option', { name: '10' });
    await user.click(option);
    // Now the 6th bill should be visible
    expect(screen.getByRole('rowheader', { name: 'Phone' })).toBeInTheDocument();
  });

  test('closes view dialog when Close button is clicked', async () => {
    const user = userEvent.setup();
    render(<BillTable />);
    // Open view dialog
    const viewButtons = screen.getAllByLabelText(/view details for rent/i);
    await user.click(viewButtons[0]);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    // Click Close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    // Dialog should be closed
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  test('closes edit dialog when Cancel button is clicked in BillForm', async () => {
    const user = userEvent.setup();
    render(<BillTable />);
    // Open edit dialog
    const editButtons = screen.getAllByLabelText(/edit rent/i);
    await user.click(editButtons[0]);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    // Click Cancel button in BillForm
    const cancelButton = screen.getByTestId('form-cancel');
    await user.click(cancelButton);
    // Dialog should be closed
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  test('closes delete dialog when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<BillTable />);
    // Open delete dialog
    const deleteButtons = screen.getAllByLabelText(/delete rent/i);
    await user.click(deleteButtons[0]);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    // Click Cancel button
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);
    // Dialog should be closed
    expect(screen.queryByTestId('dialog')).not.toBeInTheDocument();
  });

  test('confirms delete and calls deleteBill', async () => {
    const user = userEvent.setup();
    render(<BillTable />);
    // Open delete dialog
    const deleteButtons = screen.getAllByLabelText(/delete rent/i);
    await user.click(deleteButtons[0]);
    expect(screen.getByTestId('dialog')).toBeInTheDocument();
    // Click Delete button in dialog only
    const dialog = screen.getByTestId('dialog');
    const confirmButton = within(dialog).getByRole('button', { name: /delete/i });
    await user.click(confirmButton);
    // deleteBill should be called with correct id
    expect(mockDeleteBill).toHaveBeenCalledWith('1');
  });
});
