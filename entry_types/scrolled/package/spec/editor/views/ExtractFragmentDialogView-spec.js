import {ExtractFragmentDialogView} from 'editor/views/ExtractFragmentDialogView';

import {useFakeTranslations, renderBackboneView as render} from 'pageflow/testHelpers';
import {useEditorGlobals} from 'support';

import userEvent from '@testing-library/user-event';

describe('ExtractFragmentDialogView', () => {
  useFakeTranslations({
    'pageflow_scrolled.editor.extract_fragment.header': 'Add to shared fragments',
    'pageflow_scrolled.editor.extract_fragment.name': 'Name',
    'pageflow_scrolled.editor.extract_fragment.submit': 'Add',
    'pageflow_scrolled.editor.extract_fragment.cancel': 'Cancel',
    'pageflow_scrolled.editor.extract_fragment.shared_hint': 'Fragments are shared.'
  });

  const {createEntry} = useEditorGlobals();

  function renderDialog({chapterConfiguration = {title: 'Intro'}, onSubmit = jest.fn()} = {}) {
    const entry = createEntry({chapters: [{id: 1, configuration: chapterConfiguration}]});
    const view = new ExtractFragmentDialogView({chapter: entry.chapters.get(1), onSubmit});

    return {view, onSubmit, ...render(view)};
  }

  it('renders header', () => {
    const {getByRole} = renderDialog();

    expect(getByRole('heading', {name: 'Add to shared fragments'})).toBeTruthy();
  });

  it('explains that fragments are shared', () => {
    const {getByText} = renderDialog();

    expect(getByText('Fragments are shared.')).toBeTruthy();
  });

  it('prefills name with chapter title', () => {
    const {getByRole} = renderDialog({chapterConfiguration: {title: 'Intro'}});

    expect(getByRole('textbox', {name: 'Name'}).value).toEqual('Intro');
  });

  it('submits entered name when add button is clicked', async () => {
    const user = userEvent.setup();
    const {getByRole, onSubmit} = renderDialog();

    await user.clear(getByRole('textbox', {name: 'Name'}));
    await user.type(getByRole('textbox', {name: 'Name'}), ' Opening with video ');
    await user.click(getByRole('button', {name: 'Add'}));

    expect(onSubmit).toHaveBeenCalledWith('Opening with video');
  });

  it('submits name when enter is pressed', async () => {
    const user = userEvent.setup();
    const {getByRole, onSubmit} = renderDialog();

    await user.type(getByRole('textbox', {name: 'Name'}), ' video{Enter}');

    expect(onSubmit).toHaveBeenCalledWith('Intro video');
  });

  it('closes after submitting', async () => {
    const user = userEvent.setup();
    const {view, getByRole} = renderDialog();
    const close = jest.spyOn(view, 'close');

    await user.click(getByRole('button', {name: 'Add'}));

    expect(close).toHaveBeenCalled();
  });

  it('does not submit when cancelled', async () => {
    const user = userEvent.setup();
    const {getByRole, onSubmit} = renderDialog();

    await user.click(getByRole('button', {name: 'Cancel'}));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
