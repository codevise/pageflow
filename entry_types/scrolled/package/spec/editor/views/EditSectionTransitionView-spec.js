import {EditSectionTransitionView} from 'editor/views/EditSectionTransitionView';
import {ScrolledEntry} from 'editor/models/ScrolledEntry';
import {RadioButtonGroupInput} from 'pageflow/testHelpers';
import {normalizeSeed, factories} from 'support';

describe('EditSectionTransitionView', () => {
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

    view.render();
    const transitionsSelectInput = RadioButtonGroupInput.findByPropertyName('transition', {inView: view});

    expect(transitionsSelectInput.enabledValues()).toContain('fade');
    expect(transitionsSelectInput.enabledValues()).toContain('fadeBg');
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

    view.render();
    const transitionsSelectInput = RadioButtonGroupInput.findByPropertyName('transition', {inView: view});

    expect(transitionsSelectInput.enabledValues()).toContain('scroll');
    expect(transitionsSelectInput.enabledValues()).not.toContain('fade');
    expect(transitionsSelectInput.enabledValues()).not.toContain('fadeBg');
  });
});
