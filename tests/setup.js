// Global test setup

// Mock window object if needed
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
  },
});

// Mock console methods to avoid noise in tests
global.console = {
  ...console,
  // Uncomment if you want to suppress console output in tests
  // log: () => {},
  // warn: () => {},
  // error: () => {},
};
