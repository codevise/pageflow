import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import {useFakeTranslations} from 'pageflow/testHelpers';

import {Link} from 'frontend/Link';
import {renderEntry, useCommentingPageObjects} from 'support/pageObjects/commenting';

describe('link tooltip in commenting mode', () => {
  useCommentingPageObjects();

  useFakeTranslations({
    'pageflow_scrolled.review.link_tooltip.not_published': 'Not published yet',
    'pageflow_scrolled.review.link_tooltip.password_protected': 'Password protected',
    'pageflow_scrolled.review.link_tooltip.open_preview': 'Open preview',
    'pageflow_scrolled.review.link_tooltip.open_draft_preview': 'Open draft preview',
    'pageflow_scrolled.inline_editing.link_tooltip.opens_in_same_tab': 'Opens in same tab'
  });

  function renderLink(href, {publicationState = 'not_published'} = {}) {
    return renderEntry({
      seed: {
        linkedEntries: [{
          id: 7,
          title: 'Other story',
          url: 'https://example.com/other',
          previewUrl: '/admin/entries/other/preview',
          publicationState
        }]
      },
      contentElement: {ui: <Link href={href}>A link</Link>}
    });
  }

  it('offers preview of unpublished entry', async () => {
    const user = userEvent.setup();
    const entry = renderLink({entry: 7, signature: 's'});

    await user.hover(entry.getByText('A link'));

    expect(entry.getByText('Other story').nextSibling).toHaveTextContent('Not published yet');
    expect(entry.getByRole('link', {name: 'Open preview'}))
      .toHaveAttribute('href', '/admin/entries/other/preview');
    expect(entry.getByRole('link', {name: 'Open preview'})).toHaveAttribute('target', '_blank');
  });

  it('offers draft preview of password protected entry', async () => {
    const user = userEvent.setup();
    const entry = renderLink({entry: 7, signature: 's'}, {
      publicationState: 'published_with_password_protection'
    });

    await user.hover(entry.getByText('A link'));

    expect(entry.getByText('Password protected')).toBeInTheDocument();
    expect(entry.getByRole('link', {name: 'Open draft preview'}))
      .toHaveAttribute('href', '/admin/entries/other/preview');
  });

  it('does not display tooltip for publicly published entry', async () => {
    const user = userEvent.setup();
    const entry = renderLink({entry: 7, signature: 's'}, {
      publicationState: 'published_without_password_protection'
    });

    await user.hover(entry.getByText('A link'));

    expect(entry.getAllByRole('link')).toHaveLength(1);
  });

  it('does not display hint about tab', async () => {
    const user = userEvent.setup();
    const entry = renderLink({entry: 7, signature: 's'});

    await user.hover(entry.getByText('A link'));

    expect(entry.queryByText('Opens in same tab')).toBeNull();
  });

  it('keeps link pointing to url of other entry', () => {
    const entry = renderLink({entry: 7, signature: 's'});

    expect(entry.getByRole('link', {name: 'A link'}))
      .toHaveAttribute('href', 'https://example.com/other');
  });

  it('does not display tooltip for external links', async () => {
    const user = userEvent.setup();
    const entry = renderLink('https://example.com');

    await user.hover(entry.getByText('A link'));

    expect(entry.getAllByRole('link')).toHaveLength(1);
  });
});
