import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('v2 toggle', () => {
  usePageObjects();

  it('does not render v2 background by default', () => {
    const {queryByTestId} = renderEntry({
      seed: {
        sections: [
          {permaId: 10}
        ]
      }
    });

    expect(queryByTestId('backdrop-v2')).toBeNull();
  });

  it('renders v2 backdrop component when frontendVersion from seed data is 2', () => {
    const {queryByTestId} = renderEntry({
      seed: {
        sections: [
          {permaId: 10}
        ],
        additionalSeedData: {
          frontendVersion: 2
        }
      }
    });

    expect(queryByTestId('backdrop-v2')).not.toBeNull();
  });
});
