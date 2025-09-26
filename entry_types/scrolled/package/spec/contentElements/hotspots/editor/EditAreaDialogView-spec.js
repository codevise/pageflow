import {EditAreaDialogView} from 'contentElements/hotspots/editor/EditAreaDialogView';
import styles from 'contentElements/hotspots/editor/EditAreaDialogView/DraggableEditorView.module.css';

import Backbone from 'backbone';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {fireEvent} from '@testing-library/dom';
import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';
import {factories} from 'support';

describe('EditAreaDialogView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog.tabs.default': 'Default',
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog.tabs.portrait': 'Portrait',
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog.hotspots_image': 'Hotspots image',
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog.modes.rect': 'Rect',
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog.modes.polygon': 'Polygon',
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog.indicator_title': 'Drag to position indicator',
    'pageflow_scrolled.editor.content_elements.hotspots.edit_area_dialog.save': 'Save'
  });

  it('renders default image', () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const model = new Backbone.Model();
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile
    });

    const {getByRole} = render(view);

    expect(getByRole('img', {name: 'Hotspots image'})).toHaveAttribute('src', 'some/image.webp');
  });

  it('renders landscape/portrait tabs if both files are present', () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const portraitImageFile = factories.imageFile({
      url: 'some/portrait.webp'
    });
    const model = new Backbone.Model();
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile,
      portraitFile: portraitImageFile
    });

    const {queryByText} = render(view);

    expect(queryByText('Default')).not.toBeNull();
    expect(queryByText('Portrait')).not.toBeNull();
  });

  it('does not render tabs if portrait file is missing', () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const model = new Backbone.Model();
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile
    });

    const {queryByText} = render(view);

    expect(queryByText('Default')).toBeNull();
    expect(queryByText('Portrait')).toBeNull();
  });

  it('renders portrait image on portrait tab', async () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const portraitImageFile = factories.imageFile({
      url: 'some/portrait.webp'
    });
    const model = new Backbone.Model();
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile,
      portraitFile: portraitImageFile
    });

    const user = userEvent.setup();
    const {getByText, getByRole} = render(view);
    await user.click(getByText('Portrait'));

    expect(getByRole('img', {name: 'Hotspots image'})).toHaveAttribute('src', 'some/portrait.webp');
  });

  it('supports default tab', () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const portraitImageFile = factories.imageFile({
      url: 'some/portrait.webp'
    });
    const model = new Backbone.Model();
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile,
      portraitFile: portraitImageFile,
      defaultTab: 'portrait'
    });

    const {getByRole} = render(view);

    expect(getByRole('img', {name: 'Hotspots image'})).toHaveAttribute('src', 'some/portrait.webp');
  });

  it('renders rect area', () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const model = new Backbone.Model({
      outline: [[10, 15], [20, 15], [20, 50], [10, 50]],
      mode: 'rect',
      indicatorPosition: [15, 20]
    });
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile
    });

    const {getByRole} = render(view);

    expect(getByRole('button', {name: 'Rect'})).toHaveAttribute('aria-pressed', 'true');
    expect(
      queryHandleByCoordinates(view.el, {left: 10, top: 15})
    ).not.toBeNull();
  });

  it('renders polygon area', () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const model = new Backbone.Model({
      outline: [[10, 15], [25, 15], [25, 50]],
      mode: 'polygon',
      indicatorPosition: [20, 20]
    });
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile
    });

    const {getByRole} = render(view);

    expect(getByRole('button', {name: 'Polygon'})).toHaveAttribute('aria-pressed', 'true');
    expect(
      queryHandleByCoordinates(view.el, {left: 10, top: 15})
    ).not.toBeNull();
  });

  it('renders portrait area', async () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const portraitImageFile = factories.imageFile({
      url: 'some/portrait.webp'
    });
    const model = new Backbone.Model({
      outline: [[10, 15], [20, 15], [20, 50], [10, 50]],
      mode: 'rect',
      indicatorPosition: [15, 20],
      portraitOutline: [[5, 15], [25, 15], [25, 50]],
      portraitMode: 'polygon',
      portraitIndicatorPosition: [20, 20]
    });
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile,
      portraitFile: portraitImageFile
    });

    const user = userEvent.setup();
    const {getByText, getByRole} = render(view);
    await user.click(getByText('Portrait'));

    expect(getByRole('button', {name: 'Polygon'})).toHaveAttribute('aria-pressed', 'true');
    expect(
      queryHandleByCoordinates(view.el, {left: 5, top: 15})
    ).not.toBeNull();
  });

  it('allows moving points', async () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const model = new Backbone.Model({
      outline: [[10, 15], [25, 15], [25, 50]],
      mode: 'polygon',
      indicatorPosition: [20, 20]
    });
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);

    const overlay = getOverlay(view.el);
    overlay.getBoundingClientRect = function() {
      return {top: 0, left: 0, width: 100, height: 100};
    }
    const point = queryHandleByCoordinates(view.el, {left: 10, top: 15});
    fireEvent.mouseDown(point, {clientX: 100, clientY: 100});
    fireEvent.mouseMove(point, {clientX: 50, clientY: 10});
    fireEvent.mouseUp(point, {clientX: 50, clientY: 10});

    await user.click(getByRole('button', {name: 'Save'}));

    expect(model.get('outline')).toEqual([[50, 10], [25, 15], [25, 50]]);
  });

  it('allows switching mode', async () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const model = new Backbone.Model({
      outline: [[10, 15], [25, 15], [25, 50]],
      mode: 'polygon',
      indicatorPosition: [20, 20]
    });
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);

    await user.click(getByRole('button', {name: 'Rect'}));
    await user.click(getByRole('button', {name: 'Save'}));

    expect(model.get('mode')).toEqual('rect');
    expect(model.get('outline')).toEqual([[10, 15], [25, 15], [25, 50], [10, 50]]);
  });

  it('allows moving indicator', async () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const model = new Backbone.Model({
      outline: [[10, 15], [25, 15], [25, 50]],
      mode: 'polygon',
      indicatorPosition: [20, 20]
    });
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile
    });

    const user = userEvent.setup();
    const {getByRole, getByTitle} = render(view);

    const overlay = getOverlay(view.el);
    overlay.getBoundingClientRect = function() {
      return {top: 0, left: 0, width: 100, height: 100};
    }
    const indicator = getByTitle('Drag to position indicator');
    fireEvent.mouseDown(indicator, {clientX: 20, clientY: 20});
    fireEvent.mouseMove(indicator, {clientX: 10, clientY: 15});
    fireEvent.mouseUp(indicator, {clientX: 10, clientY: 15});

    await user.click(getByRole('button', {name: 'Save'}));

    expect(model.get('indicatorPosition')).toEqual([10, 15]);
  });

  it('allows changing portrait settings', async () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const portraitImageFile = factories.imageFile({
      url: 'some/portrait.webp'
    });
    const model = new Backbone.Model({
      portraitOutline: [[10, 15], [25, 15], [25, 50]],
      portraitMode: 'polygon',
      portraitIndicatorPosition: [20, 20]
    });
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile,
      portraitFile: portraitImageFile
    });

    const user = userEvent.setup();
    const {getByRole, getByText} = render(view);

    await user.click(getByText('Portrait'));
    await user.click(getByRole('button', {name: 'Rect'}));
    await user.click(getByRole('button', {name: 'Save'}));

    expect(model.get('portraitMode')).toEqual('rect');
    expect(model.get('portraitOutline')).toEqual([[10, 15], [25, 15], [25, 50], [10, 50]]);
  });

  it('calls onSave', async () => {
    const imageFile = factories.imageFile({
      url: 'some/image.webp'
    });
    const model = new Backbone.Model();
    const callback = jest.fn();
    const view = new EditAreaDialogView({
      model: model,
      file: imageFile,
      onSave: callback
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);

    await user.click(getByRole('button', {name: 'Save'}));

    expect(callback).toHaveBeenCalled();
  });
});

function getOverlay(el) {
  return el.querySelector(`.${styles.overlay}`);
}

function queryHandleByCoordinates(el, {left, top}) {
  return el.querySelector(`.${styles.handle}[style*="left: ${left}%"][style*="top: ${top}%"]`);
}
