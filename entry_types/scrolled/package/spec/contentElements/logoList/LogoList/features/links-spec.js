import React from 'react';

import {LogoList} from 'contentElements/logoList/LogoList';

import {loadInlineEditingExtensions} from 'frontend/inlineEditing';
import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'

describe('LogoList links', () => {
  const seed = {
    imageFileUrlTemplates: {medium: ':id_partition/medium/image.webp'},
    imageFiles: [
      {id: 1, permaId: 100, configuration: {alt: 'ACME'}},
      {id: 2, permaId: 101, configuration: {alt: 'Globex'}}
    ]
  };

  const items = [{id: 1, image: 100}, {id: 2, image: 101}];

  function renderLogoList(configuration, options = {}) {
    const result = renderInContentElement(
      <LogoList configuration={configuration} contentElementId={1} />,
      {seed, ...options}
    );

    result.simulateScrollPosition('near viewport');

    return result;
  }

  it('wraps logos with item links in links', () => {
    renderLogoList({
      items,
      itemLinks: {1: {href: 'https://acme.example.com', openInNewTab: true}}
    });

    expect(screen.getByRole('link', {name: 'ACME'}))
      .toHaveAttribute('href', 'https://acme.example.com');
    expect(screen.getByRole('link', {name: 'ACME'}))
      .toHaveAttribute('target', '_blank');
  });

  it('renders logos without item link as plain images', () => {
    renderLogoList({
      items,
      itemLinks: {1: {href: 'https://acme.example.com'}}
    });

    expect(screen.getByRole('img', {name: 'Globex'}).closest('a')).toBeNull();
  });

  describe('in editor', () => {
    useFakeTranslations({
      'pageflow_scrolled.inline_editing.select_link_destination': 'Select link destination',
      'pageflow_scrolled.inline_editing.change_link_destination': 'Change link destination'
    });

    beforeAll(loadInlineEditingExtensions);

    beforeEach(() => {
      const rect = {width: 100, height: 20, top: 100, left: 100, bottom: 120, right: 200, x: 100, y: 100};
      Element.prototype.getClientRects = jest.fn(() => [rect]);
      Element.prototype.getBoundingClientRect = jest.fn(() => rect);
    });

    it('does not display link action button before logo is clicked', () => {
      renderLogoList({items}, {inlineEditing: {isSelected: true}});

      expect(screen.queryByRole('button', {name: 'Select link destination'})).toBeNull();
    });

    it('displays link action button for clicked logo', async () => {
      const user = userEvent.setup();
      renderLogoList({items}, {inlineEditing: {isSelected: true}});

      await user.click(screen.getByRole('img', {name: 'ACME'}));

      expect(screen.getAllByRole('button', {name: 'Select link destination'})).toHaveLength(1);
    });

    it('displays link tooltip of one logo at a time', async () => {
      const user = userEvent.setup();
      renderLogoList({
        items,
        itemLinks: {
          1: {href: 'https://acme.example.com'},
          2: {href: 'https://globex.example.com'}
        }
      }, {inlineEditing: {isSelected: false}});

      await user.hover(screen.getByRole('img', {name: 'ACME'}));
      await user.hover(screen.getByRole('img', {name: 'Globex'}));

      expect(screen.queryByRole('link', {name: /acme.example.com/})).toBeNull();
      expect(screen.getByRole('link', {name: /globex.example.com/})).toBeInTheDocument();
    });

    it('does not display link action button if content element is not selected', async () => {
      const user = userEvent.setup();
      renderLogoList({items}, {inlineEditing: {isSelected: false}});

      await user.click(screen.getByRole('img', {name: 'ACME'}));

      expect(screen.queryByRole('button', {name: 'Select link destination'})).toBeNull();
    });
  });
});
