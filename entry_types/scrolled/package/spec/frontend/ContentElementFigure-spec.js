import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {renderInContentElement} from 'support';

import {ContentElementFigure} from 'frontend/ContentElementFigure';

describe('ContentElementFigure', () => {
  it('just renders children by default', () => {
    const {queryByTestId} =
      renderInContentElement(
        <ContentElementFigure configuration={{}}><div data-testid="content" /></ContentElementFigure>,
        {
          seed: {}
        }
      );

    expect(queryByTestId('content')).not.toBeNull();
  });

  it('applies variant scope', () => {
    const configuration = {
      caption: [{
        type: 'paragraph',
        children: [{ text: 'Some caption text' }],
      }],
      captionVariant: 'invert'
    };

    const {container} =
      renderInContentElement(
        <ContentElementFigure configuration={configuration} />,
        {
          seed: {}
        }
      );

    expect(container.querySelector('figcaption')).toHaveClass('scope-figureCaption-invert');
  });

  it('sets hasCaption to true in transient state on mount', () => {
    const configuration = {
      caption: [{
        type: 'paragraph',
        children: [{ text: 'Some caption text' }],
      }],
      captionVariant: 'invert'
    };
    const setTransientState = jest.fn();

    renderInContentElement(
      <ContentElementFigure configuration={configuration} />,
      {
        seed: {},
        editorState: {isEditable: true, setTransientState}
      }
    );

    expect(setTransientState).toHaveBeenCalledWith({hasCaption: true})
  });

  it('sets hasCaption to false in transient state on unmount', () => {
    const configuration = {
      caption: [{
        type: 'paragraph',
        children: [{ text: 'Some caption text' }],
      }],
      captionVariant: 'invert'
    };
    const setTransientState = jest.fn();

    const {unmount} = renderInContentElement(
      <ContentElementFigure configuration={configuration} />,
      {
        seed: {},
        editorState: {isEditable: true, setTransientState}
      }
    );
    unmount();

    expect(setTransientState).toHaveBeenCalledWith({hasCaption: false})
  });

  it('does not render transient state component outside of editor', () => {
    const configuration = {
      caption: [{
        type: 'paragraph',
        children: [{ text: 'Some caption text' }],
      }],
      captionVariant: 'invert'
    };
    const setTransientState = jest.fn();

    renderInContentElement(
      <ContentElementFigure configuration={configuration} />,
      {
        seed: {},
        editorState: {isEditable: false, setTransientState}
      }
    );

    expect(setTransientState).not.toHaveBeenCalled();
  });
});
