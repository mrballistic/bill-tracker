import '@testing-library/jest-dom';

// Global cleanup after all tests to help prevent Jest from hanging
afterAll(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});
