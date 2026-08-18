import Backbone from 'backbone';
import userEvent from '@testing-library/user-event';
import {within} from '@testing-library/dom';
import '@testing-library/jest-dom/extend-expect';

import {renderReactBasedBackboneView as render} from 'pageflow-scrolled/testHelpers';

import {
  ScrollRangeSelectInputView
} from 'editor/views/inputs/ScrollRangeSelectInputView';

import {fakeBoundingClientRectsByClassName} from 'support/fakeBoundingClientRects';

import visualizationStyles from 'editor/views/inputs/visualizations/ContentElementVisualization.module.css';

describe('ScrollRangeSelectInputView', () => {
  afterEach(() => jest.restoreAllMocks());

  function renderInputView({position = 'inline'} = {}) {
    const model = new Backbone.Model({position, scrollRange: 'cover'});

    const inputView = new ScrollRangeSelectInputView({
      model,
      propertyName: 'scrollRange',
      values: ['cover', 'inFocus'],
      texts: ['While visible', 'While in focus'],
      position: () => model.get('position')
    });

    return {model, ...render(inputView)};
  }

  function previewOf(option) {
    return option.querySelector(`.${visualizationStyles.visualization}`);
  }

  function viewportCenterOf(option) {
    return option.querySelector(`.${visualizationStyles.viewportCenter}`);
  }

  it('illustrates the currently selected position in each option', async () => {
    const user = userEvent.setup();
    const {getByRole, getAllByRole} = renderInputView({position: 'standAlone'});

    await user.click(getByRole('button', {name: 'While visible'}));

    getAllByRole('option').forEach(option =>
      expect(previewOf(option)).toHaveClass(visualizationStyles.standAlonePosition)
    );
  });

  it('leaves room to scroll and narrows the element in each option', async () => {
    const user = userEvent.setup();
    const {getByRole, getAllByRole} = renderInputView();

    await user.click(getByRole('button', {name: 'While visible'}));

    getAllByRole('option').forEach(option =>
      expect(previewOf(option)).toHaveClass(visualizationStyles.narrowBlock,
                                            visualizationStyles.scrollRoom)
    );
  });

  it('marks the viewport center in the option that is measured against it', async () => {
    const user = userEvent.setup();
    const {getByRole} = renderInputView({position: 'inline'});

    await user.click(getByRole('button', {name: 'While visible'}));

    expect(viewportCenterOf(getByRole('option', {name: 'While in focus'}))).not.toBeNull();
    expect(viewportCenterOf(getByRole('option', {name: 'While visible'}))).toBeNull();
  });

  it('does not mark the viewport center for positions that pin the element', async () => {
    const user = userEvent.setup();
    const {getByRole} = renderInputView({position: 'standAlone'});

    await user.click(getByRole('button', {name: 'While visible'}));

    expect(viewportCenterOf(getByRole('option', {name: 'While in focus'}))).toBeNull();
  });

  it('displays progress of the range of each option inside the element', async () => {
    fakeBoundingClientRectsByClassName({
      [visualizationStyles.visualization]: {top: 0, height: 100},
      [visualizationStyles.block]: {top: 60, height: 20}
    });
    const user = userEvent.setup();
    const {getByRole} = renderInputView();

    await user.click(getByRole('button', {name: 'While visible'}));

    expect(within(getByRole('option', {name: 'While visible'})).getByText('33%'))
      .not.toBeNull();
    expect(within(getByRole('option', {name: 'While in focus'})).getByText('0%'))
      .not.toBeNull();
  });

  it('illustrates the position the element has when opening the dropdown', async () => {
    const user = userEvent.setup();
    const {model, getByRole, getAllByRole} = renderInputView({position: 'inline'});

    model.set('position', 'standAlone');
    await user.click(getByRole('button', {name: 'While visible'}));

    getAllByRole('option').forEach(option =>
      expect(previewOf(option)).toHaveClass(visualizationStyles.standAlonePosition)
    );
  });
});
