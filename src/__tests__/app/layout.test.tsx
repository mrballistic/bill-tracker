import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '@/app/layout';

// Mock dependencies that are not essential for layout rendering
jest.mock('@/components/theme/ThemeRegistry', () => ({
  __esModule: true,
  default: ({ children }: React.PropsWithChildren<object>) => <div data-testid="theme-registry">{children}</div>
}));
jest.mock('@/components/layout/Navigation', () => ({
  __esModule: true,
  default: () => <nav data-testid="navigation">Mock Navigation</nav>
}));
jest.mock('@/contexts/BillContext', () => ({
  BillProvider: ({ children }: React.PropsWithChildren<object>) => <div data-testid="bill-provider">{children}</div>
}));

describe('RootLayout', () => {
  it('renders children and layout elements', () => {
    render(
      <RootLayout>
        <div data-testid="test-child">Test Child</div>
      </RootLayout>
    );

    // Check for skip link
    expect(screen.getByText(/skip to main content/i)).toBeInTheDocument();
    // Check for navigation
    expect(screen.getByTestId('navigation')).toBeInTheDocument();
    // Check for main content container
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    // Check that children are rendered
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    // Check for theme and provider wrappers
    expect(screen.getByTestId('theme-registry')).toBeInTheDocument();
    expect(screen.getByTestId('bill-provider')).toBeInTheDocument();
  });

  it('main content is focusable', () => {
    render(
      <RootLayout>
        <div>Content</div>
      </RootLayout>
    );
    const main = screen.getByRole('main');
    expect(main).toHaveAttribute('tabindex', '-1');
  });
});
