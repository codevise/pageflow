import {EditSectionPaddingsView} from 'editor/views/EditSectionPaddingsView';
import {EditMotifAreaDialogView} from 'editor/views/EditMotifAreaDialogView';

import {useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';
import '@testing-library/jest-dom/extend-expect';
import 'support/toBeVisibleViaBinding';
import userEvent from '@testing-library/user-event';

jest.mock('editor/views/EditMotifAreaDialogView');

describe('EditSectionPaddingsView', () => {
  useFakeXhr();
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.section_padding_visualization.intersecting_auto': 'Auto',
    'pageflow_scrolled.editor.section_padding_visualization.intersecting_manual': 'Manual',
    'pageflow_scrolled.editor.section_padding_visualization.side_by_side': 'SideBySide',
    'pageflow_scrolled.editor.section_padding_visualization.top_padding': 'TopPadding',
    'pageflow_scrolled.editor.section_padding_visualization.bottom_padding': 'Bottom',
    'pageflow_scrolled.editor.edit_section_paddings.tabs.portrait': 'Portrait',
    'pageflow_scrolled.editor.edit_section_paddings.attributes.samePortraitPaddings.label': 'Same as landscape',
    'pageflow_scrolled.editor.edit_motif_area_input.select': 'Select motif area',
    'pageflow_scrolled.editor.edit_motif_area_input.edit': 'Edit motif area',
    'pageflow_scrolled.editor.edit_section_paddings.attributes.exposeMotifArea.values.true': 'Auto mode',
    'pageflow_scrolled.editor.edit_section_paddings.attributes.exposeMotifArea.values.false': 'Manual mode'
  });

  it('shows auto visualization when exposeMotifArea is true', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {exposeMotifArea: true}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('img', {name: 'Auto'})).toBeVisibleViaBinding();
  });

  it('hides auto visualization when exposeMotifArea is false', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {exposeMotifArea: false}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('img', {name: 'Auto'})).not.toBeVisibleViaBinding();
  });

  it('shows manual visualization when exposeMotifArea is false', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {exposeMotifArea: false}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('img', {name: 'Manual'})).toBeVisibleViaBinding();
  });

  it('hides manual visualization when exposeMotifArea is true', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {exposeMotifArea: true}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('img', {name: 'Manual'})).not.toBeVisibleViaBinding();
  });

  it('shows sideBySide visualization when exposeMotifArea is true', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {exposeMotifArea: true}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('img', {name: 'SideBySide'})).toBeVisibleViaBinding();
  });

  it('hides sideBySide visualization when exposeMotifArea is false', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {exposeMotifArea: false}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('img', {name: 'SideBySide'})).not.toBeVisibleViaBinding();
  });

  it.each(['center', 'centerRagged'])
  ('hides sideBySide visualization when layout is %s', (layout) => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {exposeMotifArea: true, layout}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('img', {name: 'SideBySide'})).not.toBeVisibleViaBinding();
  });

  it.each(['center', 'centerRagged'])
  ('hides portrait sideBySide visualization when layout is %s', async (layout) => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {portraitExposeMotifArea: true, layout, backdropImageMobile: 10}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const user = userEvent.setup();
    const {getByRole, getByText} = renderBackboneView(view);

    await user.click(getByText('Portrait'));

    expect(getByRole('img', {name: 'SideBySide'})).not.toBeVisibleViaBinding();
  });

  it('shows motif area button when exposeMotifArea is true', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {exposeMotifArea: true}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button', {name: 'Select motif area'})).toBeVisibleViaBinding();
  });

  it('hides motif area button when exposeMotifArea is false', () => {
    const entry = createEntry({
      sections: [{id: 1, configuration: {exposeMotifArea: false}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const {getByRole} = renderBackboneView(view);

    expect(getByRole('button', {name: 'Select motif area'})).not.toBeVisibleViaBinding();
  });

  it('opens dialog with backdropImage propertyName for image backdrop', async () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {exposeMotifArea: true, backdropType: 'image', backdropImage: 10}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button', {name: 'Select motif area'}));

    expect(EditMotifAreaDialogView.show).toHaveBeenCalledWith(
      expect.objectContaining({propertyName: 'backdropImage'})
    );
  });

  it('opens dialog with backdropVideo propertyName for video backdrop', async () => {
    const entry = createEntry({
      videoFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {exposeMotifArea: true, backdropType: 'video', backdropVideo: 10}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button', {name: 'Select motif area'}));

    expect(EditMotifAreaDialogView.show).toHaveBeenCalledWith(
      expect.objectContaining({propertyName: 'backdropVideo'})
    );
  });

  it('opens dialog with backdropImageMobile propertyName on portrait tab', async () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {portraitExposeMotifArea: true, backdropType: 'image', backdropImageMobile: 10}}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const user = userEvent.setup();
    const {getByRole, getByText} = renderBackboneView(view);

    await user.click(getByText('Portrait'));
    await user.click(getByRole('button', {name: 'Select motif area'}));

    expect(EditMotifAreaDialogView.show).toHaveBeenCalledWith(
      expect.objectContaining({propertyName: 'backdropImageMobile'})
    );
  });

  it('does not disable edit motif area button on portrait tab when same portrait paddings is enabled', async () => {
    const entry = createEntry({
      imageFiles: [{id: 100, perma_id: 10}],
      sections: [{id: 1, configuration: {
        portraitExposeMotifArea: true,
        backdropImageMobile: 10,
        customPortraitPaddings: false
      }}]
    });

    const view = new EditSectionPaddingsView({
      model: entry.sections.get(1),
      entry
    });

    const user = userEvent.setup();
    const {getByRole, getByText} = renderBackboneView(view);

    await user.click(getByText('Portrait'));

    expect(getByRole('button', {name: 'Select motif area'})).not.toBeDisabled();
  });

  describe('with auto mode but no motif area defined', () => {
    it('disables sideBySide visualization', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {exposeMotifArea: true}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('img', {name: 'SideBySide'}).closest('.input').classList).toContain('input-disabled');
    });

    it('disables paddingTop slider', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {exposeMotifArea: true}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      expect(view.el.querySelector('.slider_input').classList).toContain('disabled');
    });
  });

  describe('with manual mode and no motif area defined', () => {
    it('does not disable paddingTop slider', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {exposeMotifArea: false}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      expect(view.el.querySelector('.slider_input').classList).not.toContain('disabled');
    });
  });

  describe('with auto mode and motif area defined', () => {
    it('does not disable sideBySide visualization', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {
          exposeMotifArea: true,
          backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}
        }}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('img', {name: 'SideBySide'}).closest('.input').classList).not.toContain('input-disabled');
    });

    it('does not disable paddingTop slider', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {
          exposeMotifArea: true,
          backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}
        }}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      expect(view.el.querySelector('.slider_input').classList).not.toContain('disabled');
    });

    it('does not disable paddingTop slider for video backdrop with motif area', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {
          exposeMotifArea: true,
          backdropType: 'video',
          backdropVideoMotifArea: {left: 0, top: 0, width: 50, height: 50}
        }}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      expect(view.el.querySelector('.slider_input').classList).not.toContain('disabled');
    });
  });

  describe('portrait tab with same paddings checkbox checked', () => {
    it('shows non-portrait exposeMotifArea value in radio button', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {
          exposeMotifArea: true,
          portraitExposeMotifArea: false,
          customPortraitPaddings: false,
          backdropImageMobile: 10
        }}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByRole, getByText} = renderBackboneView(view);

      await user.click(getByText('Portrait'));

      expect(getByRole('radio', {name: 'Auto mode'})).toBeChecked();
    });

    it('disables portrait paddingTop slider', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {
          customPortraitPaddings: false,
          backdropImageMobile: 10
        }}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByText} = renderBackboneView(view);

      await user.click(getByText('Portrait'));

      const sliders = view.el.querySelectorAll('.slider_input');
      expect(sliders[0].classList).toContain('disabled');
    });

    it('switches to portrait auto mode and reveals elements when unchecking checkbox', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {
          exposeMotifArea: false,
          portraitExposeMotifArea: true,
          customPortraitPaddings: false,
          backdropImageMobile: 10
        }}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByRole, getByText} = renderBackboneView(view);

      await user.click(getByText('Portrait'));

      // Initially shows manual mode (from non-portrait exposeMotifArea)
      expect(getByRole('radio', {name: 'Manual mode'})).toBeChecked();
      expect(getByRole('img', {name: 'SideBySide'})).not.toBeVisibleViaBinding();
      expect(getByRole('button', {name: 'Select motif area'})).not.toBeVisibleViaBinding();

      await user.click(getByRole('checkbox', {name: 'Same as landscape'}));

      // Now shows auto mode (from portrait exposeMotifArea)
      expect(getByRole('radio', {name: 'Auto mode'})).toBeChecked();
      expect(getByRole('img', {name: 'SideBySide'})).toBeVisibleViaBinding();
      expect(getByRole('button', {name: 'Select motif area'})).toBeVisibleViaBinding();
    });
  });

  describe('with backdrop type color', () => {
    it('does not disable paddingTop slider even with exposeMotifArea true', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color', exposeMotifArea: true}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      expect(view.el.querySelector('.slider_input').classList).not.toContain('disabled');
    });

    it('hides intersecting auto visualization', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('img', {name: 'Auto'})).not.toBeVisibleViaBinding();
    });

    it('hides intersecting manual visualization', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('img', {name: 'Manual'})).not.toBeVisibleViaBinding();
    });

    it('shows topPadding visualization instead', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('img', {name: 'TopPadding'})).toBeVisibleViaBinding();
    });

    it('hides motif area button', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color', exposeMotifArea: true}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('button', {name: 'Select motif area'})).not.toBeVisibleViaBinding();
    });
  });

  describe('portrait tab visibility', () => {
    it('hides portrait tab when backdropType is color', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {queryByRole} = renderBackboneView(view);

      expect(queryByRole('tab', {name: 'Portrait'})).not.toBeInTheDocument();
    });

    it('hides portrait tab when no portrait image is present', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'image'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {queryByRole} = renderBackboneView(view);

      expect(queryByRole('tab', {name: 'Portrait'})).not.toBeInTheDocument();
    });

    it('hides portrait tab when no portrait video is present', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'video'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {queryByRole} = renderBackboneView(view);

      expect(queryByRole('tab', {name: 'Portrait'})).not.toBeInTheDocument();
    });

    it('shows portrait tab when portrait image is present', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImageMobile: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('tab', {name: 'Portrait'})).toBeInTheDocument();
    });

    it('shows portrait tab when portrait video is present', () => {
      const entry = createEntry({
        videoFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropType: 'video', backdropVideoMobile: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('tab', {name: 'Portrait'})).toBeInTheDocument();
    });
  });

  describe('scrollToSection events', () => {
    it('triggers scrollToSection when starting to drag paddingTop slider', () => {
      const entry = createEntry({
        sections: [{id: 1}]
      });
      const listener = jest.fn();
      entry.on('scrollToSection', listener);

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      view.$el.find('.slider_input').eq(0).trigger('slidestart');

      expect(listener).toHaveBeenCalledWith(entry.sections.get(1), {ifNeeded: true});
    });

    it('triggers scrollToSection to end when starting to drag paddingBottom slider', () => {
      const entry = createEntry({
        sections: [{id: 1}]
      });
      const listener = jest.fn();
      entry.on('scrollToSection', listener);

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      view.$el.find('.slider_input').eq(1).trigger('slidestart');

      expect(listener).toHaveBeenCalledWith(entry.sections.get(1), {align: 'nearEnd', ifNeeded: true});
    });

    it('triggers scrollToSection when starting to drag portraitPaddingTop slider', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImageMobile: 10, customPortraitPaddings: true}}]
      });
      const listener = jest.fn();
      entry.on('scrollToSection', listener);

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByRole} = renderBackboneView(view);

      await user.click(getByRole('tab', {name: 'Portrait'}));

      view.$el.find('.slider_input').eq(0).trigger('slidestart');

      expect(listener).toHaveBeenCalledWith(entry.sections.get(1), {ifNeeded: true});
    });

    it('triggers scrollToSection to end when starting to drag portraitPaddingBottom slider', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImageMobile: 10, customPortraitPaddings: true}}]
      });
      const listener = jest.fn();
      entry.on('scrollToSection', listener);

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByRole} = renderBackboneView(view);

      await user.click(getByRole('tab', {name: 'Portrait'}));

      view.$el.find('.slider_input').eq(1).trigger('slidestart');

      expect(listener).toHaveBeenCalledWith(entry.sections.get(1), {align: 'nearEnd', ifNeeded: true});
    });
  });
});
