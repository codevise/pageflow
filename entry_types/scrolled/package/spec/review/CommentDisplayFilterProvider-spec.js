import React from 'react';
import {fireEvent, render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import {
  CommentDisplayFilterProvider,
  useCommentDisplayFilter,
  useStoredCommentDisplayFilter
} from 'review/CommentDisplayFilterProvider';

describe('comment display filter', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  function Probe() {
    const {resolution, alwaysShowComments, setResolution} = useCommentDisplayFilter();

    return (
      <button onClick={() => setResolution('all')}>
        {resolution} {alwaysShowComments ? 'everywhere' : 'for the selection'}
      </button>
    );
  }

  function Remembered({storageKey}) {
    const filter = useStoredCommentDisplayFilter(storageKey);

    return (
      <CommentDisplayFilterProvider {...filter}>
        <Probe />
      </CommentDisplayFilterProvider>
    );
  }

  it('shows unresolved threads by default', () => {
    const {getByRole} = render(<Remembered storageKey="editor" />);

    expect(getByRole('button')).toHaveTextContent('unresolved');
  });

  it('passes the selected resolution to consumers', () => {
    const {getByRole} = render(<Remembered storageKey="editor" />);

    fireEvent.click(getByRole('button'));

    expect(getByRole('button')).toHaveTextContent('all');
  });

  it('remembers the resolution under the given storage key', () => {
    const {getByRole, unmount} = render(<Remembered storageKey="editor" />);
    fireEvent.click(getByRole('button'));
    unmount();

    const {getByRole: getByRoleAgain} = render(<Remembered storageKey="editor" />);

    expect(getByRoleAgain('button')).toHaveTextContent('all');
  });

  it('keeps the resolutions of separate storage keys apart', () => {
    const {getByRole, unmount} = render(<Remembered storageKey="editor" />);
    fireEvent.click(getByRole('button'));
    unmount();

    const {getByRole: getPreviewButton} = render(<Remembered storageKey="preview" />);

    expect(getPreviewButton('button')).toHaveTextContent('unresolved');
  });

  it('takes the resolution from a provider controlled from outside', () => {
    const {getByRole} = render(
      <CommentDisplayFilterProvider resolution="all">
        <Probe />
      </CommentDisplayFilterProvider>
    );

    expect(getByRole('button')).toHaveTextContent('all');
  });

  it('displays comments everywhere by default', () => {
    const {getByRole} = render(<Remembered storageKey="editor" />);

    expect(getByRole('button')).toHaveTextContent('everywhere');
  });

  it('takes displaying comments for the selection only from outside', () => {
    const {getByRole} = render(
      <CommentDisplayFilterProvider alwaysShowComments={false}>
        <Probe />
      </CommentDisplayFilterProvider>
    );

    expect(getByRole('button')).toHaveTextContent('for the selection');
  });
});
