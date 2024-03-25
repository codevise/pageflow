import {EditSectionTransitionView} from 'editor/views/EditSectionTransitionView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {useFakeTranslations, setupGlobals} from 'pageflow/testHelpers';
import {normalizeSeed, factories, useFakeXhr} from 'support';
import 'editor/config';

import {within} from '@testing-library/dom';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('EditSectionTransitionView', () => {
  const prefix = 'pageflow_scrolled.editor.edit_section_transition.attributes.transition';

  setupGlobals({
    entry: () => factories.entry(ScrolledEntry)
  });

  useFakeTranslations({
    [`${prefix}.mark_as_default_transition`]: 'Use %{name} by default',

    [`${prefix}.variants.fade`]: 'Fade background and contents',
    [`${prefix}.variants.fadeBg`]: 'Fade background only',
    [`${prefix}.values.fade`]: 'Fade',
    [`${prefix}.values.fadeBg`]: 'Fade background only',
    [`${prefix}.values.scroll`]: 'Scroll',
    [`${prefix}.values.beforeAfter`]: 'Before After'
  });

  useFakeXhr();

  it('offers fade transtions if both adjacent sections have full height', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1, configuration: {fullHeight: true}},
          {id: 2, configuration: {fullHeight: true}}
        ]
      })
    });
    const view = new EditSectionTransitionView({
      model: entry.sections.get(2),
      entry
    });

    const {getByLabelText} = within(view.render().el);

    expect(getByLabelText('Fade background and contents')).toBeEnabled();
    expect(getByLabelText('Fade background only')).toBeEnabled();
    expect(getByLabelText('Scroll')).toBeEnabled();
  });

  it('does not offer fade transtions if one adjacent section does not have full height', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1, configuration: {fullHeight: false}},
          {id: 2}
        ]
      })
    });
    const view = new EditSectionTransitionView({
      model: entry.sections.get(2),
      entry
    });

    const {getByLabelText} = within(view.render().el);

    expect(getByLabelText('Fade background and contents')).toBeDisabled();
    expect(getByLabelText('Fade background only')).toBeDisabled();
    expect(getByLabelText('Scroll')).toBeEnabled();
  });

  it('offers fade transtions if adjacent sections use backdrop content elements', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1, configuration: {fullHeight: false, backdropType: 'contentElement'}},
          {id: 2, configuration: {fullHeight: false, backdropType: 'contentElement'}}
        ]
      })
    });
    const view = new EditSectionTransitionView({
      model: entry.sections.get(2),
      entry
    });

    const {getByLabelText} = within(view.render().el);

    expect(getByLabelText('Fade background and contents')).toBeEnabled();
    expect(getByLabelText('Fade background only')).toBeEnabled();
    expect(getByLabelText('Scroll')).toBeEnabled();
  });

  it('restores fade variant when toggling to other transition and back to fade', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1},
          {id: 2}
        ]
      })
    });
    const view = new EditSectionTransitionView({
      model: entry.sections.get(2),
      entry
    });

    const user = userEvent.setup();
    const {getByLabelText} = within(view.render().el);
    await user.click(getByLabelText('Fade background and contents'));
    await user.click(getByLabelText('Before After'));
    await user.click(getByLabelText('Fade'));

    expect(getByLabelText('Fade background and contents')).toBeChecked();

    await user.click(getByLabelText('Fade background only'));
    await user.click(getByLabelText('Before After'));
    await user.click(getByLabelText('Fade'));

    expect(getByLabelText('Fade background only')).toBeChecked();
  });

  it('displays default transition', () => {
    const entry = factories.entry(ScrolledEntry, {
      metadata: {
        configuration: {
          defaultTransition: 'scroll'
        }
      }
    }, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1},
          {id: 2}
        ]
      })
    });
    const view = new EditSectionTransitionView({
      model: entry.sections.get(2),
      entry
    });

    const {getByLabelText} = within(view.render().el);

    expect(getByLabelText('Use Scroll by default')).toBeChecked();
  });

  it('displays fadeBg as default transition by default', () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1},
          {id: 2}
        ]
      })
    });
    const view = new EditSectionTransitionView({
      model: entry.sections.get(2),
      entry
    });

    const {getByLabelText} = within(view.render().el);

    expect(getByLabelText('Use Fade background only by default')).toBeChecked();
  });

  it('allows setting default transition', async () => {
    const entry = factories.entry(ScrolledEntry, {}, {
      entryTypeSeed: normalizeSeed({
        sections: [
          {id: 1},
          {id: 2}
        ]
      })
    });
    const view = new EditSectionTransitionView({
      model: entry.sections.get(2),
      entry
    });

    const user = userEvent.setup();
    const {getByTitle} = within(view.render().el);
    await user.click(getByTitle('Use Before After by default'));

    expect(entry.metadata.configuration.get('defaultTransition')).toEqual('beforeAfter');
  });
});
