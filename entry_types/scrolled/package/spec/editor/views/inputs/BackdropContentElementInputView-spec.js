import {editor} from 'pageflow/editor';
import {
  BackdropContentElementInputView
} from 'editor/views/inputs/BackdropContentElementInputView';
import {
  InsertContentElementDialogView
} from 'editor/views/InsertContentElementDialogView';

import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import {renderBackboneView as render, useFakeTranslations} from 'pageflow/testHelpers';
import {useEditorGlobals, useFakeXhr} from 'support';

describe('BackdropContentElementInputView', () => {
  const {createEntry} = useEditorGlobals();
  useFakeXhr();

  useFakeTranslations({
    'pageflow_scrolled.editor.content_elements.inlineVideo.name': 'Video',
    'pageflow_scrolled.editor.backdrop_content_element_input.add': 'Add',
    'pageflow_scrolled.editor.backdrop_content_element_input.unset': 'Unset'
  });

  beforeEach(() => {
    editor.contentElementTypes.register('inlineVideo', {
      supportedPositions: ['inline', 'full', 'backdrop']
    });
  });

  it('supports adding backdrop content element', async () => {
    const showDialog = jest.spyOn(InsertContentElementDialogView, 'show');
    const entry = createEntry({
      sections: [
        {id: 1, configuration: {}}
      ]
    });

    const view = new BackdropContentElementInputView({
      entry,
      editor,
      model: entry.sections.first().configuration,
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Add'}));

    expect(showDialog).toHaveBeenCalledWith({
      entry,
      editor,
      insertOptions: {at: 'backdropOfSection', id: 1}
    });
  });

  it('supports navigating to backdrop content element', async () => {
    const navigate = jest.spyOn(editor, 'navigate').mockImplementation(() => {});
    const entry = createEntry({
      sections: [
        {id: 1, configuration: {backdropContentElement: 50}}
      ],
      contentElements: [
        {
          id: 5,
          permaId: 50,
          sectionId: 1,
          typeName: 'inlineVideo',
          configuration: {position: 'backdrop'}
        }
      ]
    });

    const view = new BackdropContentElementInputView({
      entry,
      editor,
      model: entry.sections.first().configuration,
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Video'}));

    expect(navigate).toHaveBeenCalledWith('/scrolled/content_elements/5', {trigger: true});
  });

  it('has button to reset position of backdrop content element', async () => {
    const entry = createEntry({
      sections: [
        {id: 1, configuration: {backdropContentElement: 50}}
      ],
      contentElements: [
        {
          id: 5,
          permaId: 50,
          sectionId: 1,
          typeName: 'inlineVideo',
          configuration: {position: 'backdrop'}
        }
      ]
    });

    const view = new BackdropContentElementInputView({
      entry,
      editor,
      model: entry.sections.first().configuration,
    });

    const user = userEvent.setup();
    const {getByRole} = render(view);
    await user.click(getByRole('button', {name: 'Unset'}));

    expect(entry.contentElements.first().configuration.get('position')).toEqual('inline')
  });
});
