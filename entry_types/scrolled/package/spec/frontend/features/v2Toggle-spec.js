import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

describe('v2 toggle', () => {
  usePageObjects();

  it('does not set backdrop section attributes by default ', () => {
    const {container} = renderEntry({
      seed: {
        sections: [
          {permaId: 10, configuration: {backdrop: {image: 1}}}
        ],
        imageFiles: [{permaId: 1}]
      }
    });

    expect(container.querySelector('[style*="--backdrop-w"]')).toBeNull();
    expect(container.querySelector('[class*=apsectRatio]')).toBeNull();
  });

  it('renders v2 backdrop section attributes from seed data is 2', () => {
    const {container} = renderEntry({
      seed: {
        sections: [
          {permaId: 10, configuration: {backdrop: {image: 1}}}
        ],
        imageFiles: [{permaId: 1}],
        additionalSeedData: {
          frontendVersion: 2
        }
      }
    });

    expect(container.querySelector('[style*="--backdrop-w"]')).not.toBeNull();
    expect(container.querySelector('[class*=aspectRatio]')).not.toBeNull();
  });
});
