import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import StaticBillForm, { formHandlers } from '@/components/bills/StaticBillForm';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// Create a wrapper component that provides the date adapter
const MockProvider = ({ children }: { children: React.ReactNode }) => (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
    {children}
  </LocalizationProvider>
);

// Define types for the DatePicker props we need
interface DatePickerProps {
  label?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
}

// Mock the date picker component to avoid implementation details
jest.mock('@mui/x-date-pickers/DatePicker', () => ({
  DatePicker: ({ label, value, onChange }: DatePickerProps) => (
    <div>
      <label htmlFor="date-picker">{label}</label>
      <input
        id="date-picker"
        type="date"
        value={value instanceof Date ? value.toISOString().split('T')[0] : ''}
        onChange={(e) => onChange(new Date(e.target.value))}
        data-testid="date-picker"
      />
    </div>
  )
}));

// Mock the categories for consistent testing
jest.mock('@/models/Bill', () => ({
  BILL_CATEGORIES: ['Utilities', 'Entertainment', 'Housing', 'Food', 'Transportation'],
  // Add any other exports that might be needed
}));

describe('StaticBillForm', () => {
  it('renders the form with all fields', () => {
    render(<StaticBillForm />, { wrapper: MockProvider });
    
    // Check for input fields
    expect(screen.getByTestId('bill-name-input')).toBeInTheDocument();
    expect(screen.getByTestId('bill-amount-input')).toBeInTheDocument();
    expect(screen.getByLabelText('Due Date')).toBeInTheDocument();
    expect(screen.getByTestId('bill-category-select')).toBeInTheDocument();
    expect(screen.getByLabelText(/paid/i)).toBeInTheDocument();
  });

  it('submits the form and shows success message', async () => {
    render(<StaticBillForm />, { wrapper: MockProvider });
    
    // Fill out the form
    fireEvent.change(screen.getByTestId('bill-name-input'), { target: { value: 'Test Bill' } });
    fireEvent.change(screen.getByTestId('bill-amount-input'), { target: { value: '123' } });
    
    // Submit the form
    fireEvent.submit(screen.getByTestId('bill-form'));
    
    // Check for success message
    expect(await screen.findByTestId('bill-submit-success')).toBeInTheDocument();
    expect(screen.getByText(/bill submitted successfully/i)).toBeInTheDocument();
    expect(screen.getByText(/no data was actually saved/i)).toBeInTheDocument();
  });

  it('resets the form after submit', async () => {
    jest.useFakeTimers();
    render(<StaticBillForm />, { wrapper: MockProvider });
    
    // Fill and submit form
    const nameInput = screen.getByTestId('bill-name-input');
    fireEvent.change(nameInput, { target: { value: 'Reset Bill' } });
    fireEvent.submit(screen.getByTestId('bill-form'));
    
    // Success message should appear
    expect(await screen.findByTestId('bill-submit-success')).toBeInTheDocument();
    
    // Fast-forward timer inside act to handle React state updates
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    
    // Form should be reset and visible again
    await waitFor(() => {
      expect(screen.queryByTestId('bill-submit-success')).not.toBeInTheDocument();
      expect(screen.getByTestId('bill-name-input')).toHaveValue('');
    });
    
    jest.useRealTimers();
  });
  
  it('handles paid status toggle', () => {
    render(<StaticBillForm />, { wrapper: MockProvider });
    
    // Find the input inside the FormControlLabel
    const paidCheckbox = screen.getByRole('checkbox', { name: /paid/i });
    expect(paidCheckbox).not.toBeChecked();
    
    // Click the checkbox using the label
    fireEvent.click(paidCheckbox);
    
    // After clicking, it should be checked
    expect(paidCheckbox).toBeChecked();
  });
  
  it('allows selection of different categories', () => {
    // Import the formHandlers directly to test the handler function
    // (import moved to top of file)
    
    // Create a mock setState function
    const mockSetBill = jest.fn();
    
    // Create a mock SelectChangeEvent that matches the expected type for MUI Select
    const mockEvent = {
      target: {
        name: 'category',
        value: 'Housing'
      }
    } as unknown as { target: { name: string; value: string } };
    
    // Call the handler directly
    // @ts-expect-error: We are intentionally mocking the event shape for the test
    formHandlers.handleSelectChange(mockSetBill, mockEvent);
    
    // Verify the setState function was called with the correct updater function
    expect(mockSetBill).toHaveBeenCalled();
    
    // Extract the updater function
    const updaterFn = mockSetBill.mock.calls[0][0];
    
    // Apply the updater function to a mock previous state
    const newState = updaterFn({ category: 'Utilities' });
    
    // Verify the category was updated correctly
    expect(newState).toEqual({ category: 'Housing' });
  });
  
  // Add a new test that verifies we can test more aspects of the form
  it('updates bill name and amount when changed', () => {
    render(<StaticBillForm />, { wrapper: MockProvider });
    
    // Get form inputs
    const nameInput = screen.getByTestId('bill-name-input');
    const amountInput = screen.getByTestId('bill-amount-input');
    
    // Change the name input
    fireEvent.change(nameInput, { target: { value: 'Internet Bill' } });
    expect(nameInput).toHaveValue('Internet Bill');
    
    // Change the amount input
    fireEvent.change(amountInput, { target: { value: '99.99' } });
    expect(amountInput).toHaveValue(99.99);
  });
});
