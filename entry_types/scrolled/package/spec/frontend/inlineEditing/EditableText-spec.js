import React from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';

import {features} from 'pageflow/frontend';
import {EditableText} from 'frontend';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';
import {renderWithCommenting} from 'testHelpers/renderWithCommenting';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

import {commentHighlightStyles as highlightStyles} from 'pageflow-scrolled/review';

describe('EditableText', () => {
  beforeAll(loadInlineEditingComponents);

  beforeAll(() => window.getSelection = function() {});

  const wrapper = ({children}) => <DndProvider backend={HTML5Backend}>{children}</DndProvider>;

  it('renders text from value', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {queryByText} = render(<EditableText value={value} />, {wrapper});

    expect(queryByText('Some text')).toBeInTheDocument()
  });

  it('renders class name', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value} className="some-class" />, {wrapper}
    );

    expect(container.querySelector('.some-class')).toBeInTheDocument()
  });

  it('uses body scaleCategory by default', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value} />, {wrapper}
    );

    expect(container.querySelector('.typography-body')).toBeInTheDocument()
  });

  it('supports using different scaleCategory', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value} scaleCategory="quoteText-lg" />, {wrapper}
    );

    expect(container.querySelector('.typography-quoteText')).toBeInTheDocument()
  });

  it('supports typography variant prop', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value}
                    scaleCategory="quoteText-lg"
                    typographyVariant="highlight" />,
      {wrapper}
    );

    expect(container.querySelector('.typography-quoteText-highlight')).toBeInTheDocument()
  });

  it('supports typography size prop', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value}
                    scaleCategory="question"
                    typographySize="lg" />,
      {wrapper}
    );

    expect(container.querySelector('.typography-question-lg')).toBeInTheDocument()
  });

  it('renders placeholder if value is undefined', () => {
    const {queryByText} = render(<EditableText placeholder="Some placeholder" />, {wrapper});

    expect(queryByText('Some placeholder')).toBeInTheDocument()
  });

  it('renders placeholder if value is empty', () => {
    const value = [{
      type: 'paragraph',
      children: [
        {text: ''}
      ]
    }];

    const {queryByText} = render(<EditableText value={value}
                                               placeholder="Some placeholder" />,
                                 {wrapper});

    expect(queryByText('Some placeholder')).toBeInTheDocument()
  });

  it('does not render placeholder if value is present', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {queryByText} = render(<EditableText value={value}
                                               placeholder="Some placeholder" />,
                                {wrapper});

    expect(queryByText('Some placeholder')).not.toBeInTheDocument()
  });

  it('supports rendering custom placeholder class name', () => {
    const {container} = render(
      <EditableText placeholder="Some placeholder"
                    placeholderClassName="custom-placeholder" />,
      {wrapper}
    );

    expect(container.querySelector('.custom-placeholder')).toBeInTheDocument()
  });

  it('does not render custom placeholder class name when not blank', () => {
    const value = [{
      type: 'heading',
      children: [
        {text: 'Some text'}
      ]
    }];

    const {container} = render(
      <EditableText value={value}
                    placeholder="Some placeholder"
                    placeholderClassName="custom-placeholder" />,
      {wrapper}
    );

    expect(container.querySelector('.custom-placeholder')).not.toBeInTheDocument()
  });

  describe('with commenting', () => {
    beforeEach(() => {
      jest.spyOn(features, 'isEnabled').mockImplementation(
        name => name === 'commenting'
      );
    });

    afterEach(() => {
      features.isEnabled.mockRestore();
    });

    it('highlights thread ranges', () => {
      const value = [{type: 'paragraph', children: [{text: 'Some text to comment on'}]}];

      const {container} = renderWithCommenting(
        <EditableText value={value} contentElementId={1} />,
        {
          wrapper,
          commentThreads: [{
            id: 1,
            subjectType: 'ContentElement',
            subjectId: 10,
            subjectRange: {anchor: {path: [0, 0], offset: 5}, focus: {path: [0, 0], offset: 9}},
            comments: [{id: 1, body: 'A comment', creatorName: 'Alice', creatorId: 1}]
          }]
        }
      );

      const highlight = container.querySelector(`.${highlightStyles.highlight}`);
      expect(highlight).toBeInTheDocument();
      expect(highlight).toHaveTextContent('text');
    });
  });
});
