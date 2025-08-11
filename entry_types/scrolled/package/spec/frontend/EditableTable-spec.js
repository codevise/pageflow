import React from 'react';

import {EditableTable} from 'frontend';
import * as phoneLayout from 'frontend/usePhoneLayout';

import {render, screen} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'

describe('EditableTable', () => {
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

  it('renders links', () => {
    const value = [{
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
            {text: 'Find more '},
            {
              type: 'link',
              href: 'https://example.com',
              children: [
                {text: 'here'}
              ]
            },
            {text: '.'}
          ]
        }
      ]
    }];

    const {getByRole} = render(<EditableTable value={value} />);

    expect(getByRole('link')).toHaveTextContent('here')
    expect(getByRole('link')).toHaveAttribute('href', 'https://example.com')
    expect(getByRole('link')).toHaveClass('typography-contentLink')
    expect(getByRole('link')).not.toHaveAttribute('target')
    expect(getByRole('link')).not.toHaveAttribute('rel')
  });

  it('supports rendering links with target blank', () => {
    const value = [{
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
            {text: 'Find more '},
            {
              type: 'link',
              href: 'https://example.com',
              openInNewTab: true,
              children: [
                {text: 'here'}
              ]
            },
            {text: '.'}
          ]
        }
      ]
    }];

    const {getByRole} = render(<EditableTable value={value} />);

    expect(getByRole('link')).toHaveTextContent('here')
    expect(getByRole('link')).toHaveAttribute('target', '_blank')
    expect(getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
  });

  it('supports text formatting', () => {
    const value = [{
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
            {text: 'x', bold: true},
            {text: '3', sup: true},
            {text: ' and '},
            {text: 'CO'},
            {text: '2', sub: true}
          ]
        }
      ]
    }];

    const {container} = render(<EditableTable value={value} />);

    expect(container.querySelector('strong')).toHaveTextContent('x')
    expect(container.querySelector('sup')).toHaveTextContent('3')
    expect(container.querySelector('sub')).toHaveTextContent('2')
  });

  it('renders blank class on blank cells', () => {
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
              {text: 'Value'}
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
              {text: 'Label'}
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

    render(<EditableTable value={value} />);

    expect(
      screen.queryAllByRole('cell').map(cell => cell.getAttribute('data-blank'))
    ).toEqual(['', null, null, '']);
  });

  it('renders data-stacked attribute when stackedInPhoneLayout and in phone layout', () => {
    jest.spyOn(phoneLayout, 'usePhoneLayout').mockReturnValue(true);

    const {getByRole} = render(<EditableTable value={[]} stackedInPhoneLayout />);

    expect(getByRole('table')).toHaveAttribute('data-stacked');

    phoneLayout.usePhoneLayout.mockRestore();
  });
});
