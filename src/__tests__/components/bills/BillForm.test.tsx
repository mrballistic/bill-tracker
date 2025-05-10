import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import BillForm from '../../../components/bills/BillForm';
import { Bill } from '../../../models/Bill';

// Mock BillContext hooks
const mockAddBill = jest.fn();
const mockUpdateBill = jest.fn();
const mockBills: Bill[] = [];

// Mock the entire module
jest.mock('../../../contexts/BillContext', () => ({
  useBills: () => ({
    addBill: mockAddBill,
    updateBill: mockUpdateBill,
    bills: mockBills
  }),
  BillProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}));

describe('BillForm', () => {
  const mockBill: Bill = {
    id: '123',
    name: 'Test Bill',
    amount: 100,
    date: '2025-05-08',
    category: 'Utilities',
    isPaid: false,
    notes: 'Test notes'
  };

  const onCancelMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders empty form in add mode', () => {
    render(<BillForm />);

    expect(screen.getByLabelText("Bill name")).toBeInTheDocument();
    expect(screen.getByLabelText("Bill amount in dollars")).toBeInTheDocument();
    expect(screen.getByLabelText("Bill due date")).toBeInTheDocument();
    // Use testId to find the category select component
    expect(screen.getByLabelText("Select bill category")).toBeInTheDocument();
    expect(screen.getByLabelText(/notes/i, { selector: 'textarea' })).toBeInTheDocument();
    expect(screen.getByLabelText("Mark bill as paid")).toBeInTheDocument();
    expect(screen.getByRole('button', { name: "Add new bill" })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });

  test('renders pre-filled form in edit mode', () => {
    render(<BillForm initialData={mockBill} onCancel={onCancelMock} />);

    expect(screen.getByLabelText("Bill name")).toHaveValue('Test Bill');
    expect(screen.getByLabelText("Bill amount in dollars")).toHaveValue(100);
    expect(screen.getByLabelText("Bill due date")).toHaveValue('2025-05-08');
    expect(screen.getByLabelText(/notes/i, { selector: 'textarea' })).toHaveValue('Test notes');
    expect(screen.getByRole('button', { name: "Update bill" })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  test('calls onCancel when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<BillForm initialData={mockBill} onCancel={onCancelMock} />);

    // The cancel button's accessible name is "Cancel editing bill"
    await user.click(screen.getByRole('button', { name: "Cancel editing bill" }));
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });

  test('validates form and shows error messages', async () => {
    const user = userEvent.setup();
    render(<BillForm />);

    // Clear name field
    await user.clear(screen.getByLabelText("Bill name"));
    // Set amount to invalid value
    await user.clear(screen.getByLabelText("Bill amount in dollars"));
    await user.type(screen.getByLabelText("Bill amount in dollars"), '0');
    // Submit form
    await user.click(screen.getByRole('button', { name: "Add new bill" }));

    // There are multiple error messages for "bill name is required"; check at least one
    expect(screen.getAllByText(/bill name is required/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/amount must be greater than zero/i).length).toBeGreaterThan(0);
    // Verify addBill was not called
    expect(mockAddBill).not.toHaveBeenCalled();
  });

  test('submits form with valid data in add mode', async () => {
    const user = userEvent.setup();
    render(<BillForm />);

    // Fill form with valid data
    await user.clear(screen.getByLabelText("Bill name"));
    await user.type(screen.getByLabelText("Bill name"), 'New Test Bill');
    await user.clear(screen.getByLabelText("Bill amount in dollars"));
    await user.type(screen.getByLabelText("Bill amount in dollars"), '150');
    await user.clear(screen.getByLabelText("Bill due date"));
    await user.type(screen.getByLabelText("Bill due date"), '2025-06-01');
    // For this test, we'll just use the default category
    await user.type(screen.getByLabelText(/notes/i, { selector: 'textarea' }), 'New test notes');
    await user.click(screen.getByLabelText("Mark bill as paid"));
    await user.click(screen.getByRole('button', { name: "Add new bill" }));

    // The form sends amount as a string, not a number
    expect(mockAddBill).toHaveBeenCalledTimes(1);
    expect(mockAddBill).toHaveBeenCalledWith({
      name: 'New Test Bill',
      amount: '150',
      date: '2025-06-01',
      category: 'Other', // Default category
      isPaid: true,
      notes: 'New test notes'
    });
  });

  test('submits form with valid data in edit mode', async () => {
    const user = userEvent.setup();
    render(<BillForm initialData={mockBill} onCancel={onCancelMock} />);

    // Update some form fields
    await user.clear(screen.getByLabelText("Bill name"));
    await user.type(screen.getByLabelText("Bill name"), 'Updated Test Bill');
    await user.clear(screen.getByLabelText("Bill amount in dollars"));
    await user.type(screen.getByLabelText("Bill amount in dollars"), '200');
    await user.click(screen.getByRole('button', { name: "Update bill" }));

    // The form sends amount as a string, not a number
    expect(mockUpdateBill).toHaveBeenCalledTimes(1);
    expect(mockUpdateBill).toHaveBeenCalledWith('123', {
      name: 'Updated Test Bill',
      amount: '200',
      date: '2025-05-08',
      category: 'Utilities',
      isPaid: false,
      notes: 'Test notes'
    });
    expect(onCancelMock).toHaveBeenCalledTimes(1);
  });
});
