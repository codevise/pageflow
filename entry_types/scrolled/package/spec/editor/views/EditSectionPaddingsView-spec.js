import userEvent from '@testing-library/user-event';

import {EditSectionPaddingsView} from 'editor/views/EditSectionPaddingsView';

import {useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';
import '@testing-library/jest-dom/extend-expect';
import 'support/toBeVisibleViaBinding';

describe('EditSectionPaddingsView', () => {
  useFakeXhr();
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.edit_section_paddings.tabs.sectionPaddings': 'Landscape',
    'pageflow_scrolled.editor.edit_section_paddings.tabs.portrait': 'Portrait',
    'pageflow_scrolled.editor.edit_section_paddings.attributes.exposeMotifArea.values.true': 'Auto mode',
    'pageflow_scrolled.editor.edit_section_paddings.attributes.exposeMotifArea.values.false': 'Manual mode',
    'pageflow_scrolled.editor.edit_section_paddings.attributes.samePortraitPaddings.label': 'Same as landscape',
    'pageflow_scrolled.editor.edit_motif_area_input.select': 'Select motif area',
    'pageflow_scrolled.editor.edit_motif_area_input.edit': 'Edit motif area',
    'pageflow_scrolled.editor.edit_motif_area_input.warn': 'No motif area selected',
    'pageflow_scrolled.editor.edit_motif_area_input.ignore_image': 'Ignore image',
    'pageflow_scrolled.editor.section_padding_visualization.intersecting_auto': 'Auto',
    'pageflow_scrolled.editor.section_padding_visualization.intersecting_manual': 'Manual',
    'pageflow_scrolled.editor.section_padding_visualization.side_by_side': 'SideBySide',
    'pageflow_scrolled.editor.section_padding_visualization.top_padding': 'TopPadding',
    'pageflow_scrolled.editor.section_padding_visualization.bottom_padding': 'Bottom'
  });

  describe('with backdrop type color', () => {
    it('only shows topPadding and bottomPadding visualizations', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole, queryByRole} = renderBackboneView(view);

      expect(getByRole('img', {name: 'TopPadding'})).toBeInTheDocument();
      expect(getByRole('img', {name: 'Bottom'})).toBeInTheDocument();
      expect(queryByRole('img', {name: 'Auto'})).not.toBeInTheDocument();
      expect(queryByRole('img', {name: 'Manual'})).not.toBeInTheDocument();
      expect(queryByRole('img', {name: 'SideBySide'})).not.toBeInTheDocument();
    });

    it('does not disable paddingTop slider', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      const sliders = view.el.querySelectorAll('.slider_input');
      expect(sliders[0].classList).not.toContain('disabled');
    });

    it('does not disable paddingBottom slider', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      const sliders = view.el.querySelectorAll('.slider_input');
      expect(sliders[1].classList).not.toContain('disabled');
    });

    it('does not render exposeMotifArea radio input', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {queryByRole} = renderBackboneView(view);

      expect(queryByRole('radio', {name: 'Auto mode'})).not.toBeInTheDocument();
    });

    it('does not render edit motif area button', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {queryByRole} = renderBackboneView(view);

      expect(queryByRole('button', {name: 'Select motif area'})).not.toBeInTheDocument();
    });
  });

  describe('with missing backdrop image', () => {
    it('only shows topPadding and bottomPadding visualizations', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole, queryByRole} = renderBackboneView(view);

      expect(getByRole('img', {name: 'TopPadding'})).toBeInTheDocument();
      expect(getByRole('img', {name: 'Bottom'})).toBeInTheDocument();
      expect(queryByRole('img', {name: 'Auto'})).not.toBeInTheDocument();
      expect(queryByRole('img', {name: 'Manual'})).not.toBeInTheDocument();
      expect(queryByRole('img', {name: 'SideBySide'})).not.toBeInTheDocument();
    });

    it('does not render exposeMotifArea radio input', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {queryByRole} = renderBackboneView(view);

      expect(queryByRole('radio', {name: 'Auto mode'})).not.toBeInTheDocument();
    });

    it('does not render edit motif area button', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {queryByRole} = renderBackboneView(view);

      expect(queryByRole('button', {name: 'Select motif area'})).not.toBeInTheDocument();
    });
  });

  describe('for backdrop image with motif area', () => {
    it('shows exposeMotifArea radio input', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {
          backdropImage: 10,
          backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}
        }}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('radio', {name: 'Auto mode'})).toBeInTheDocument();
    });

    describe('with exposeMotifArea true', () => {
      it('only shows auto and sideBySide visualizations', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10}],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            exposeMotifArea: true,
            backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {getByRole, queryByRole} = renderBackboneView(view);

        expect(getByRole('img', {name: 'Auto'})).toBeVisibleViaBinding();
        expect(getByRole('img', {name: 'SideBySide'})).toBeVisibleViaBinding();
        expect(getByRole('img', {name: 'Bottom'})).toBeInTheDocument();
        expect(getByRole('img', {name: 'Manual'})).not.toBeVisibleViaBinding();
        expect(queryByRole('img', {name: 'TopPadding'})).not.toBeInTheDocument();
      });

      it('does not show sideBySide visualization when layout is center', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10}],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            exposeMotifArea: true,
            backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50},
            layout: 'center'
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {getByRole} = renderBackboneView(view);

        expect(getByRole('img', {name: 'SideBySide'})).not.toBeVisibleViaBinding();
      });

      it('hides paddingTop slider when layout is center', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10}],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            exposeMotifArea: true,
            backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50},
            layout: 'center'
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        renderBackboneView(view);

        expect(view.el.querySelector('.slider_input')).not.toBeVisibleViaBinding();
      });

      it('shows edit motif area button', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10}],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            exposeMotifArea: true,
            backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {getByRole} = renderBackboneView(view);

        expect(getByRole('button', {name: 'Edit motif area'})).toBeVisibleViaBinding();
      });
    });

    describe('with exposeMotifArea false', () => {
      it('shows manual visualization and hides sideBySide', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10}],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            exposeMotifArea: false,
            backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {getByRole} = renderBackboneView(view);

        expect(getByRole('img', {name: 'Manual'})).toBeVisibleViaBinding();
        expect(getByRole('img', {name: 'SideBySide'})).not.toBeVisibleViaBinding();
      });

      it('hides edit motif area button', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10}],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            exposeMotifArea: false,
            backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50}
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {getByRole} = renderBackboneView(view);

        expect(getByRole('button', {name: 'Edit motif area'})).not.toBeVisibleViaBinding();
      });

      it('shows paddingTop slider when layout is center', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10}],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            exposeMotifArea: false,
            backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50},
            layout: 'center'
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        renderBackboneView(view);

        expect(view.el.querySelector('.slider_input')).toBeVisibleViaBinding();
      });
    });
  });

  describe('for backdrop image without motif area', () => {
    it('shows auto visualization', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('img', {name: 'Auto'})).toBeInTheDocument();
    });

    it('does not render exposeMotifArea radio input', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {queryByRole} = renderBackboneView(view);

      expect(queryByRole('radio', {name: 'Auto mode'})).not.toBeInTheDocument();
    });

    it('shows edit motif area button with ignore option', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('button', {name: 'Ignore image'})).toBeInTheDocument();
    });

    it('shows info text matching auto radio label above edit motif area button', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {queryByText} = renderBackboneView(view);

      expect(queryByText('Auto mode')).toBeInTheDocument();
    });

    it('shows paddingTop visualization with info text matching manual radio label', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole, queryByText} = renderBackboneView(view);

      expect(getByRole('img', {name: 'TopPadding'})).toBeInTheDocument();
      expect(queryByText('Manual mode')).toBeInTheDocument();
    });

    it('shows bottom visualization and slider', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('img', {name: 'Bottom'})).toBeInTheDocument();
      expect(view.el.querySelectorAll('.slider_input').length).toBeGreaterThanOrEqual(1);
    });

    it('updates to show radios and hide ignore button when motif area is set', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole, queryByRole} = renderBackboneView(view);

      expect(queryByRole('radio', {name: 'Auto mode'})).not.toBeInTheDocument();
      expect(getByRole('button', {name: 'Ignore image'})).toBeInTheDocument();

      entry.sections.get(1).configuration.set(
        'backdropImageMotifArea',
        {left: 0, top: 0, width: 50, height: 50}
      );

      expect(getByRole('radio', {name: 'Auto mode'})).toBeInTheDocument();
      expect(queryByRole('button', {name: 'Ignore image'})).not.toBeInTheDocument();
    });

    it('updates to show checked manual radio when clicking ignore button', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByRole, queryByRole} = renderBackboneView(view);

      expect(queryByRole('radio', {name: 'Manual mode'})).not.toBeInTheDocument();

      await user.click(getByRole('button', {name: 'Ignore image'}));

      expect(getByRole('radio', {name: 'Manual mode'})).toBeChecked();
    });
  });

  describe('for backdrop image with ignored missing motif', () => {
    it('shows exposeMotifArea radio input', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}}],
        sections: [{id: 1, configuration: {backdropImage: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('radio', {name: 'Auto mode'})).toBeInTheDocument();
    });

    describe('with exposeMotifArea true', () => {
      it('has manual radio checked', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}}],
          sections: [{id: 1, configuration: {backdropImage: 10, exposeMotifArea: true}}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {getByRole} = renderBackboneView(view);

        expect(getByRole('radio', {name: 'Manual mode'})).toBeChecked();
      });

      it('shows manual visualization like exposeMotifArea false case', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}}],
          sections: [{id: 1, configuration: {backdropImage: 10, exposeMotifArea: true}}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {getByRole} = renderBackboneView(view);

        expect(getByRole('img', {name: 'Manual'})).toBeVisibleViaBinding();
        expect(getByRole('img', {name: 'SideBySide'})).not.toBeVisibleViaBinding();
      });

      it('toggles visualization when clicking auto radio', async () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}}],
          sections: [{id: 1, configuration: {backdropImage: 10, exposeMotifArea: true}}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole} = renderBackboneView(view);

        expect(getByRole('img', {name: 'Manual'})).toBeVisibleViaBinding();

        await user.click(getByRole('radio', {name: 'Auto mode'}));

        expect(getByRole('img', {name: 'Auto'})).toBeVisibleViaBinding();
        expect(getByRole('img', {name: 'Manual'})).not.toBeVisibleViaBinding();
      });

      it('hides edit motif area button initially', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}}],
          sections: [{id: 1, configuration: {backdropImage: 10, exposeMotifArea: true}}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {getByRole} = renderBackboneView(view);

        expect(getByRole('button', {name: 'No motif area selected'})).not.toBeVisibleViaBinding();
      });

      it('shows edit motif area button with warning styling when clicking auto radio', async () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}}],
          sections: [{id: 1, configuration: {backdropImage: 10, exposeMotifArea: true}}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole} = renderBackboneView(view);

        await user.click(getByRole('radio', {name: 'Auto mode'}));

        expect(getByRole('button', {name: 'No motif area selected'})).toBeVisibleViaBinding();
      });
    });

    describe('with exposeMotifArea false', () => {
      it('shows manual visualization and hides sideBySide', () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}}],
          sections: [{id: 1, configuration: {backdropImage: 10, exposeMotifArea: false}}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {getByRole} = renderBackboneView(view);

        expect(getByRole('img', {name: 'Manual'})).toBeVisibleViaBinding();
        expect(getByRole('img', {name: 'SideBySide'})).not.toBeVisibleViaBinding();
      });

      it('sets exposeMotifArea to true when motif area is assigned', async () => {
        const entry = createEntry({
          imageFiles: [{id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}}],
          sections: [{id: 1, configuration: {backdropImage: 10, exposeMotifArea: false}}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole} = renderBackboneView(view);

        expect(getByRole('radio', {name: 'Manual mode'})).toBeChecked();
        await user.click(getByRole('radio', {name: 'Auto mode'}));

        entry.sections.get(1).configuration.set(
          'backdropImageMotifArea',
          {left: 0, top: 0, width: 50, height: 50}
        );

        expect(entry.sections.get(1).configuration.get('exposeMotifArea')).toBe(true);
      });
    });
  });

  describe('landscape tab when portrait tab is available', () => {
    describe('when only portrait has motif area', () => {
      it('shows warning edit button on landscape tab', () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10},
            {id: 101, perma_id: 11}
          ],
          sections: [{id: 1, configuration: {
            exposeMotifArea: true,
            backdropImage: 10,
            backdropImageMobile: 11,
            backdropImageMobileMotifArea: {left: 0, top: 0, width: 50, height: 50}
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {getByRole} = renderBackboneView(view);

        expect(getByRole('button', {name: 'No motif area selected'})).toBeVisibleViaBinding();
      });

      it('does not show ignore button on landscape tab', () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10},
            {id: 101, perma_id: 11}
          ],
          sections: [{id: 1, configuration: {
            exposeMotifArea: true,
            backdropImage: 10,
            backdropImageMobile: 11,
            backdropImageMobileMotifArea: {left: 0, top: 0, width: 50, height: 50}
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const {queryByRole} = renderBackboneView(view);

        expect(queryByRole('button', {name: 'Ignore image'})).not.toBeInTheDocument();
      });
    });
  });

  describe('sliders', () => {
    it('passes texts and values from theme scale to paddingTop slider', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color', paddingTop: 'sm'}}],
        themeOptions: {
          properties: {
            root: {
              'sectionPaddingTop-none': '0',
              'sectionPaddingTop-sm': '1.375em',
              'sectionPaddingTop-lg': '3em'
            }
          }
        },
        themeTranslations: {
          scales: {
            sectionPaddingTop: {
              none: 'None',
              sm: 'Small',
              lg: 'Large'
            }
          }
        }
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      const sliderValueText = view.$el.find('.slider_input .value').eq(0).text();
      expect(sliderValueText).toEqual('Small');
    });

    it('passes texts and values from theme scale to paddingBottom slider', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color', paddingBottom: 'lg'}}],
        themeOptions: {
          properties: {
            root: {
              'sectionPaddingBottom-none': '0',
              'sectionPaddingBottom-sm': '1.375em',
              'sectionPaddingBottom-lg': '3em'
            }
          }
        },
        themeTranslations: {
          scales: {
            sectionPaddingBottom: {
              none: 'None',
              sm: 'Small',
              lg: 'Large'
            }
          }
        }
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      const sliderValueText = view.$el.find('.slider_input .value').eq(1).text();
      expect(sliderValueText).toEqual('Large');
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

    it('hides portrait tab when backdropType is color even if backdropImageMobile is present', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropType: 'color', backdropImageMobile: 10}}]
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

  describe('portrait tab with same paddings checkbox unchecked', () => {
    describe('when both files have motif area', () => {
      it('shows disabled radios and normal edit button', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10},
            {id: 200, perma_id: 20}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50},
            backdropImageMobile: 20,
            backdropImageMobileMotifArea: {left: 0, top: 0, width: 50, height: 50},
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole, getByText} = renderBackboneView(view);

        await user.click(getByText('Portrait'));

        expect(getByRole('radio', {name: 'Auto mode'})).toBeDisabled();
        expect(getByRole('button', {name: 'Edit motif area'})).toBeInTheDocument();
      });
    });

    describe('when only landscape has motif area', () => {
      it('shows warning edit button on portrait tab', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10},
            {id: 200, perma_id: 20}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50},
            backdropImageMobile: 20,
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole, getByText} = renderBackboneView(view);

        await user.click(getByText('Portrait'));

        expect(getByRole('button', {name: 'No motif area selected'})).toBeInTheDocument();
      });

      it('does not show ignore button', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10},
            {id: 200, perma_id: 20}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMotifArea: {left: 0, top: 0, width: 50, height: 50},
            backdropImageMobile: 20,
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {queryByRole, getByText} = renderBackboneView(view);

        await user.click(getByText('Portrait'));

        expect(queryByRole('button', {name: 'Ignore image'})).not.toBeInTheDocument();
      });
    });

    describe('when only portrait has motif area', () => {
      it('shows normal edit button on portrait tab', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10},
            {id: 200, perma_id: 20}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMobile: 20,
            backdropImageMobileMotifArea: {left: 0, top: 0, width: 50, height: 50},
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole, getByText} = renderBackboneView(view);

        await user.click(getByText('Portrait'));

        expect(getByRole('button', {name: 'Edit motif area'})).toBeInTheDocument();
      });
    });

    describe('when neither file has motif area', () => {
      it('shows advertise with ignore button', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10},
            {id: 200, perma_id: 20}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMobile: 20,
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole, getByText} = renderBackboneView(view);

        await user.click(getByText('Portrait'));

        expect(getByRole('button', {name: 'Select motif area'})).toBeInTheDocument();
        expect(getByRole('button', {name: 'Ignore image'})).toBeInTheDocument();
      });

      it('updates to show radios and hide ignore button when motif area is set', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10},
            {id: 200, perma_id: 20}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMobile: 20,
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole, queryByRole, getByText} = renderBackboneView(view);

        await user.click(getByText('Portrait'));

        expect(queryByRole('radio', {name: 'Auto mode'})).not.toBeInTheDocument();
        expect(getByRole('button', {name: 'Ignore image'})).toBeInTheDocument();

        entry.sections.get(1).configuration.set(
          'backdropImageMobileMotifArea',
          {left: 0, top: 0, width: 50, height: 50}
        );

        expect(getByRole('radio', {name: 'Auto mode'})).toBeInTheDocument();
        expect(queryByRole('button', {name: 'Ignore image'})).not.toBeInTheDocument();
      });

      it('updates to show checked manual radio when clicking ignore button', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10},
            {id: 200, perma_id: 20}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMobile: 20,
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole, queryByRole, getByText} = renderBackboneView(view);

        await user.click(getByText('Portrait'));

        expect(queryByRole('radio', {name: 'Manual mode'})).not.toBeInTheDocument();

        await user.click(getByRole('button', {name: 'Ignore image'}));

        expect(getByRole('radio', {name: 'Manual mode'})).toBeChecked();
      });
    });

    describe('when either file has ignored motif', () => {
      it('shows warning button without ignore option when landscape ignored', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}},
            {id: 200, perma_id: 20}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMobile: 20,
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole, queryByRole, getByText} = renderBackboneView(view);

        await user.click(getByText('Portrait'));

        expect(getByRole('button', {name: 'No motif area selected'})).not.toBeVisibleViaBinding();
        expect(queryByRole('button', {name: 'Ignore image'})).not.toBeInTheDocument();
      });

      it('shows warning button without ignore option when portrait ignored', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10},
            {id: 200, perma_id: 20, configuration: {ignoreMissingMotif: true}}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMobile: 20,
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole, queryByRole, getByText} = renderBackboneView(view);

        await user.click(getByText('Portrait'));

        expect(getByRole('button', {name: 'No motif area selected'})).not.toBeVisibleViaBinding();
        expect(queryByRole('button', {name: 'Ignore image'})).not.toBeInTheDocument();
      });

      it('defaults radios to manual', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}},
            {id: 200, perma_id: 20}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMobile: 20,
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole, getByText} = renderBackboneView(view);

        await user.click(getByText('Portrait'));

        expect(getByRole('radio', {name: 'Manual mode'})).toBeChecked();
      });

      it('clicking auto on landscape persists to portrait', async () => {
        const entry = createEntry({
          imageFiles: [
            {id: 100, perma_id: 10, configuration: {ignoreMissingMotif: true}},
            {id: 200, perma_id: 20}
          ],
          sections: [{id: 1, configuration: {
            backdropImage: 10,
            backdropImageMobile: 20,
            customPortraitPaddings: true,
            exposeMotifArea: true
          }}]
        });

        const view = new EditSectionPaddingsView({
          model: entry.sections.get(1),
          entry
        });

        const user = userEvent.setup();
        const {getByRole, getByText} = renderBackboneView(view);

        await user.click(getByRole('radio', {name: 'Auto mode'}));
        await user.click(getByText('Portrait'));

        expect(getByRole('radio', {name: 'Auto mode'})).toBeChecked();
      });
    });

    it('uses portraitPaddingTop property for slider', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}, {id: 200, perma_id: 20}],
        sections: [{id: 1, configuration: {
          backdropImage: 10,
          backdropImageMobile: 20,
          customPortraitPaddings: true,
          portraitPaddingTop: 'lg'
        }}],
        themeOptions: {
          properties: {
            root: {
              'sectionPaddingTop-sm': '1em',
              'sectionPaddingTop-lg': '3em',
              'sectionPaddingBottom-sm': '1em',
              'sectionPaddingBottom-lg': '3em'
            }
          }
        },
        themeTranslations: {
          scales: {
            sectionPaddingTop: {sm: 'Small', lg: 'Large'},
            sectionPaddingBottom: {sm: 'Small', lg: 'Large'}
          }
        }
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByText} = renderBackboneView(view);

      await user.click(getByText('Portrait'));

      const sliders = view.el.querySelectorAll('.slider_input');
      expect(sliders.length).toEqual(2);
      expect(sliders[0].querySelector('.value').textContent).toEqual('Large');
    });

    it('uses portraitPaddingBottom property for slider', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}, {id: 200, perma_id: 20}],
        sections: [{id: 1, configuration: {
          backdropImage: 10,
          backdropImageMobile: 20,
          customPortraitPaddings: true,
          portraitPaddingBottom: 'lg'
        }}],
        themeOptions: {
          properties: {
            root: {
              'sectionPaddingTop-sm': '1em',
              'sectionPaddingTop-lg': '3em',
              'sectionPaddingBottom-sm': '1em',
              'sectionPaddingBottom-lg': '3em'
            }
          }
        },
        themeTranslations: {
          scales: {
            sectionPaddingTop: {sm: 'Small', lg: 'Large'},
            sectionPaddingBottom: {sm: 'Small', lg: 'Large'}
          }
        }
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByText} = renderBackboneView(view);

      await user.click(getByText('Portrait'));

      const sliders = view.el.querySelectorAll('.slider_input');
      expect(sliders.length).toEqual(2);
      expect(sliders[1].querySelector('.value').textContent).toEqual('Large');
    });
  });

  describe('portrait tab with same paddings checkbox checked', () => {
    it('does not disable edit motif area button', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {
          portraitExposeMotifArea: true,
          backdropImageMobile: 10,
          backdropImageMobileMotifArea: {left: 0, top: 0, width: 50, height: 50},
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

      expect(getByRole('button', {name: 'Edit motif area'})).not.toBeDisabled();
    });

    it('shows non-portrait exposeMotifArea value in radio button', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {
          exposeMotifArea: true,
          portraitExposeMotifArea: false,
          customPortraitPaddings: false,
          backdropImageMobile: 10,
          backdropImageMobileMotifArea: {left: 0, top: 0, width: 50, height: 50}
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
          backdropImageMobile: 10,
          backdropImageMobileMotifArea: {left: 0, top: 0, width: 50, height: 50}
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

    it('disables side by side visualization', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {
          exposeMotifArea: true,
          customPortraitPaddings: false,
          backdropImageMobile: 10,
          backdropImageMobileMotifArea: {left: 0, top: 0, width: 50, height: 50}
        }}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByRole, getByText} = renderBackboneView(view);

      await user.click(getByText('Portrait'));

      expect(getByRole('img', {name: 'SideBySide'}).closest('.input')).toHaveClass('input-disabled');
    });

    it('enabled padding sliders when unchecking same as landscape checkbox', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {
          exposeMotifArea: true,
          customPortraitPaddings: false,
          backdropImageMobile: 10,
          backdropImageMobileMotifArea: {left: 0, top: 0, width: 50, height: 50}
        }}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByRole, getByText} = renderBackboneView(view);

      await user.click(getByText('Portrait'));
      await user.click(getByRole('checkbox', {name: 'Same as landscape'}));

      expect(getByRole('radio', {name: 'Auto mode'})).toBeDisabled();
      expect(view.el.querySelectorAll('.slider_input')[0].classList).not.toContain('disabled');
    });
  });

  describe('emulation mode toggling', () => {
    it('defaults to portrait tab when emulation_mode is phone', () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImageMobile: 10}}]
      });
      entry.set('emulation_mode', 'phone');

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const {getByRole} = renderBackboneView(view);

      expect(getByRole('tab', {name: 'Portrait'})).toHaveAttribute('aria-selected', 'true');
    });

    it('sets emulation_mode to phone when switching to portrait tab', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImageMobile: 10}}]
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByRole} = renderBackboneView(view);

      await user.click(getByRole('tab', {name: 'Portrait'}));

      expect(entry.get('emulation_mode')).toEqual('phone');
    });

    it('unsets emulation_mode when switching back to landscape tab', async () => {
      const entry = createEntry({
        imageFiles: [{id: 100, perma_id: 10}],
        sections: [{id: 1, configuration: {backdropImageMobile: 10}}]
      });
      entry.set('emulation_mode', 'phone');

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      const user = userEvent.setup();
      const {getByRole} = renderBackboneView(view);

      await user.click(getByRole('tab', {name: 'Portrait'}));
      await user.click(getByRole('tab', {name: 'Landscape'}));

      expect(entry.has('emulation_mode')).toEqual(false);
    });
  });

  describe('scrollToSection events', () => {
    it('triggers scrollToSection when starting to drag paddingTop slider', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
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
        sections: [{id: 1, configuration: {backdropType: 'color'}}]
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

  describe('slider default value', () => {
    it('displays default value text when section has no paddingTop set', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color'}}],
        themeOptions: {
          properties: {
            root: {
              sectionDefaultPaddingTop: '3em',
              'sectionPaddingTop-none': '0',
              'sectionPaddingTop-sm': '1.375em',
              'sectionPaddingTop-lg': '3em',
              'sectionPaddingBottom-none': '0',
              'sectionPaddingBottom-sm': '1.375em',
              'sectionPaddingBottom-lg': '3em'
            }
          }
        },
        themeTranslations: {
          scales: {
            sectionPaddingTop: {
              none: 'None',
              sm: 'Small',
              lg: 'Large'
            },
            sectionPaddingBottom: {
              none: 'None',
              sm: 'Small',
              lg: 'Large'
            }
          }
        }
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      const sliderValueText = view.$el.find('.slider_input .value').eq(0).text();
      expect(sliderValueText).toEqual('Large');
    });

    it('prefers appearance-specific default over root default', () => {
      const entry = createEntry({
        sections: [{id: 1, configuration: {backdropType: 'color', appearance: 'cards'}}],
        themeOptions: {
          properties: {
            root: {
              sectionDefaultPaddingTop: '1.375em',
              'sectionPaddingTop-none': '0',
              'sectionPaddingTop-sm': '1.375em',
              'sectionPaddingTop-lg': '3em',
              'sectionPaddingBottom-none': '0',
              'sectionPaddingBottom-sm': '1.375em',
              'sectionPaddingBottom-lg': '3em'
            },
            cardsAppearanceSection: {
              sectionDefaultPaddingTop: '3em'
            }
          }
        },
        themeTranslations: {
          scales: {
            sectionPaddingTop: {
              none: 'None',
              sm: 'Small',
              lg: 'Large'
            },
            sectionPaddingBottom: {
              none: 'None',
              sm: 'Small',
              lg: 'Large'
            }
          }
        }
      });

      const view = new EditSectionPaddingsView({
        model: entry.sections.get(1),
        entry
      });

      renderBackboneView(view);

      // Should display 'Large' (3em from cardsAppearanceSection) not 'Small' (1.375em from root)
      const sliderValueText = view.$el.find('.slider_input .value').eq(0).text();
      expect(sliderValueText).toEqual('Large');
    });
  });
});
