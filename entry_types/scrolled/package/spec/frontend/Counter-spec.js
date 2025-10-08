import React from 'react';

import {Counter} from 'contentElements/counter/Counter';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {contentElementWidths} from 'pageflow-scrolled/frontend';

import '@testing-library/jest-dom/extend-expect';

describe('Counter', () => {
  function renderCounter(configuration = {}) {
    const baseConfiguration = {
      targetValue: 10,
      startValue: 0,
      countingSpeed: 'none',
      entranceAnimation: 'fadeIn',
      ...configuration
    };

    return renderInContentElement(
      <Counter
        configuration={baseConfiguration}
        contentElementId={5}
        contentElementWidth={contentElementWidths.md}
        sectionProps={{}}
      />, {
        editorState: {isEditable: false}
      }
    );
  }

  it('starts animation on activate by default', () => {
    const {getByText, simulateScrollPosition} = renderCounter();

    expect(getByText('10').className).not.toContain('animation-fadeIn-active');

    simulateScrollPosition('in viewport');

    expect(getByText('10').className).not.toContain('animation-fadeIn-active');

    simulateScrollPosition('center of viewport');

    expect(getByText('10').className).toContain('animation-fadeIn-active');
  });

  it('starts animation on visible when configured', () => {
    const {getByText, simulateScrollPosition} = renderCounter({startAnimationTrigger: 'onVisible'});

    expect(getByText('10').className).not.toContain('animation-fadeIn-active');

    simulateScrollPosition('in viewport');

    expect(getByText('10').className).toContain('animation-fadeIn-active');
  });
});
