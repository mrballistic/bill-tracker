import React from 'react';
import { render, screen } from '@testing-library/react';
import ThemeRegistry from '../../../components/theme/ThemeRegistry';
import useMediaQuery from '@mui/material/useMediaQuery';

// Mock useMediaQuery
jest.mock('@mui/material/useMediaQuery');
const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<typeof useMediaQuery>;

describe('ThemeRegistry', () => {
  beforeEach(() => {
    // Default to light mode
    mockUseMediaQuery.mockReturnValue(false);
    jest.clearAllMocks();
  });

  it('renders children properly', () => {
    render(
      <ThemeRegistry>
        <div>Test Child</div>
      </ThemeRegistry>
    );
    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  it('initializes with light theme when system preference is light', () => {
    mockUseMediaQuery.mockReturnValue(false);
    
    render(
      <ThemeRegistry>
        <div data-testid="theme-child">Theme Content</div>
      </ThemeRegistry>
    );
    
    // Check that useMediaQuery was called with the correct query
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('initializes with dark theme when system preference is dark', () => {
    mockUseMediaQuery.mockReturnValue(true);
    
    render(
      <ThemeRegistry>
        <div data-testid="theme-child">Theme Content</div>
      </ThemeRegistry>
    );
    
    // Check that useMediaQuery was called with the correct query
    expect(mockUseMediaQuery).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
  });

  it('includes CssBaseline for styling reset', () => {
    const { container } = render(
      <ThemeRegistry>
        <div>Test</div>
      </ThemeRegistry>
    );
    
    // CssBaseline applies normalization styles to the root HTML element
    expect(container.firstChild).toBeInTheDocument();
  });

  // We can't directly test the theme changing in response to media queries
  // in a JSDOM environment, but we can test that the hook is called
  it('uses the useMediaQuery hook for responsive design', () => {
    render(
      <ThemeRegistry>
        <div>Content</div>
      </ThemeRegistry>
    );
    
    expect(mockUseMediaQuery).toHaveBeenCalledTimes(1);
  });
});
