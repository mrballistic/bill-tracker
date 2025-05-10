import React from 'react';
import { render, screen } from '@testing-library/react';
import Navigation from '../../../../src/components/layout/Navigation';
import { usePathname } from 'next/navigation';

// Mock usePathname from Next.js
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/')
}));

// Mock useMediaQuery to return false (desktop mode)
jest.mock('@mui/material/useMediaQuery', () => () => false);

const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Navigation (desktop)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedUsePathname.mockReturnValue('/');
  });

  test('displays desktop navigation for larger screens', () => {
    render(<Navigation />);
    // Desktop navigation links should be visible
    expect(screen.getByRole('link', { name: /bill management/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /analytics/i })).toBeInTheDocument();
  });

  test('highlights current page in desktop navigation', () => {
    mockedUsePathname.mockReturnValue('/analytics');
    render(<Navigation />);
    // Find the analytics link with aria-current
    const analyticsLink = screen.getByRole('link', { name: /analytics/i });
    expect(analyticsLink).toHaveAttribute('aria-current', 'page');
    // Bill Management link should not have aria-current
    const billsLink = screen.getByRole('link', { name: /bill management/i });
    expect(billsLink).not.toHaveAttribute('aria-current', 'page');
  });

  test('has skip to content link for accessibility (desktop)', () => {
    render(<Navigation />);
    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });
});
