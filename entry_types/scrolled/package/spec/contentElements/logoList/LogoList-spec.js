import React from 'react';
import '@testing-library/jest-dom/extend-expect'

import {LogoList} from 'contentElements/logoList/LogoList';

import {renderInContentElement} from 'pageflow-scrolled/testHelpers';

describe('LogoList', () => {
  const imageFileUrlTemplates = {
    medium: ':id_partition/medium/image.webp',
    original: ':id_partition/original/:basename.:extension'
  };

  function renderLogoList({configuration, imageFiles}) {
    const result = renderInContentElement(
      <LogoList configuration={configuration} contentElementId={1} />,
      {seed: {imageFileUrlTemplates, imageFiles}}
    );

    result.simulateScrollPosition('near viewport');

    return result;
  }

  it('renders medium variant of item images', () => {
    const {getAllByRole} = renderLogoList({
      configuration: {items: [{id: 1, image: 100}, {id: 2, image: 101}]},
      imageFiles: [{id: 1, permaId: 100}, {id: 2, permaId: 101}]
    });

    expect(getAllByRole('img').map(img => img.getAttribute('src'))).toEqual([
      '000/000/001/medium/image.webp',
      '000/000/002/medium/image.webp'
    ]);
  });

  it('uses original url of svg images', () => {
    const {getByRole} = renderLogoList({
      configuration: {items: [{id: 1, image: 100}]},
      imageFiles: [{id: 1, permaId: 100, basename: 'logo', extension: 'svg'}]
    });

    expect(getByRole('img')).toHaveAttribute('src', '000/000/001/original/logo.svg');
  });

  it('renders alt text of image file', () => {
    const {getByRole} = renderLogoList({
      configuration: {items: [{id: 1, image: 100}]},
      imageFiles: [{id: 1, permaId: 100, configuration: {alt: 'ACME Inc.'}}]
    });

    expect(getByRole('img', {name: 'ACME Inc.'})).toBeInTheDocument();
  });

  it('passes image dimensions to preserve aspect ratio', () => {
    const {getByRole} = renderLogoList({
      configuration: {items: [{id: 1, image: 100}]},
      imageFiles: [{id: 1, permaId: 100, width: 400, height: 100}]
    });

    expect(getByRole('img')).toHaveAttribute('width', '400');
    expect(getByRole('img')).toHaveAttribute('height', '100');
  });

  it('skips items with missing image files', () => {
    const {getAllByRole} = renderLogoList({
      configuration: {items: [{id: 1, image: 100}, {id: 2, image: 999}]},
      imageFiles: [{id: 1, permaId: 100}]
    });

    expect(getAllByRole('listitem')).toHaveLength(1);
  });

  it('does not load images before content element is near viewport', () => {
    const {queryByRole} = renderInContentElement(
      <LogoList configuration={{items: [{id: 1, image: 100}]}} contentElementId={1} />,
      {seed: {imageFileUrlTemplates, imageFiles: [{id: 1, permaId: 100}]}}
    );

    expect(queryByRole('img')).toBeNull();
  });
});
