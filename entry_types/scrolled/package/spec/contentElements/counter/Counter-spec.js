import React from 'react';

import {Counter} from 'contentElements/counter/Counter';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {contentElementWidths} from 'pageflow-scrolled/frontend';

import '@testing-library/jest-dom/extend-expect';
import 'support/toHaveScaleCategory';
import 'support/toHaveColor';

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

  it('renders unit with counterUnit scale category', () => {
    const {getByText} = renderCounter({unit: 'kg'});

    expect(getByText('kg')).toHaveScaleCategory('counterUnit');
  });

  it('renders unit with counterUnit size typography class', () => {
    const {getByText} = renderCounter({unit: 'kg', unitSize: 'lg'});

    expect(getByText('kg')).toHaveScaleCategory('counterUnit', 'lg');
  });

  it('renders unit inside counterNumber', () => {
    const {getByText} = renderCounter({unit: 'kg'});

    expect(getByText('kg')).toHaveScaleCategory('counterNumber');
  });

  it('renders number with counterNumber scale category', () => {
    const {getByText} = renderCounter();

    expect(getByText('10')).toHaveScaleCategory('counterNumber');
  });

  it('renders number with counterNumber size typography class', () => {
    const {getByText} = renderCounter({numberSize: 'lg'});

    expect(getByText('10')).toHaveScaleCategory('counterNumber', 'lg');
  });

  it('renders description with counterDescription scale category', () => {
    const {getByText} = renderCounter({
      description: [{type: 'paragraph', children: [{text: 'Some text'}]}]
    });

    expect(getByText('Some text')).toHaveScaleCategory('counterDescription');
  });

  it('applies number color', () => {
    const {getByText} = renderCounter({numberColor: '#f00'});

    expect(getByText('10')).toHaveColor('#f00');
  });

  it('inherits number color for unit by default', () => {
    const {getByText} = renderCounter({unit: 'kg', numberColor: '#f00'});

    expect(getByText('kg')).toHaveColor('#f00');
  });

  it('applies unit color', () => {
    const {getByText} = renderCounter({unit: 'kg', unitColor: '#0f0'});

    expect(getByText('kg')).toHaveColor('#0f0');
  });

  it('overrides number color with unit color', () => {
    const {getByText} = renderCounter({unit: 'kg', numberColor: '#f00', unitColor: '#0f0'});

    expect(getByText('kg')).toHaveColor('#0f0');
  });

  it('applies description color', () => {
    const {getByText} = renderCounter({
      description: [{type: 'paragraph', children: [{text: 'Some text'}]}],
      descriptionColor: '#00f'
    });

    expect(getByText('Some text')).toHaveColor('#00f');
  });

  it('renders description with counterDescription size typography class', () => {
    const {getByText} = renderCounter({
      description: [{type: 'paragraph', children: [{text: 'Some text'}]}],
      descriptionSize: 'lg'
    });

    expect(getByText('Some text')).toHaveScaleCategory('counterDescription', 'lg');
  });

  it('starts animation on activate by default', () => {
    const {container, simulateScrollPosition} = renderCounter();
    const numberWrapper = container.querySelector('[class*="number"]');

    expect(numberWrapper.className).not.toContain('animation-fadeIn-active');

    simulateScrollPosition('in viewport');

    expect(numberWrapper.className).not.toContain('animation-fadeIn-active');

    simulateScrollPosition('center of viewport');

    expect(numberWrapper.className).toContain('animation-fadeIn-active');
  });

  it('starts animation on visible when configured', () => {
    const {container, simulateScrollPosition} = renderCounter({startAnimationTrigger: 'onVisible'});
    const numberWrapper = container.querySelector('[class*="number"]');

    expect(numberWrapper.className).not.toContain('animation-fadeIn-active');

    simulateScrollPosition('in viewport');

    expect(numberWrapper.className).toContain('animation-fadeIn-active');
  });
});
