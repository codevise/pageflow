import React from 'react';
import {LinkTooltipProvider, LinkPreview} from 'frontend/inlineEditing/LinkTooltip';

import {renderInEntry} from 'support';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('LinkTooltip', () => {
  useFakeTranslations({
    'pageflow_scrolled.inline_editing.link_tooltip.opens_in_new_tab': 'Opens in new tab',
    'pageflow_scrolled.inline_editing.link_tooltip.opens_in_same_tab': 'Opens in same tab',
    'pageflow_scrolled.inline_editing.link_tooltip.chapter_number': 'Chapter %{number}'
  });

  it('displays tooltip for external link on hover', async () => {
    const {getByText, queryByRole, queryByText} = render(
      <LinkTooltipProvider>
        <LinkPreview href="https://example.com">
          A link
        </LinkPreview>
      </LinkTooltipProvider>
    );

    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toHaveAttribute('href', 'https://example.com');
    expect(queryByText('Opens in same tab')).not.toBeNull();
  });

  it('does not display tooltip when disabled', async () => {
    const {getByText, queryByRole} = render(
      <LinkTooltipProvider disabled={true}>
        <LinkPreview href="https://example.com">
          A link
        </LinkPreview>
      </LinkTooltipProvider>
    );

    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toBeNull();
  });

  it('does not display tooltip when href is missing', async () => {
    const {getByText, container} = render(
      <LinkTooltipProvider>
        <LinkPreview>
          A link
        </LinkPreview>
      </LinkTooltipProvider>
    );

    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(container.querySelector('a')).toBeNull();
  });

  it('displays note about opening in new tab', async () => {
    const {getByText, queryByRole, queryByText} = render(
      <LinkTooltipProvider>
        <LinkPreview href="https://example.com" openInNewTab={true}>
          A link
        </LinkPreview>
      </LinkTooltipProvider>
    );

    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toHaveAttribute('href', 'https://example.com');
    expect(queryByText('Opens in new tab')).not.toBeNull();
  });

  it('displays tooltip for chapter link', async () => {
    const seed = {
      chapters: [
        {permaId: 5, configuration: {title: 'The Intro'}}
      ]
    }
    const {getByText, queryByRole} = renderInEntry(
      <LinkTooltipProvider>
        <LinkPreview href={{chapter: 5}}>
          A link
        </LinkPreview>
      </LinkTooltipProvider>,
      {seed}
    );

    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toHaveAttribute('href', '#the-intro');
    expect(queryByRole('link')).toHaveTextContent('Chapter 1 The Intro');
  });

  it('displays tooltip for section link', async () => {
    const seed = {
      sections: [
        {permaId: 5}
      ]
    }
    const {getByText, queryByRole} = renderInEntry(
      <LinkTooltipProvider>
        <LinkPreview href={{section: 5}}>
          A link
        </LinkPreview>
      </LinkTooltipProvider>,
      {seed}
    );

    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toHaveAttribute('href', '#section-5');
  });

  it('displays tooltip for file link', async () => {
    const seed = {
      imageFileUrlTemplates: {
        original: ':id_partition/original/:basename.:extension'
      },
      imageFiles: [{id: 1, permaId: 100}],
      sections: [
        {permaId: 5}
      ]
    }
    const {getByText, queryByRole} = renderInEntry(
      <LinkTooltipProvider>
        <LinkPreview href={{file: {permaId: 100, collectionName: 'imageFiles'}}}>
          A link
        </LinkPreview>
      </LinkTooltipProvider>,
      {seed}
    );

    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toHaveAttribute('href', '000/000/001/original/image.jpg');
  });
});
