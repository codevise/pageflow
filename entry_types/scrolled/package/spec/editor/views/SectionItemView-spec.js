import {SectionItemView} from 'editor/views/SectionItemView';

import {useEditorGlobals, useFakeXhr, useReactBasedBackboneViews} from 'support';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';
import '@testing-library/jest-dom/extend-expect';

describe('SectionItemView', () => {
  useFakeXhr();

  useFakeTranslations({
    'pageflow_scrolled.editor.section_item.hide': 'Hide',
    'pageflow_scrolled.editor.section_item.show': 'Show',
    'pageflow_scrolled.editor.section_item.set_cutoff': 'Set cutoff point',
    'pageflow_scrolled.editor.section_item.reset_cutoff': 'Remove cutoff point',
    'pageflow_scrolled.editor.section_item.cutoff': 'Cutoff point',
  });

  const {createEntry} = useEditorGlobals();
  const {render} = useReactBasedBackboneViews();

  it('offer menu item to hide and show section', async () => {
    const entry = createEntry({
      sections: [
        {id: 1, permaId: 100}
      ]
    });
    const section = entry.sections.get(1)
    const view = new SectionItemView({
      entry,
      model: section
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('link', {name: 'Hide'}));

    expect(section.configuration.get('hidden')).toEqual(true);

    await user.click(getByRole('link', {name: 'Show'}));

    expect(section.configuration.get('hidden')).toBeUndefined();
  });

  it('does not offer menu item to set cutoff section by default', () => {
    const entry = createEntry({
      sections: [
        {id: 1, permaId: 100}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(1)
    });

    const {queryByRole} = render(view);

    expect(queryByRole('link', {name: 'Set cutoff point'})).toBeNull();
  });

  it('offers menu item to set cutoff section if site has cutoff mode', async () => {
    const entry = createEntry({
      site: {
        cutoff_mode_name: 'subscription_headers'
      },
      sections: [
        {id: 1, permaId: 100}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(1)
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('link', {name: 'Set cutoff point'}));

    expect(entry.metadata.configuration.get('cutoff_section_perma_id')).toEqual(100);
  });

  it('offers menu item to reset cutoff section if site has cutoff mode', async () => {
    const entry = createEntry({
      site: {
        cutoff_mode_name: 'subscription_headers'
      },
      metadata: {configuration: {cutoff_section_perma_id: 101}},
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(2)
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('link', {name: 'Remove cutoff point'}));

    expect(entry.metadata.configuration.get('cutoff_section_perma_id')).toBeUndefined();
  });

  it('updates menu item when cutoff section changes', () => {
    const entry = createEntry({
      site: {
        cutoff_mode_name: 'subscription_headers'
      },
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(2)
    });

    const {queryByRole} = render(view);
    entry.metadata.configuration.set('cutoff_section_perma_id', 101)

    expect(queryByRole('link', {name: 'Remove cutoff point'})).not.toBeNull();
  });

  it('renders cutoff indicator', () => {
    const entry = createEntry({
      site: {
        cutoff_mode_name: 'subscription_headers'
      },
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(2)
    });

    const {queryByText} = render(view);
    entry.metadata.configuration.set('cutoff_section_perma_id', 101)

    expect(queryByText('Cutoff point')).toBeVisible();
  });

  it('does not render cutoff indicator if cutoff section not set', () => {
    const entry = createEntry({
      site: {
        cutoff_mode_name: 'subscription_headers'
      },
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(2)
    });

    const {queryByText} = render(view);

    expect(queryByText('Cutoff point')).not.toBeVisible();
  });

  it('does not render cutoff indicator if site does not have cutoff mode', () => {
    const entry = createEntry({
      metadata: {configuration: {cutoff_section_perma_id: 101}},
      sections: [
        {id: 1, permaId: 100},
        {id: 2, permaId: 101}
      ]
    });
    const view = new SectionItemView({
      entry,
      model: entry.sections.get(2)
    });

    const {queryByText} = render(view);

    expect(queryByText('Cutoff point')).not.toBeVisible();
  });
});
