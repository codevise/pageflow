import React from 'react';

import {Counter} from 'contentElements/counter/Counter';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {contentElementWidths} from 'pageflow-scrolled/frontend';

import styles from 'contentElements/counter/Counter.module.css';

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

  it('defaults to md size for number', () => {
    const {getByText} = renderCounter();

    expect(getByText('10')).toHaveScaleCategory('counterNumber', 'md');
  });

  it('defaults to md size for unit', () => {
    const {getByText} = renderCounter({unit: 'kg'});

    expect(getByText('kg')).toHaveScaleCategory('counterUnit', 'md');
  });

  it('defaults to md size for description', () => {
    const {getByText} = renderCounter({
      description: [{type: 'paragraph', children: [{text: 'Some text'}]}]
    });

    expect(getByText('Some text')).toHaveScaleCategory('counterDescription', 'md');
  });

  it('maps legacy textSize large to counterNumber-xxxl', () => {
    const {getByText} = renderCounter({textSize: 'large'});

    expect(getByText('10')).toHaveScaleCategory('counterNumber', 'xxxl');
  });

  it('maps legacy textSize medium to counterNumber-xl', () => {
    const {getByText} = renderCounter({textSize: 'medium'});

    expect(getByText('10')).toHaveScaleCategory('counterNumber', 'xl');
  });

  it('maps legacy textSize small to counterNumber-md', () => {
    const {getByText} = renderCounter({textSize: 'small'});

    expect(getByText('10')).toHaveScaleCategory('counterNumber', 'md');
  });

  it('maps legacy textSize verySmall to counterNumber-xs', () => {
    const {getByText} = renderCounter({textSize: 'verySmall'});

    expect(getByText('10')).toHaveScaleCategory('counterNumber', 'xs');
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

  describe('textAlign', () => {
    function renderCounterWithOptions(configuration, {width, sectionProps} = {}) {
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
          contentElementWidth={width || contentElementWidths.md}
          sectionProps={sectionProps || {}}
        />, {
          editorState: {isEditable: false}
        }
      );
    }

    it('centers wide elements by default', () => {
      const {container} = renderCounterWithOptions({}, {width: contentElementWidths.xl});

      expect(container.firstChild).toHaveClass(styles.center);
    });

    it('does not center narrow elements by default', () => {
      const {container} = renderCounterWithOptions({}, {width: contentElementWidths.md});

      expect(container.firstChild).not.toHaveClass(styles.center);
    });

    it('applies centerRagged alignment from sectionProps layout by default', () => {
      const {container} = renderCounterWithOptions({}, {sectionProps: {layout: 'centerRagged'}});
      const wrapper = container.querySelector('[class*="wrapper"]');
      const numberWrapper = container.querySelector('[class*="number"]');
      const descriptionDiv = wrapper.lastChild;

      expect(container.firstChild).toHaveClass(styles.center);
      expect(numberWrapper).toHaveClass(styles.numberCenter);
      expect(descriptionDiv).toHaveClass(styles.textCenter);
    });

    it('applies left alignment when textAlign is left', () => {
      const {container} = renderCounterWithOptions(
        {textAlign: 'left'},
        {width: contentElementWidths.xl}
      );

      expect(container.firstChild).toHaveClass(styles.left);
      expect(container.firstChild).not.toHaveClass(styles.center);
    });

    it('applies right alignment when textAlign is right', () => {
      const {container} = renderCounterWithOptions(
        {textAlign: 'right'},
        {width: contentElementWidths.xl}
      );

      expect(container.firstChild).toHaveClass(styles.right);
    });

    it('applies center alignment when textAlign is center', () => {
      const {container} = renderCounterWithOptions(
        {textAlign: 'center'},
        {width: contentElementWidths.md}
      );

      expect(container.firstChild).toHaveClass(styles.center);
    });

    it('centers description text when textAlign is centerRagged', () => {
      const {container} = renderCounterWithOptions(
        {textAlign: 'centerRagged'},
        {width: contentElementWidths.md}
      );
      const wrapper = container.querySelector('[class*="wrapper"]');
      const descriptionDiv = wrapper.lastChild;

      expect(descriptionDiv).toHaveClass(styles.textCenter);
    });

    it('centers the number when textAlign is center', () => {
      const {container} = renderCounterWithOptions(
        {textAlign: 'center'},
        {width: contentElementWidths.md}
      );
      const numberWrapper = container.querySelector('[class*="number"]');

      expect(numberWrapper).toHaveClass(styles.numberCenter);
    });

    it('centers the number when textAlign is centerRagged', () => {
      const {container} = renderCounterWithOptions(
        {textAlign: 'centerRagged'},
        {width: contentElementWidths.md}
      );
      const numberWrapper = container.querySelector('[class*="number"]');

      expect(numberWrapper).toHaveClass(styles.numberCenter);
    });

    it('does not center the number when textAlign is left', () => {
      const {container} = renderCounterWithOptions(
        {textAlign: 'left'},
        {width: contentElementWidths.xl}
      );
      const numberWrapper = container.querySelector('[class*="number"]');

      expect(numberWrapper).not.toHaveClass(styles.numberCenter);
    });

    it('right aligns the number when textAlign is right', () => {
      const {container} = renderCounterWithOptions(
        {textAlign: 'right'},
        {width: contentElementWidths.md}
      );
      const numberWrapper = container.querySelector('[class*="number"]');

      expect(numberWrapper).toHaveClass(styles.numberRight);
    });

    it('right aligns description text when textAlign is right', () => {
      const {container} = renderCounterWithOptions(
        {textAlign: 'right'},
        {width: contentElementWidths.md}
      );
      const wrapper = container.querySelector('[class*="wrapper"]');
      const descriptionDiv = wrapper.lastChild;

      expect(descriptionDiv).toHaveClass(styles.textRight);
    });
  });
});
