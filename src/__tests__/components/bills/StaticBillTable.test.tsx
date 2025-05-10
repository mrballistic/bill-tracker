import React from 'react';
import { render, screen, fireEvent, waitForElementToBeRemoved } from '@testing-library/react';
import StaticBillTable from '@/components/bills/StaticBillTable';

// IMPORTANT: Mock the module before importing the component
jest.mock('@/lib/staticData', () => ({
  staticBills: [
    {
      id: 'test-bill-1',
      name: 'Test Bill',
      amount: 100,
      date: '2023-01-01',
      category: 'Test Category',
      isPaid: false
    }
  ],
  formatCurrency: jest.fn((amount) => `$${amount}.00`),
  formatDate: jest.fn(() => 'Jan 1, 2023')
}));

describe('StaticBillTable', () => {
  it('renders the table with static bills', () => {
    render(<StaticBillTable />);
    expect(screen.getByRole('table', { name: /bills table/i })).toBeInTheDocument();
    expect(screen.getAllByRole('row').length).toBeGreaterThan(1); // Header row + data rows
    expect(screen.getByText('Test Bill')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('Test Category')).toBeInTheDocument();
  });

  it('opens and closes the view dialog', async () => {
    render(<StaticBillTable />);
    
    // Get the first view button (since there's only one bill)
    const viewButtons = screen.getAllByTestId('view-bill-button');
    fireEvent.click(viewButtons[0]);
    
    // Dialog should appear
    expect(screen.getByText(/bill details/i)).toBeInTheDocument();
    
    // Close dialog
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Wait for dialog to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/bill details/i));
  });

  it('opens and closes the edit dialog', async () => {
    render(<StaticBillTable />);
    
    // Get the first edit button
    const editButtons = screen.getAllByTestId('edit-bill-button');
    fireEvent.click(editButtons[0]);
    
    // Dialog should appear
    expect(screen.getByText(/edit bill/i)).toBeInTheDocument();
    
    // Close dialog
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Wait for dialog to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/edit bill/i));
  });

  it('opens and closes the delete dialog', async () => {
    render(<StaticBillTable />);
    
    // Get the first delete button
    const deleteButtons = screen.getAllByTestId('delete-bill-button');
    fireEvent.click(deleteButtons[0]);
    
    // Dialog should appear
    expect(screen.getByText(/delete bill/i)).toBeInTheDocument();
    
    // Close dialog
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);
    
    // Wait for dialog to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/delete bill/i));
  });

  it('confirms delete in the dialog', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    
    render(<StaticBillTable />);
    const deleteButtons = screen.getAllByTestId('delete-bill-button');
    fireEvent.click(deleteButtons[0]);
    
    // Dialog should appear
    expect(screen.getByText(/delete bill/i)).toBeInTheDocument();
    
    // Click delete button in dialog
    const deleteConfirmButton = screen.getByRole('button', { name: /^delete$/i });
    fireEvent.click(deleteConfirmButton);
    
    // Wait for dialog to disappear
    await waitForElementToBeRemoved(() => screen.queryByText(/delete bill/i));
    
    // Verify the console log was called with the expected value
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Delete bill'));
    consoleSpy.mockRestore();
  });

  it('calls handleTogglePaidStatus when status icon is clicked', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    render(<StaticBillTable />);
    
    // Find and click the status toggle button
    const statusButtons = screen.getAllByTestId('toggle-status-button');
    fireEvent.click(statusButtons[0]);
    
    // Verify the console log was called
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Toggle paid status'));
    consoleSpy.mockRestore();
  });

  it('paginates rows when changing page', () => {
    render(<StaticBillTable />);
    
    // Try changing the page
    const nextPageButton = screen.getByRole('button', { name: /go to next page/i });
    fireEvent.click(nextPageButton);
    
    // Table should still be there
    expect(screen.getByRole('table')).toBeInTheDocument();
  });
});
