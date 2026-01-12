import '@testing-library/jest-dom/extend-expect';

import {EditMotifAreaInputView} from 'editor/views/inputs/EditMotifAreaInputView';
import {EditMotifAreaDialogView} from 'editor/views/EditMotifAreaDialogView';

import styles from 'editor/views/inputs/EditMotifAreaInputView.module.css';

import {useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';
import userEvent from '@testing-library/user-event';

jest.mock('editor/views/EditMotifAreaDialogView');

describe('EditMotifAreaInputView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeXhr();

  useFakeTranslations({
    'pageflow_scrolled.editor.edit_motif_area_input.select': 'Select motif area',
    'pageflow_scrolled.editor.edit_motif_area_input.edit': 'Edit motif area',
    'pageflow_scrolled.editor.edit_motif_area_input.ignore_image': 'Ignore for this image',
    'pageflow_scrolled.editor.edit_motif_area_input.ignore_video': 'Ignore for this video',
    'pageflow_scrolled.editor.edit_motif_area_input.warn': 'No motif area selected'
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

  it('renders infoText when provided', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImage: 10}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration,
      infoText: 'Some helpful information'
    });

    const {getByText} = renderBackboneView(view);

    expect(getByText('Some helpful information')).toBeInTheDocument();
  });

  it('does not render ignore button by default', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImage: 10}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration
    });

    const {queryByRole} = renderBackboneView(view);

    expect(queryByRole('button', {name: 'Ignore for this image'})).not.toBeInTheDocument();
  });

  it('renders primary button when showIgnoreOption is true', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImage: 10}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration,
      showIgnoreOption: true
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button', {name: 'Select motif area'})).toHaveClass('primary_icon_button');
  });

  it('renders ignore button for image when showIgnoreOption is true', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImage: 10}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration,
      showIgnoreOption: true
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button', {name: 'Ignore for this image'})).toBeInTheDocument();
  });

  it('renders ignore button for video when showIgnoreOption is true and backdropType is video', () => {
    const entry = createEntry({
      videoFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropType: 'video', backdropVideo: 10}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration,
      showIgnoreOption: true
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button', {name: 'Ignore for this video'})).toBeInTheDocument();
  });

  it('updates ignore button text when backdropType changes', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      videoFiles: [{id: 200, perma_id: 20}],
      sections: [{id: 1, configuration: {backdropImage: 10, backdropVideo: 20}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration,
      showIgnoreOption: true
    });

    const {getByRole, queryByRole} = renderBackboneView(view);

    expect(getByRole('button', {name: 'Ignore for this image'})).toBeInTheDocument();

    entry.sections.get(1).configuration.set('backdropType', 'video');

    expect(queryByRole('button', {name: 'Ignore for this image'})).not.toBeInTheDocument();
    expect(getByRole('button', {name: 'Ignore for this video'})).toBeInTheDocument();
  });

  it('renders x icon in ignore button', () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImage: 10}}]
    });

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration,
      showIgnoreOption: true
    });

    renderBackboneView(view);

    expect(view.el.querySelector(`.${styles.ignoreIcon}`)).toBeInTheDocument();
  });

  it('sets ignoreMissingMotif on file configuration when clicking ignore button', async () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {backdropImage: 10}}]
    });
    const file = entry.getFileCollection('image_files').get(100);

    const view = new EditMotifAreaInputView({
      model: entry.sections.get(1).configuration,
      showIgnoreOption: true
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button', {name: 'Ignore for this image'}));

    expect(file.configuration.get('ignoreMissingMotif')).toBe(true);
  });

  describe('with onlyShowWhenMissing option', () => {
    it('has hidden class when motif area is present', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10, backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}}}]
      });

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        onlyShowWhenMissing: true
      });

      renderBackboneView(view);

      expect(view.el).toHaveClass(styles.hidden);
    });

    it('has hidden class when file has ignoreMissingMotif flag', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });
      const file = entry.getFileCollection('image_files').get(100);
      file.configuration.set('ignoreMissingMotif', true);

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        onlyShowWhenMissing: true
      });

      renderBackboneView(view);

      expect(view.el).toHaveClass(styles.hidden);
    });

    it('has hidden class when file is missing', () => {
      const entry = createEntry({
        sections: [{id: 1}]
      });

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        onlyShowWhenMissing: true
      });

      renderBackboneView(view);

      expect(view.el).toHaveClass(styles.hidden);
    });

    it('does not have hidden class when motif area is missing and file does not have ignoreMissingMotif flag', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        onlyShowWhenMissing: true
      });

      renderBackboneView(view);

      expect(view.el).not.toHaveClass(styles.hidden);
    });

    it('adds hidden class after clicking ignore button', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        onlyShowWhenMissing: true,
        showIgnoreOption: true
      });

      const user = userEvent.setup();
      const {getByRole} = renderBackboneView(view);

      await user.click(getByRole('button', {name: 'Ignore for this image'}));

      expect(view.el).toHaveClass(styles.hidden);
    });

    it('adds hidden class when motif area is set', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        onlyShowWhenMissing: true
      });

      renderBackboneView(view);

      expect(view.el).not.toHaveClass(styles.hidden);

      entry.sections.get(1).configuration.set(
        'backdropImageMotifArea',
        {left: 0, top: 0, width: 50, height: 50}
      );

      expect(view.el).toHaveClass(styles.hidden);
    });

    it('adds hidden class when ignoreMissingMotif is set externally on file', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });
      const file = entry.getFileCollection('image_files').get(100);

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        onlyShowWhenMissing: true
      });

      renderBackboneView(view);

      expect(view.el).not.toHaveClass(styles.hidden);

      file.configuration.set('ignoreMissingMotif', true);

      expect(view.el).toHaveClass(styles.hidden);
    });
  });

  describe('with required option', () => {
    it('does not add warning class to button by default', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('button')).not.toHaveClass(styles.warning);
    });

    it('adds warning class to button when file is present but motif area is missing', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        required: true
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('button')).toHaveClass(styles.warning);
    });

    it('shows missing label when file is present but motif area is missing', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        required: true
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('button', {name: 'No motif area selected'})).toBeInTheDocument();
    });

    it('removes warning class when motif area is present', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10, backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}}}]
      });

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        required: true
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('button')).not.toHaveClass(styles.warning);
    });

    it('adds warning class even when ignoreMissingMotif flag is set', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });
      const file = entry.getFileCollection('image_files').get(100);
      file.configuration.set('ignoreMissingMotif', true);

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        required: true
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('button')).toHaveClass(styles.warning);
    });

    it('does not add warning class when file is missing', () => {
      const entry = createEntry({
        sections: [{id: 1}]
      });

      const view = new EditMotifAreaInputView({
        model: entry.sections.get(1).configuration,
        required: true
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('button')).not.toHaveClass(styles.warning);
    });
  });
});
