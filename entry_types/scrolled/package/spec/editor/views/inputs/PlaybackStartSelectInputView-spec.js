import Backbone from 'backbone';
import userEvent from '@testing-library/user-event';
import {act} from '@testing-library/react';
import {within} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

import {renderReactBasedBackboneView as render} from 'pageflow-scrolled/testHelpers';

import {
  PlaybackStartSelectInputView
} from 'editor/views/inputs/PlaybackStartSelectInputView';

import {fakeBoundingClientRectsByClassName} from 'support/fakeBoundingClientRects';

import visualizationStyles from 'editor/views/inputs/visualizations/ContentElementVisualization.module.css';

describe('PlaybackStartSelectInputView', () => {
  beforeEach(() => jest.useFakeTimers());

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  function renderInputView({position = 'inline'} = {}) {
    const model = new Backbone.Model({position, startAnimationTrigger: 'onActivate'});

    const inputView = new PlaybackStartSelectInputView({
      model,
      propertyName: 'startAnimationTrigger',
      values: ['onActivate', 'onVisible'],
      texts: ['When scrolled to center of viewport', 'When first scrolled into view'],
      position: () => model.get('position')
    });

    return {model, ...render(inputView)};
  }

  function openDropdown(getByRole) {
    const user = userEvent.setup({advanceTimers: jest.advanceTimersByTime});

    return user.click(getByRole('button', {name: 'When scrolled to center of viewport'}));
  }

  // The shared fake keeps rects in place while the visualization scrolls, which
  // hides how far it has scrolled.
  function fakeBoundingClientRectsFollowingScroll({viewportHeight, blockTop, blockHeight}) {
    jest.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockImplementation(function() {
      if (this.classList.contains(visualizationStyles.visualization)) {
        return {top: 0, height: viewportHeight};
      }
      else if (this.classList.contains(visualizationStyles.block)) {
        const scroller = this.closest(`.${visualizationStyles.visualization}`);

        return {top: blockTop - scroller.scrollTop, height: blockHeight};
      }

      return {top: 0, height: 0};
    });
  }

  function previewOf(option) {
    return option.querySelector(`.${visualizationStyles.visualization}`);
  }

  function viewportCenterOf(option) {
    return option.querySelector(`.${visualizationStyles.viewportCenter}`);
  }

  it('illustrates the currently selected position in each option', async () => {
    const {getByRole, getAllByRole} = renderInputView({position: 'standAlone'});

    await openDropdown(getByRole);

    getAllByRole('option').forEach(option =>
      expect(previewOf(option)).toHaveClass(visualizationStyles.standAlonePosition)
    );
  });

  it('leaves room to scroll and narrows the element in each option', async () => {
    const {getByRole, getAllByRole} = renderInputView();

    await openDropdown(getByRole);

    getAllByRole('option').forEach(option =>
      expect(previewOf(option)).toHaveClass(visualizationStyles.narrowBlock,
                                            visualizationStyles.scrollRoom)
    );
  });

  it('marks the viewport center in the option that starts playback there', async () => {
    const {getByRole} = renderInputView();

    await openDropdown(getByRole);

    expect(viewportCenterOf(getByRole('option', {name: 'When scrolled to center of viewport'})))
      .not.toBeNull();
    expect(viewportCenterOf(getByRole('option', {name: 'When first scrolled into view'})))
      .toBeNull();
  });

  it('plays back inside the element once the start of each option is reached', async () => {
    fakeBoundingClientRectsByClassName({
      [visualizationStyles.visualization]: {top: 0, height: 100},
      [visualizationStyles.block]: {top: 60, height: 20}
    });
    const {getByRole} = renderInputView();

    await openDropdown(getByRole);
    act(() => jest.advanceTimersByTime(500));

    expect(within(getByRole('option', {name: 'When first scrolled into view'}))
      .getByText('50%')).not.toBeNull();
    expect(within(getByRole('option', {name: 'When scrolled to center of viewport'}))
      .getByText('0%')).not.toBeNull();
  });

  it('stops scrolling once the element has passed the center of the viewport', async () => {
    fakeBoundingClientRectsFollowingScroll({
      viewportHeight: 100, blockTop: 150, blockHeight: 20
    });
    const {getByRole, getAllByRole} = renderInputView();

    await openDropdown(getByRole);
    act(() => jest.advanceTimersByTime(1500));

    getAllByRole('option').forEach(option =>
      expect(previewOf(option).scrollTop).toEqual(110)
    );
  });

  it('rests at the end of the sweep while the animation plays', async () => {
    fakeBoundingClientRectsFollowingScroll({
      viewportHeight: 100, blockTop: 150, blockHeight: 20
    });
    const {getByRole, getAllByRole} = renderInputView();

    await openDropdown(getByRole);
    act(() => jest.advanceTimersByTime(1500));
    act(() => jest.advanceTimersByTime(500));

    getAllByRole('option').forEach(option =>
      expect(previewOf(option).scrollTop).toEqual(110)
    );
  });

  it('illustrates the position the element has when opening the dropdown', async () => {
    const {model, getByRole, getAllByRole} = renderInputView({position: 'inline'});

    model.set('position', 'standAlone');
    await openDropdown(getByRole);

    getAllByRole('option').forEach(option =>
      expect(previewOf(option)).toHaveClass(visualizationStyles.standAlonePosition)
    );
  });
});
