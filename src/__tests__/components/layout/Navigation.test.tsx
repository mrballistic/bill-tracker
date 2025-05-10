import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Navigation from '../../../../src/components/layout/Navigation';
import { usePathname } from 'next/navigation';

// Mock usePathname from Next.js
jest.mock('next/navigation', () => ({
  usePathname: jest.fn().mockReturnValue('/')
}));

jest.mock('@mui/material/useMediaQuery', () => () => true);

// Get the mocked function
const mockedUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe('Navigation', () => {
  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
    
    // Default to home path
    mockedUsePathname.mockReturnValue('/');
  });

  test('renders navigation bar with title and links', async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    // Check that at least one title is displayed (allow emoji and whitespace)
    expect(screen.getAllByText(/financial bill tracker/i).length).toBeGreaterThan(0);
    // Open the mobile drawer
    const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
    await user.click(menuButton);
    const drawer = screen.getByRole('presentation');
    // Check that navigation links are present (menuitem in mobile)
    expect(within(drawer).getAllByRole('menuitem', { name: /bill management/i }).length).toBeGreaterThan(0);
  });

  test('highlights current page in navigation', async () => {
    const user = userEvent.setup();
    // Mock the current path to be the analytics page
    mockedUsePathname.mockReturnValue('/analytics');
    render(<Navigation />);
    // Open the mobile drawer
    const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
    await user.click(menuButton);
    const drawer = screen.getByRole('presentation');
    // Get all navigation menuitems
    const links = within(drawer).getAllByRole('menuitem', { name: /bill management/i });
    const analyticsLinks = within(drawer).getAllByRole('menuitem', { name: /analytics/i });
    // Find the analytics link with aria-current
    const analyticsLink = analyticsLinks.find(link => link.getAttribute('aria-current') === 'page');
    expect(analyticsLink).toBeDefined();
    // Bill Management links should not have aria-current
    links.forEach(link => expect(link).not.toHaveAttribute('aria-current', 'page'));
  });

  test('has skip to content link for accessibility', () => {
    render(<Navigation />);
    // Check that the skip link exists (actual text: Skip to main content)
    const skipLink = screen.getByText(/skip to main content/i);
    expect(skipLink).toBeInTheDocument();
    expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test('toggles mobile menu when menu button is clicked', async () => {
    const user = userEvent.setup();
    render(<Navigation />);
    // Find the menu button by its aria-label
    const menuButton = screen.getByRole('button', { name: /open navigation menu/i });
    expect(menuButton).toBeInTheDocument();
    // Mobile navigation should not be visible initially
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
    // Click the menu button
    await user.click(menuButton);
    // Mobile navigation should now be visible
    const drawer = screen.getByRole('presentation');
    expect(drawer).toBeInTheDocument();
    // Check links in mobile menu
    const billsLink = within(drawer).getByText(/bill management/i);
    const analyticsLink = within(drawer).getByText(/analytics/i);
    expect(billsLink).toBeInTheDocument();
    expect(analyticsLink).toBeInTheDocument();
    // No close button to click; just verify drawer is open and links are present
  });
});
