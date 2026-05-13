import {renderEntry, usePageObjects} from 'support/pageObjects';
import '@testing-library/jest-dom/extend-expect'

import effectsStyles from 'frontend/BackdropFrameEffect.module.css';

import {usePortraitOrientation} from 'frontend/usePortraitOrientation';
jest.mock('frontend/usePortraitOrientation');

describe('backdrop decoration effects', () => {
  usePageObjects();

  it('does not render Backdrop frame when no frame effect is set', () => {
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

  it('renders legacy string value as .scope-backdropFrame-default', () => {
    const {container} = renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100},
              backdropEffects: [
                {name: 'frame', value: '#ff0'}
              ]
            }
          }
        ]
      }
    });

    const outer = container.querySelector(`.${effectsStyles.outer}`);

    expect(outer).toBeInTheDocument();
    expect(outer).toHaveClass('scope-backdropFrame-default');
    expect(outer).toHaveStyle('--frame-color: #ff0');
  });

  it('renders structured value with named design as .scope-backdropFrame-<design>', () => {
    const {container} = renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100},
              backdropEffects: [
                {name: 'frame', value: {color: '#abc', design: 'vintage'}}
              ]
            }
          }
        ]
      }
    });

    const outer = container.querySelector(`.${effectsStyles.outer}`);

    expect(outer).toBeInTheDocument();
    expect(outer).toHaveClass('scope-backdropFrame-vintage');
    expect(outer).toHaveStyle('--frame-color: #abc');
  });

  it('renders structured value with default design as .scope-backdropFrame-default', () => {
    const {container} = renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100},
              backdropEffects: [
                {name: 'frame', value: {color: '#ff0', design: 'default'}}
              ]
            }
          }
        ]
      }
    });

    const outer = container.querySelector(`.${effectsStyles.outer}`);

    expect(outer).toBeInTheDocument();
    expect(outer).toHaveClass('scope-backdropFrame-default');
    expect(outer).toHaveStyle('--frame-color: #ff0');
  });

  it('renders structured value without design as .scope-backdropFrame-default', () => {
    const {container} = renderEntry({
      seed: {
        imageFiles: [{permaId: 100}],
        sections: [
          {
            permaId: 1,
            configuration: {
              backdrop: {image: 100},
              backdropEffects: [
                {name: 'frame', value: {color: '#ff0'}}
              ]
            }
          }
        ]
      }
    });

    const outer = container.querySelector(`.${effectsStyles.outer}`);

    expect(outer).toBeInTheDocument();
    expect(outer).toHaveClass('scope-backdropFrame-default');
    expect(outer).toHaveStyle('--frame-color: #ff0');
  });

  it('supports frame effect on mobile image', () => {
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
                {name: 'frame', value: {color: '#ff0', design: 'vintage'}}
              ]
            }
          }
        ]
      }
    });

    const outer = container.querySelector(`.${effectsStyles.outer}`);

    expect(outer).toBeInTheDocument();
    expect(outer).toHaveClass('scope-backdropFrame-vintage');
    expect(outer).toHaveStyle('--frame-color: #ff0');
  });
});
