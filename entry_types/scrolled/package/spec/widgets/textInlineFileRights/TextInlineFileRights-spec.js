import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInContentElement} from 'support';

import {TextInlineFileRights} from 'widgets/textInlineFileRights/TextInlineFileRights';

describe('TextInlineFileRights', () => {
  it('renders children', () => {
    const {queryByTestId} =
      renderInContentElement(
        <TextInlineFileRights configuration={{}}>
          <div data-testid="content" />
        </TextInlineFileRights>,
        {
          seed: {}
        }
      );

    expect(queryByTestId('content')).not.toBeNull();
  });

  it('sets hasFileRights to true in transient state on mount', () => {
    const setTransientState = jest.fn();

    renderInContentElement(
      <TextInlineFileRights configuration={{}} />,
      {
        seed: {},
        editorState: {isEditable: true, setTransientState}
      }
    );

    expect(setTransientState).toHaveBeenCalledWith({hasFileRights: true})
  });

  it('sets hasFileRights to false in transient state on unmount', () => {
    const setTransientState = jest.fn();

    const {unmount} = renderInContentElement(
      <TextInlineFileRights configuration={{}} />,
      {
        seed: {},
        editorState: {isEditable: true, setTransientState}
      }
    );
    unmount();

    expect(setTransientState).toHaveBeenCalledWith({hasFileRights: false})
  });

  it('does not set transient state if context unsupported', () => {
    const setTransientState = jest.fn();

    const {unmount} = renderInContentElement(
      <TextInlineFileRights configuration={{}} context="insideElement" />,
      {
        seed: {},
        editorState: {isEditable: true, setTransientState}
      }
    );
    unmount();

    expect(setTransientState).not.toHaveBeenCalled()
  });
});
