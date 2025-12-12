import '@testing-library/jest-dom/extend-expect';

import {SectionPaddingsInputView} from 'editor/views/inputs/SectionPaddingsInputView';
import {editor} from 'pageflow/editor';

import {useFakeTranslations, renderBackboneView} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';
import userEvent from '@testing-library/user-event';

describe('SectionPaddingsInputView', () => {
  const {createEntry} = useEditorGlobals();

  useFakeTranslations({
    'pageflow_scrolled.editor.section_paddings_input.auto': 'Auto'
  });

  beforeEach(() => {
    jest.spyOn(editor, 'navigate').mockImplementation(() => {});
  });

  it('triggers scrollToSection when clicking button', async () => {
    const entry = createEntry({
      sections: [{id: 1}]
    });
    const listener = jest.fn();
    entry.on('scrollToSection', listener);

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button'));

    expect(listener).toHaveBeenCalledWith(entry.sections.get(1), {ifNeeded: true});
  });

  it('navigates to paddings editor when clicking button', async () => {
    const entry = createEntry({
      sections: [{id: 1}]
    });

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button'));

    expect(editor.navigate).toHaveBeenCalledWith('/scrolled/sections/1/paddings', {trigger: true});
  });

  it('triggers selectSectionPaddings when clicking button', async () => {
    const entry = createEntry({
      sections: [{id: 1}]
    });
    const listener = jest.fn();
    entry.on('selectSectionPaddings', listener);

    const view = new SectionPaddingsInputView({
      model: entry.sections.get(1).configuration,
      entry
    });

    const user = userEvent.setup();
    const {getByRole} = renderBackboneView(view);

    await user.click(getByRole('button'));

    expect(listener).toHaveBeenCalledWith(entry.sections.get(1));
  });
});
