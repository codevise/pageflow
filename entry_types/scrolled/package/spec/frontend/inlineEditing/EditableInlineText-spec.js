import React from 'react';

import {EditableInlineText} from 'frontend';
import {loadInlineEditingExtensions} from 'frontend/inlineEditing';

import {render} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'
import {editableTextValue} from 'support';

describe('EditableInlineText', () => {
  beforeAll(loadInlineEditingExtensions);

  it('renders text from value', () => {
    const value = editableTextValue('Some text', {type: 'heading'});

    const {queryByText} = render(<EditableInlineText value={value} />);

    expect(queryByText('Some text')).toBeInTheDocument()
  });

  it('renders placeholder if value is undefined', () => {
    const {queryByText} = render(<EditableInlineText placeholder="Some placeholder" />);

    expect(queryByText('Some placeholder')).toBeInTheDocument()
  });

  it('renders placeholder if value is empty', () => {
    const value = editableTextValue('', {type: 'heading'});

    const {queryByText} = render(<EditableInlineText value={value}
                                                     placeholder="Some placeholder" />);

    expect(queryByText('Some placeholder')).toBeInTheDocument()
  });

  it('does not render placeholder if value is present', () => {
    const value = editableTextValue('Some text', {type: 'heading'});

    const {queryByText} = render(<EditableInlineText value={value}
                                                     placeholder="Some placeholder" />);

    expect(queryByText('Some placeholder')).not.toBeInTheDocument()
  });

  it('supports default value', () => {
    const {queryByText} = render(<EditableInlineText defaultValue="Some default" />);

    expect(queryByText('Some default')).toBeInTheDocument()
  });

  it('prefers value over defaultValue', () => {
    const value = editableTextValue('Some text', {type: 'heading'});

    const {queryByText} = render(<EditableInlineText value={value} defaultValue="Some default" />);

    expect(queryByText('Some text')).toBeInTheDocument()
  });
});
