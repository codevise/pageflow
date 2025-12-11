import React from 'react';

import {
  SectionIntersectionObserver,
  SectionIntersectionProbe
} from 'frontend/SectionIntersectionObserver';

import {StaticPreview} from 'frontend/useScrollPositionLifecycle';

import {
  fakeIntersectionObserver,
  simulateScrollingIntoView,
  simulateScrollingOutOfView,
} from 'support/fakeIntersectionObserver';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

describe('SectionIntersectionObserver', () => {
  it('renders children', () => {
    const {getByText} = render(
      <SectionIntersectionObserver sections={[]}>
        <div>Some text</div>
      </SectionIntersectionObserver>
    );

    expect(getByText('Some text')).toBeInTheDocument();
  });

  it('invokes callback when section intersects', () => {
    const sections = [
      {id: 1},
      {id: 2}
    ];
    const callback = jest.fn();

    const {getByTestId} = render(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback}>
        <section data-testid="section1">
          <SectionIntersectionProbe section={sections[0]} />
        </section>
        <section data-testid="section2">
          <SectionIntersectionProbe section={sections[1]} />
        </section>
      </SectionIntersectionObserver>
    );

    simulateScrollingIntoView(getByTestId('section1'));

    expect(callback).toHaveBeenCalledWith(sections[0]);
    expect(callback).not.toHaveBeenCalledWith(sections[1]);
  });

  it('invokes callback with null if section not longer intersects', () => {
    const sections = [
      {id: 1},
    ];
    const callback = jest.fn();

    const {getByTestId} = render(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback}>
        <section data-testid="section1">
          <SectionIntersectionProbe section={sections[0]} />
        </section>
      </SectionIntersectionObserver>
    );

    simulateScrollingIntoView(getByTestId('section1'));
    callback.mockReset();
    simulateScrollingOutOfView(getByTestId('section1'));

    expect(callback).toHaveBeenCalledWith(null);
  });

  it('always reports last section as intersecting if multiple probes report intersection', () => {
    const sections = [
      {id: 1},
      {id: 2}
    ];
    const callback = jest.fn();

    const {getByTestId} = render(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback}>
        <section data-testid="section1">
          <SectionIntersectionProbe section={sections[0]} />
        </section>
        <section data-testid="section2">
          <SectionIntersectionProbe section={sections[1]} />
        </section>
      </SectionIntersectionObserver>
    );

    simulateScrollingIntoView(getByTestId('section1'));
    callback.mockReset();
    simulateScrollingIntoView(getByTestId('section2'));

    expect(callback).toHaveBeenCalledWith(sections[1]);

    callback.mockReset();
    simulateScrollingOutOfView(getByTestId('section1'));

    expect(callback).not.toHaveBeenCalled();

    callback.mockReset();
    simulateScrollingOutOfView(getByTestId('section2'));

    expect(callback).toHaveBeenCalledWith(null);

  });

  it('supports custom probe class names', () => {
    const sections = [
      {id: 1}
    ];
    const callback = jest.fn();

    const {getByTestId} = render(
      <SectionIntersectionObserver sections={sections}
                                   probeClassName="customClassName"
                                   onChange={callback}>
        <section data-testid="section1">
          <SectionIntersectionProbe section={sections[0]} />
        </section>
      </SectionIntersectionObserver>
    );

    expect(getByTestId('section1').querySelector('.customClassName')).toBeInTheDocument();
  });

  it('supports nested observers', () => {
    const section = {id: 1};
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const {getByTestId} = render(
      <SectionIntersectionObserver sections={[section]}
                                   onChange={callback1}>
        <SectionIntersectionObserver sections={[section]}
                                     onChange={callback2}>
          <section data-testid="section1">
            <SectionIntersectionProbe section={section} />
          </section>
        </SectionIntersectionObserver>
      </SectionIntersectionObserver>
    );

    simulateScrollingIntoView(getByTestId('section1'));

    expect(callback1).toHaveBeenCalledWith(section);
    expect(callback2).toHaveBeenCalledWith(section);
  });

  it('unobserves probes on unmount', () => {
    const sections = [
      {id: 1}
    ];
    const callback = jest.fn();

    const {rerender} = render(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback}>
        <section data-testid="section1">
          <SectionIntersectionProbe section={sections[0]} />
        </section>
      </SectionIntersectionObserver>
    );

    rerender(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback} />
    )

    expect(fakeIntersectionObserver.observedElements.size).toEqual(0);
  });

  it('disconnects observer on unmount', () => {
    const sections = [
      {id: 1}
    ];
    const callback = jest.fn();

    const {unmount} = render(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback}>
        <section data-testid="section1">
          <SectionIntersectionProbe section={sections[0]} />
        </section>
      </SectionIntersectionObserver>
    );

    unmount();

    expect(fakeIntersectionObserver.instances.size).toEqual(0);
  });

  it('uses updated callback when onChange prop changes', () => {
    const sections = [
      {id: 1}
    ];
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    const {getByTestId, rerender} = render(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback1}>
        <section data-testid="section1">
          <SectionIntersectionProbe section={sections[0]} />
        </section>
      </SectionIntersectionObserver>
    );

    rerender(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback2}>
        <section data-testid="section1">
          <SectionIntersectionProbe section={sections[0]} />
        </section>
      </SectionIntersectionObserver>
    );

    simulateScrollingIntoView(getByTestId('section1'));

    expect(callback2).toHaveBeenCalledWith(sections[0]);
    expect(callback1).not.toHaveBeenCalled();
  });

  it('does not re-subscribe probes on rerender', () => {
    const sections = [
      {id: 1}
    ];
    const callback = jest.fn();

    const {rerender} = render(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback}>
        <section data-testid="section1">
          <SectionIntersectionProbe section={sections[0]} />
        </section>
      </SectionIntersectionObserver>
    );

    const observer = [...fakeIntersectionObserver.instances][0];
    const observeSpy = jest.spyOn(observer, 'observe');
    const unobserveSpy = jest.spyOn(observer, 'unobserve');

    rerender(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback}>
        <section data-testid="section1">
          <SectionIntersectionProbe section={sections[0]} />
        </section>
      </SectionIntersectionObserver>
    );

    expect(observeSpy).not.toHaveBeenCalled();
    expect(unobserveSpy).not.toHaveBeenCalled();
  });

  it('is no-op inside StaticPreview', () => {
    const sections = [
      {id: 1}
    ];
    const callback = jest.fn();

    const {getByTestId} = render(
      <SectionIntersectionObserver sections={sections}
                                   onChange={callback}>
        <StaticPreview>
          <section data-testid="section1">
            <SectionIntersectionProbe section={sections[0]} />
          </section>
        </StaticPreview>
      </SectionIntersectionObserver>
    );

    simulateScrollingIntoView(getByTestId('section1'));

    expect(callback).not.toHaveBeenCalled();
  });
});
