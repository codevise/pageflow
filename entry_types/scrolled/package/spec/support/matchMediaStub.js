let mockOrientation;

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
    else {
      return {
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        matches: false
      };
    }
  })
});

beforeEach(() => mockOrientation = 'landscape');

window.matchMedia.mockPortrait = () => mockOrientation = 'portrait';
