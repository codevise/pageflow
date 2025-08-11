import React from 'react';

import {EditableTable} from 'frontend';
import {loadInlineEditingComponents} from 'frontend/inlineEditing';
import * as phoneLayout from 'frontend/usePhoneLayout';

import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('EditableText', () => {
  beforeAll(loadInlineEditingComponents);

  it('renders class name on table', () => {
    render(<EditableTable value={[]}
                          className="some-class" />);

    expect(screen.getByRole('table')).toHaveClass('some-class');
  });

  it('renders table with label and value typography classes on cells', () => {
    const value = [
      {
        type: 'row',
        children: [
          {
            type: 'label',
            children: [
              {text: 'Name'}
            ]
          },
          {
            type: 'value',
            children: [
              {text: 'Jane'}
            ]
          }
        ]
      }
    ];

    render(<EditableTable value={value}
                          labelScaleCategory="infoTableLabel"
                          valueScaleCategory="infoTableValue" />);

    expect(
      screen.getByRole('cell', {name: 'Name'}).querySelector('.typography-infoTableLabel')
    ).toBeInTheDocument();
    expect(
      screen.getByRole('cell', {name: 'Jane'}).querySelector('.typography-infoTableValue')
    ).toBeInTheDocument();
  });

  it('renders placeholder for empty table with single row', () => {
    const value = [
      {
        type: 'row',
        children: [
          {
            type: 'label',
            children: [
              {text: ''}
            ]
          },
          {
            type: 'value',
            children: [
              {text: ''}
            ]
          }
        ]
      }
    ];

    render(<EditableTable value={value}
                          labelPlaceholder="Enter Label"
                          valuePlaceholder="Enter Value" />);

    expect(
      screen.getAllByRole('cell')[0].querySelector('[contenteditable=false]')
    ).toHaveAttribute('data-text', 'Enter Label');
    expect(
      screen.getAllByRole('cell')[1].querySelector('[contenteditable=false]')
    ).toHaveAttribute('data-text', 'Enter Value');
  });

  it('does not render placeholders for table with multiple rows ', () => {
    const value = [
      {
        type: 'row',
        children: [
          {
            type: 'label',
            children: [
              {text: ''}
            ]
          },
          {
            type: 'value',
            children: [
              {text: ''}
            ]
          }
        ]
      },
      {
        type: 'row',
        children: [
          {
            type: 'label',
            children: [
              {text: ''}
            ]
          },
          {
            type: 'value',
            children: [
              {text: ''}
            ]
          }
        ]
      }
    ];

    render(<EditableTable value={value}
                          labelPlaceholder="Enter Label"
                          valuePlaceholder="Enter Value" />);

    expect(
      screen.getAllByRole('cell')[0].querySelector('[contenteditable=false]')
    ).toBeNull();
  });

  it('does not render placeholder in non-empty cell', () => {
    const value = [
      {
        type: 'row',
        children: [
          {
            type: 'label',
            children: [
              {text: 'Some text'}
            ]
          },
          {
            type: 'value',
            children: [
              {text: ''}
            ]
          }
        ]
      }
    ];

    render(<EditableTable value={value}
                          labelPlaceholder="Enter Label"
                          valuePlaceholder="Enter Value" />);

    expect(
      screen.getAllByRole('cell')[0].querySelector('[contenteditable=false]')
    ).toBeNull();
  });

  it('renders data-stacked attribute when stackedInPhoneLayout and in phone layout', () => {
    jest.spyOn(phoneLayout, 'usePhoneLayout').mockReturnValue(true);

    const {getByRole} = render(<EditableTable value={[]} stackedInPhoneLayout />);

    expect(getByRole('table')).toHaveAttribute('data-stacked');

    phoneLayout.usePhoneLayout.mockRestore();
  });
});
