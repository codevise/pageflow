import React from 'react';

import {EditableLink} from 'frontend';

import {render} from '@testing-library/react';
import {renderInEntry} from 'support';
import '@testing-library/jest-dom/extend-expect'

describe('EditableLink', () => {
  it('renders link', () => {
    const {getByRole} = render(
      <EditableLink href="https://example.com">Some link</EditableLink>
    );

    expect(getByRole('link')).toHaveTextContent('Some link')
    expect(getByRole('link')).toHaveAttribute('href', 'https://example.com')
    expect(getByRole('link')).not.toHaveAttribute('target')
    expect(getByRole('link')).not.toHaveAttribute('rel')
  });

  it('supports className', () => {
    const {getByRole} = render(
      <EditableLink className="custom" href="https://example.com">Some link</EditableLink>
    );

    expect(getByRole('link')).toHaveClass('custom')
  });

  it('supports rendering link with target blank', () => {
    const {getByRole} = render(
      <EditableLink href="https://example.com" openInNewTab>Some link</EditableLink>
    );

    expect(getByRole('link')).toHaveTextContent('Some link')
    expect(getByRole('link')).toHaveAttribute('target', '_blank')
    expect(getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
  });

  it('supports rendering internal chapter links', () => {
    const seed = {
      chapters: [{id: 1, permaId: 10, configuration: {title: 'The Intro'}}]
    };

    const {getByRole} = renderInEntry(
      <EditableLink href={{chapter: 10}}>Some link</EditableLink>,
      {seed}
    );

    expect(getByRole('link')).toHaveTextContent('Some link')
    expect(getByRole('link')).toHaveAttribute('href', '#the-intro')
    expect(getByRole('link')).not.toHaveAttribute('target')
    expect(getByRole('link')).not.toHaveAttribute('rel')
  });

  it('supports rendering internal section links', () => {
    const seed = {
      sections: [{id: 1, permaId: 10}]
    };

    const {getByRole} = renderInEntry(
      <EditableLink href={{section: 10}}>Some link</EditableLink>,
      {seed}
    );

    expect(getByRole('link')).toHaveTextContent('Some link')
    expect(getByRole('link')).toHaveAttribute('href', '#section-10')
    expect(getByRole('link')).not.toHaveAttribute('target')
    expect(getByRole('link')).not.toHaveAttribute('rel')
  });

  it('supports rendering file links', () => {
    const seed = {
      imageFileUrlTemplates: {
        original: ':id_partition/original/:basename.:extension'
      },
      sections: [{id: 1, permaId: 10}],
      imageFiles: [{id: 1, permaId: 100, displayName: 'Some File.jpg'}]
    };

    const {getByRole} = renderInEntry(
      <EditableLink href={{file: {permaId: 100, collectionName: 'imageFiles'}}}>
        Some link
      </EditableLink>,
      {seed}
    );

    expect(getByRole('link')).toHaveTextContent('Some link')
    expect(getByRole('link')).toHaveAttribute('href', '000/000/001/original/image.jpg?download=Some%20File.jpg')
    expect(getByRole('link')).toHaveAttribute('target', '_blank')
    expect(getByRole('link')).toHaveAttribute('rel', 'noopener noreferrer')
  });
});
