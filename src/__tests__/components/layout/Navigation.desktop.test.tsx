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
});
