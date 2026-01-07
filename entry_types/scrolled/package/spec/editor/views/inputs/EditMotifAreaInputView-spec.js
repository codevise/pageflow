import '@testing-library/jest-dom/extend-expect';

import {EditMotifAreaInputView} from 'editor/views/inputs/EditMotifAreaInputView';
import {EditMotifAreaDialogView} from 'editor/views/EditMotifAreaDialogView';

import styles from 'editor/views/inputs/EditMotifAreaInputView.module.css';

import {useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';
import userEvent from '@testing-library/user-event';

jest.mock('editor/views/EditMotifAreaDialogView');

describe('EditMotifAreaInputView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.edit_motif_area_input.select': 'Select motif area',
    'pageflow_scrolled.editor.edit_motif_area_input.edit': 'Edit motif area'
  });

  it('renders select button when no motif area defined', () => {
    const entry = createEntry({
      sections: [{id: 1}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button', {name: 'Select motif area'})).toBeInTheDocument();
  });

  it('renders edit button when motif area is present', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImage: 10, backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button', {name: 'Edit motif area'})).toBeInTheDocument();
  });

  it('renders select button when motif area is present but file is missing', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button', {name: 'Select motif area'})).toBeInTheDocument();
  });

  it('opens dialog with file looked up via getReference', async () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImage: 10}}]
    });
    const file = entry.getFileCollection('image_files').get(100);

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button'));

    expect(EditMotifAreaDialogView.show).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyName: 'backdropImage',
        file
      })
    );
  });

  it('looks up video file when backdropType is video', async () => {
    const entry = createEntry({
      videoFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropType: 'video', backdropVideo: 10}}]
    });
    const file = entry.getFileCollection('video_files').get(100);

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button'));

    expect(EditMotifAreaDialogView.show).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyName: 'backdropVideo',
        file
      })
    );
  });

  it('looks up mobile image file on portrait tab', async () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImageMobile: 10}}]
    });
    const file = entry.getFileCollection('image_files').get(100);

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration,
      portrait: true
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button'));

    expect(EditMotifAreaDialogView.show).toHaveBeenCalledWith(
      expect.objectContaining({
        propertyName: 'backdropImageMobile',
        file
      })
    );
  });

  it('updates button text when motif area property changes', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImage: 10}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button', {name: 'Select motif area'})).toBeInTheDocument();

    entry.sections.get(1).configuration.set(
      'backdropImageMotifArea',
      {left: 0, top: 0, width: 50, height: 50}
    );

    expect(getByRole('button', {name: 'Edit motif area'})).toBeInTheDocument();
  });

  it('shows check icon when motif area is present', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImage: 10, backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration
    });

    renderBackboneView(view);

    expect(view.el.querySelector(`.${styles.checkIcon}`)).toBeVisible();
  });

  it('hides check icon when no motif area defined', () => {
    const entry = createEntry({
      sections: [{id: 1}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration
    });

    renderBackboneView(view);

    expect(view.el.querySelector(`.${styles.checkIcon}`)).not.toBeVisible();
  });

  it('disables button when disabled option is true', () => {
    const entry = createEntry({
      sections: [{id: 1}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration,
      disabled: true
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button')).toBeDisabled();
  });

  it('disables button when file is not present', () => {
    const entry = createEntry({
      sections: [{id: 1}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button')).toBeDisabled();
  });
});
