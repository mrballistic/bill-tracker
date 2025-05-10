import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BillProvider, useBills } from '../../contexts/BillContext';
import { Bill } from '../../models/Bill';

// Mock uuid and localStorage
jest.mock('uuid', () => ({
  v4: () => 'test-uuid-123'
}));

describe('BillContext', () => {
  // Sample bills for testing
  const mockBills: Bill[] = [
    { id: '1', name: 'Rent', amount: 1200, date: '2025-05-01', category: 'Housing', isPaid: false },
    { id: '2', name: 'Internet', amount: 60, date: '2025-05-10', category: 'Utilities', isPaid: false },
  ];

  // Create a test component to access the context
  const TestComponent: React.FC = () => {
    const { 
      bills, 
      addBill, 
      updateBill, 
      deleteBill, 
      togglePaidStatus, 
      loading, 
      error 
    } = useBills();

    return (
      <div>
        <div data-testid="loading-state">{loading.toString()}</div>
        <div data-testid="error-state">{error || 'no-error'}</div>
        <div data-testid="bills-count">{bills.length}</div>
        <ul>
          {bills.map(bill => (
            <li key={bill.id} data-testid={`bill-${bill.id}`}>
              {bill.name} - ${bill.amount} - {bill.isPaid ? 'Paid' : 'Unpaid'}
              <button 
                onClick={() => togglePaidStatus(bill.id)}
                data-testid={`toggle-${bill.id}`}
              >
                Toggle Paid
              </button>
              <button 
                onClick={() => deleteBill(bill.id)}
                data-testid={`delete-${bill.id}`}
              >
                Delete
              </button>
              <button 
                onClick={() => updateBill(bill.id, { ...bill, amount: bill.amount + 100 })}
                data-testid={`update-${bill.id}`}
              >
                Update Amount
              </button>
            </li>
          ))}
        </ul>
        <button 
          onClick={() => addBill({
            name: 'New Bill',
            amount: 50,
            date: '2025-05-15',
            category: 'Other',
            isPaid: false
          })}
          data-testid="add-bill"
        >
          Add Bill
        </button>
      </div>
    );
  };

  let originalLocalStorage: Storage;
  let mockLocalStorage: { [key: string]: string };

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {};
    originalLocalStorage = global.localStorage;
    
    Object.defineProperty(global, 'localStorage', {
      value: {
        getItem: jest.fn((key) => mockLocalStorage[key] || null),
        setItem: jest.fn((key, value) => {
          mockLocalStorage[key] = value;
        }),
        removeItem: jest.fn((key) => {
          delete mockLocalStorage[key];
        }),
        clear: jest.fn(() => {
          mockLocalStorage = {};
        }),
        length: 0,
        key: jest.fn(),
      },
      writable: true
    });
    
    // Remove fetch mock (no API route in static export)
    // @ts-expect-error: fetch is not used in static export
    global.fetch = undefined;

    // Set up localStorage mock data
    mockLocalStorage['bill-tracker-bills'] = JSON.stringify(mockBills);
  });

  afterEach(() => {
    jest.clearAllMocks();
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true
    });
  });

  test('loads bills from localStorage on mount', async () => {
    render(
      <BillProvider>
        <TestComponent />
      </BillProvider>
    );

    // Initially loading
    expect(screen.getByTestId('loading-state').textContent).toBe('true');

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('false');
    });

    // Check that bills were loaded
    expect(screen.getByTestId('bills-count').textContent).toBe('2');
    expect(screen.getByTestId('bill-1').textContent).toContain('Rent');
    expect(screen.getByTestId('bill-2').textContent).toContain('Internet');
  });

  test('adds a new bill', async () => {
    const user = userEvent.setup();
    
    render(
      <BillProvider>
        <TestComponent />
      </BillProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('false');
    });

    // Add a new bill
    await user.click(screen.getByTestId('add-bill'));

    // Check that the new bill was added
    expect(screen.getByTestId('bills-count').textContent).toBe('3');
    expect(screen.getByTestId('bill-test-uuid-123').textContent).toContain('New Bill');
  });

  test('updates an existing bill', async () => {
    const user = userEvent.setup();
    
    render(
      <BillProvider>
        <TestComponent />
      </BillProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('false');
    });

    // Original amount
    expect(screen.getByTestId('bill-1').textContent).toContain('$1200');

    // Update the bill
    await user.click(screen.getByTestId('update-1'));

    // Check that the bill was updated
    expect(screen.getByTestId('bill-1').textContent).toContain('$1300');
  });

  test('deletes a bill', async () => {
    const user = userEvent.setup();
    
    render(
      <BillProvider>
        <TestComponent />
      </BillProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('false');
    });

    // Initially 2 bills
    expect(screen.getByTestId('bills-count').textContent).toBe('2');

    // Delete a bill
    await user.click(screen.getByTestId('delete-1'));

    // Check that the bill was deleted
    expect(screen.getByTestId('bills-count').textContent).toBe('1');
    expect(screen.queryByTestId('bill-1')).not.toBeInTheDocument();
    expect(screen.getByTestId('bill-2')).toBeInTheDocument();
  });

  test('toggles paid status of a bill', async () => {
    const user = userEvent.setup();
    
    render(
      <BillProvider>
        <TestComponent />
      </BillProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('false');
    });

    // Initially unpaid
    expect(screen.getByTestId('bill-1').textContent).toContain('Unpaid');

    // Toggle paid status
    await user.click(screen.getByTestId('toggle-1'));

    // Check that status was toggled
    expect(screen.getByTestId('bill-1').textContent).toContain('Paid');

    // Toggle again
    await user.click(screen.getByTestId('toggle-1'));

    // Check that status was toggled back
    expect(screen.getByTestId('bill-1').textContent).toContain('Unpaid');
  });

  test('handles error when localStorage is not available', async () => {
    // Remove localStorage mock data
    mockLocalStorage = {};
    
    // Mock localStorage.getItem to throw an error
    (global.localStorage.getItem as jest.Mock).mockImplementationOnce(() => {
      throw new Error('localStorage not available');
    });

    render(
      <BillProvider>
        <TestComponent />
      </BillProvider>
    );

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.getByTestId('loading-state').textContent).toBe('false');
    });

    // Should have no bills
    expect(screen.getByTestId('bills-count').textContent).toBe('0');
  });
});
