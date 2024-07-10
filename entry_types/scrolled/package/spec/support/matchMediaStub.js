let mockOrientation;
let mockPrefersReducedMotion;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => {
    if (query === '(orientation: portrait)') {
      return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        matches: mockOrientation === 'portrait'
      };
    }
    else if (query === '(orientation: landscape)') {
      return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        matches: mockOrientation !== 'portrait'
      };
    }
    else if (query === '(prefers-reduced-motion)') {
      return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        matches: mockPrefersReducedMotion
      };
    }
    else {
      return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        matches: false
      };
    }
  })
});

beforeEach(() => {
  mockOrientation = 'landscape';
  mockPrefersReducedMotion = false;
});

window.matchMedia.mockPortrait = () => mockOrientation = 'portrait';
window.matchMedia.mockPrefersReducedMotion = () => mockPrefersReducedMotion = true;
