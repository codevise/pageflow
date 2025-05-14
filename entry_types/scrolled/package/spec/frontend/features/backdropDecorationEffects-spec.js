import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

import effectsStyles from 'frontend/BackdropFrameEffect.module.css';

import {usePortraitOrientation} from 'frontend/usePortraitOrientation';
jest.mock('frontend/usePortraitOrientation');

describe('backdrop decoration effects', () => {
  usePageObjects();

  it('does not render Backdrop frame', () => {
    const {container} = renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100}
            }
          }
        ]
      }
    });

    expect(container.querySelector(`.${effectsStyles.outer}`)).not.toBeInTheDocument();
  });

  it('renders elements if effect is present', () => {
    const {container} = renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100},
              backdropEffects: [
                {
                  name: 'frame',
                  value: '#ff0'
                }
              ]
            }
          }
        ]
      }
    });

    expect(container.querySelector(`.${effectsStyles.outer}`)).toBeInTheDocument();
  });

  it('supports scroll parallax for mobile image', () => {
    usePortraitOrientation.mockReturnValue(true);

    const {container} = renderEntry({
      seed: {
        imageFiles: [
          {permaId: 100},
          {permaId: 101},
        ],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {
                image: 100,
                imageMobile: 101
              },
              backdropEffectsMobile: [
                {
                  name: 'frame',
                  value: '#ff0'
                }
              ]
            }
          }
        ]
      }
    });

    expect(container.querySelector(`.${effectsStyles.outer}`)).toBeInTheDocument();
    expect(container.querySelector(`.${effectsStyles.outer}`)).toHaveStyle('--frame-color: #ff0');
  });
});
