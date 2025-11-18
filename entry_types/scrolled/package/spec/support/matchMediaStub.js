let mockOrientation;
let mockPrefersReducedMotion;
let mockViewportWidth;

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => {
    let match;

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
    else if (query === '(prefers-reduced-motion)' ||
             query === '(prefers-reduced-motion: reduce)') {
      return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        matches: mockPrefersReducedMotion
      };
    }
    else if ((match = query.match(/^\(max-width: ([0-9]+)px\)$/))) {
      return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        matches: mockViewportWidth <= parseInt(match[1], 10)
      };
    }
    else if ((match = query.match(/^\(min-width: ([0-9]+)px\)$/))) {
      return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        matches: mockViewportWidth >= parseInt(match[1], 10)
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
  mockViewportWidth = 1920;
});

window.matchMedia.mockPortrait = () => mockOrientation = 'portrait';
window.matchMedia.mockPrefersReducedMotion = () => mockPrefersReducedMotion = true;
window.matchMedia.mockViewportWidth = (width) => mockViewportWidth = width;
