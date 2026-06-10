import React from 'react';

import {ExternalLinkList} from 'contentElements/externalLinkList/frontend/ExternalLinkList';

import {useFakeTranslations} from 'pageflow/testHelpers';
import {renderInContentElement} from 'pageflow-scrolled/testHelpers';
import {within} from '@testing-library/react';
import {screen} from 'support/screenWithCustomQueries';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect'

describe('ExternalLinkList with backfaces', () => {
  useFakeTranslations({
    'pageflow_scrolled.public.flip_card': 'Flip card'
  });

  it('does not render backfaces by default', async () => {
    const configuration = {
      itemTexts: {
        1: {
          title: value('Some card'),
          backfaceTitle: value('Backface title')
        }
      },
      links: [
        {id: 1}
      ]
    };

    renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />
    );

    expect(screen.queryByText('Backface title')).not.toBeInTheDocument();
  });

  it('supports toggling to backface', async () => {
    const configuration = {
      backfaces: true,
      itemTexts: {
        1: {
          title: value('Some card'),
          backfaceTitle: value('Backface title')
        }
      },
      links: [
        {id: 1}
      ]
    };

    const user = userEvent.setup();
    renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />
    );
    const flipButton = screen.getByRole('button', {name: 'Flip card'});
    const backface = document.getElementById(flipButton.getAttribute('aria-controls'))

    expect(flipButton).toHaveAttribute('aria-expanded', 'false');
    expect(backface).toHaveAttribute('inert', 'true');
    expect(within(backface).queryByText('Backface title')).toBeInTheDocument();

    await user.click(flipButton);

    expect(flipButton).toHaveAttribute('aria-expanded', 'true');
    expect(backface).not.toHaveAttribute('inert');
  });

  it('renders links as buttons on backface', async () => {
    const configuration = {
      backfaces: true,
      itemLinks: {
        1: {href: 'https://example.com/'}
      },
      itemTexts: {
        1: {
          link: value('Button text'),
        }
      },
      links: [
        {id: 1}
      ]
    };

    const user = userEvent.setup();
    renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />
    );

    expect(screen.queryByRole('link', {name: 'Button text'})).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', {name: 'Flip card'}));

    expect(screen.getByRole('link', {name: 'Button text'}))
      .toHaveAttribute('href', 'https://example.com/');
  });

  it('does not render button on frontside even if displayButtons is true', async () => {
    const configuration = {
      backfaces: true,
      displayButtons: true,
      itemLinks: {
        1: {href: 'https://example.com/'}
      },
      itemTexts: {
        1: {
          link: value('Button text'),
        }
      },
      links: [
        {id: 1}
      ]
    };

    renderInContentElement(
      <ExternalLinkList configuration={configuration} sectionProps={{}} />
    );

    expect(screen.queryByRole('link', {name: 'Button text'})).not.toBeInTheDocument();
  });
});

function value(text) {
  return [{
    type: 'paragraph',
    children: [{text}],
  }];
}
