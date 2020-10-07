import {EditMotifAreaDialogView} from 'editor/views/EditMotifAreaDialogView';

import jQuery from 'jquery';
import Backbone from 'backbone';

import {getByText, fireEvent} from '@testing-library/dom';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {factories} from 'support';

describe('EditMotifAreaDialogView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.edit_motif_area.save': 'Save',
    'pageflow_scrolled.editor.edit_motif_area.reset': 'Reset'
  });

  it('reads motif area from model using derived property name', () => {
    const model = new Backbone.Model({
      imageMotifArea: {
        left: 5, top: 10, width: 25, height: 50
      }
    });
    const file = factories.imageFile({
      width: 200,
      height: 100
    });

    const view = new EditMotifAreaDialogView({
      model,
      file,
      propertyName: 'image'
    });

    const imgAreaSelect = fakeImgAreaSelect();

    view.render();
    view.onShow();

    expect(imgAreaSelect.getSelection()).toEqual({x1: 10, y1: 10, x2: 60, y2: 60});
  });

  it('allows setting motif area property in model and default motif area in file', () => {
    const model = new Backbone.Model();
    const file = factories.imageFile({width: 200, height: 100});

    const view = new EditMotifAreaDialogView({
      model,
      file,
      propertyName: 'image'
    });

    const imgAreaSelect = fakeImgAreaSelect();

    view.render();
    view.onShow();

    imgAreaSelect.select({x1: 10.01, y1: 10.02, x2: 60, y2: 60});
    fireEvent.click(getByText(view.el, 'Save'));

    expect(model.get('imageMotifArea')).toEqual({
      left: 5,
      top: 10,
      width: 25,
      height: 50
    });
    expect(file.configuration.get('motifArea')).toEqual({
      left: 5,
      top: 10,
      width: 25,
      height: 50
    });
  });

  it('allows resetting the motif area property', () => {
    const model = new Backbone.Model({
      imageMotifArea: {
        left: 5, top: 10, width: 25, height: 50
      }
    });
    const file = factories.imageFile({
      width: 200,
      height: 100,
      configuration: {
        motifArea: {
          left: 5, top: 10, width: 25, height: 50
        }
      }
    });

    const view = new EditMotifAreaDialogView({
      model,
      file,
      propertyName: 'image'
    });

    view.render();
    view.onShow();

    fireEvent.click(getByText(view.el, 'Reset'));
    fireEvent.click(getByText(view.el, 'Save'));

    expect(model.get('imageMotifArea')).toBe(null);
    expect(file.configuration.get('motifArea')).toBe(null);
  });
});

function fakeImgAreaSelect() {
  let onSelectEnd;
  let currentSelection;

  jest.spyOn(jQuery.fn, 'imgAreaSelect').mockImplementation(options => {
    if (options.x1) {
      currentSelection = {
        x1: options.x1,
        y1: options.y1,
        x2: options.x2,
        y2: options.y2
      };
    }

    if (options.onSelectEnd) {
      onSelectEnd = options.onSelectEnd;
    }
  });

  return {
    getSelection() {
      return currentSelection;
    },

    select(selection) {
      onSelectEnd(null, selection);
    }
  }
}
