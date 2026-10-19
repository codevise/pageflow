import React from 'react';
import {LinkTooltipProvider, LinkPreview} from 'frontend/inlineEditing/LinkTooltip';
import {MainStorylineActivity} from 'frontend/storylineActivity';

import {renderInEntry} from 'support';
import {useFakeTranslations} from 'pageflow/testHelpers';
import {render, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';

describe('LinkTooltip', () => {
  useFakeTranslations({
    'pageflow_scrolled.inline_editing.link_tooltip.opens_in_new_tab': 'Opens in new tab',
    'pageflow_scrolled.inline_editing.link_tooltip.opens_in_same_tab': 'Opens in same tab',
    'pageflow_scrolled.inline_editing.link_tooltip.chapter_number': 'Chapter %{number}',
    'pageflow_scrolled.inline_editing.link_tooltip.excursion_with_title': 'Excursion: %{title}',
    'pageflow_scrolled.inline_editing.link_tooltip.untitled_excursion': 'Untitled Excursion',
    'pageflow_scrolled.inline_editing.link_tooltip.unavailable_entry': 'Unavailable story',
    'pageflow_scrolled.inline_editing.link_tooltip.publication_states.not_published':
      'Not published yet',
    'pageflow_scrolled.inline_editing.link_tooltip.publication_states.published_with_password_protection':
      'Password protected',
    'pageflow_scrolled.inline_editing.link_tooltip.open_preview': 'Open preview',
    'pageflow_scrolled.inline_editing.link_tooltip.open_draft_preview': 'Open draft preview',
    'pageflow_scrolled.inline_editing.link_tooltip.section_in': 'Section in'
  });

  beforeEach(() => {
    const rect = {width: 100, height: 20, top: 100, left: 100, bottom: 120, right: 200, x: 100, y: 100};
    Element.prototype.getClientRects = jest.fn(() => [rect]);
    Element.prototype.getBoundingClientRect = jest.fn(() => rect);
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

  it('does not display tooltip when disabled on provider', async () => {
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

  it('does not display tooltip when disabled on LinkPreview', async () => {
    const {getByText, queryByRole} = render(
      <LinkTooltipProvider>
        <LinkPreview href="https://example.com" disabled={true}>
          A link
        </LinkPreview>
      </LinkTooltipProvider>
    );

    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toBeNull();
  });

  it('hides tooltip when disabled prop changes on LinkPreview', async () => {
    const Fixture = ({disabled}) =>
      <LinkTooltipProvider>
        <LinkPreview href="https://example.com" disabled={disabled}>
          A link
        </LinkPreview>
      </LinkTooltipProvider>;

    const {getByText, queryByRole, rerender} = render(<Fixture />);

    const user = userEvent.setup();
    await user.hover(getByText('A link'));
    rerender(<Fixture disabled={true} />);

    await waitFor(() =>
      expect(queryByRole('link')).toBeNull()
    );
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

  describe('for link to other entry', () => {
    function renderLinkPreview(href, {linkedEntry, openInNewTab} = {}) {
      return renderInEntry(
        <LinkTooltipProvider>
          <LinkPreview href={href} openInNewTab={openInNewTab}>
            A link
          </LinkPreview>
        </LinkTooltipProvider>,
        {seed: {linkedEntries: linkedEntry ? [{id: 7, ...linkedEntry}] : []}}
      );
    }

    it('displays title linking to url of entry', async () => {
      const {getByText, getByRole} = renderLinkPreview({entry: 7}, {
        linkedEntry: {title: 'Other story', url: 'https://example.com/other'}
      });

      const user = userEvent.setup();
      await user.hover(getByText('A link'));

      expect(getByRole('link', {name: 'Other story'}))
        .toHaveAttribute('href', 'https://example.com/other');
      expect(getByRole('link', {name: 'Other story'})).toHaveAttribute('target', '_blank');
    });

    it('displays note about opening link in same tab', async () => {
      const {getByText} = renderLinkPreview({entry: 7}, {
        linkedEntry: {title: 'Other story', url: 'https://example.com/other'}
      });

      const user = userEvent.setup();
      await user.hover(getByText('A link'));

      expect(getByText('Opens in same tab')).toBeInTheDocument();
    });

    it('displays note about opening link in new tab', async () => {
      const {getByText} = renderLinkPreview({entry: 7}, {
        linkedEntry: {title: 'Other story', url: 'https://example.com/other'},
        openInNewTab: true
      });

      const user = userEvent.setup();
      await user.hover(getByText('A link'));

      expect(getByText('Opens in new tab')).toBeInTheDocument();
    });

    it('offers preview of unpublished entry', async () => {
      const {getByText, getByRole} = renderLinkPreview({entry: 7}, {
        linkedEntry: {
          title: 'Other story',
          url: 'https://example.com/other',
          previewUrl: '/admin/entries/other/preview',
          publicationState: 'not_published'
        }
      });

      const user = userEvent.setup();
      await user.hover(getByText('A link'));

      expect(getByText('Not published yet')).toBeInTheDocument();
      expect(getByRole('link', {name: 'Open preview'}))
        .toHaveAttribute('href', '/admin/entries/other/preview');
      expect(getByRole('link', {name: 'Open preview'})).toHaveAttribute('target', '_blank');
    });

    it('displays publication state after title', async () => {
      const {getByText} = renderLinkPreview({entry: 7}, {
        linkedEntry: {
          title: 'Other story',
          url: 'https://example.com/other',
          previewUrl: '/admin/entries/other/preview',
          publicationState: 'published_with_password_protection'
        }
      });

      const user = userEvent.setup();
      await user.hover(getByText('A link'));

      expect(getByText('Other story').nextSibling).toHaveTextContent('Password protected');
    });

    it('does not link title of unpublished entry', async () => {
      const {getByText, queryByRole} = renderLinkPreview({entry: 7}, {
        linkedEntry: {
          title: 'Other story',
          url: 'https://example.com/other',
          previewUrl: '/admin/entries/other/preview',
          publicationState: 'not_published'
        }
      });

      const user = userEvent.setup();
      await user.hover(getByText('A link'));

      expect(getByText('Other story')).toBeInTheDocument();
      expect(queryByRole('link', {name: 'Other story'})).toBeNull();
    });

    it('offers draft preview of published entry without pill', async () => {
      const {getByText, queryByText, getByRole} = renderLinkPreview({entry: 7}, {
        linkedEntry: {
          title: 'Other story',
          url: 'https://example.com/other',
          previewUrl: '/admin/entries/other/preview',
          publicationState: 'published_without_password_protection'
        }
      });

      const user = userEvent.setup();
      await user.hover(getByText('A link'));

      expect(queryByText('Published')).toBeNull();
      expect(getByRole('link', {name: 'Open draft preview'}))
        .toHaveAttribute('href', '/admin/entries/other/preview');
    });

    it('offers draft preview of password protected entry', async () => {
      const {getByText, getByRole} = renderLinkPreview({entry: 7}, {
        linkedEntry: {
          title: 'Other story',
          url: 'https://example.com/other',
          previewUrl: '/admin/entries/other/preview',
          publicationState: 'published_with_password_protection'
        }
      });

      const user = userEvent.setup();
      await user.hover(getByText('A link'));

      expect(getByText('Password protected')).toBeInTheDocument();
      expect(getByRole('link', {name: 'Open draft preview'}))
        .toHaveAttribute('href', '/admin/entries/other/preview');
    });

    it('does not display publication state without preview url', async () => {
      const {getByText, queryByRole} = renderLinkPreview({entry: 7}, {
        linkedEntry: {title: 'Other story', url: 'https://example.com/other'}
      });

      const user = userEvent.setup();
      await user.hover(getByText('A link'));

      expect(queryByRole('link', {name: /preview/})).toBeNull();
    });

    it('displays note for unavailable entry', async () => {
      const {getByText} = renderLinkPreview({entry: 7});

      const user = userEvent.setup();
      await user.hover(getByText('A link'));

      expect(getByText('Unavailable story')).toBeInTheDocument();
    });
    describe('with chapter or section', () => {
      const linkedEntry = {
        title: 'Other story',
        url: 'https://example.com/other',
        previewUrl: '/admin/entries/other/preview',
        publicationState: 'published_without_password_protection'
      };

      it('displays chapter title linking to chapter', async () => {
        const {getByText, getByRole} = renderLinkPreview({entry: 7, chapter: 20}, {
          linkedEntry: {
            ...linkedEntry,
            chapters: [{permaId: 20, title: 'Intro', slug: 'intro', previewSlug: 'new-intro'}]
          }
        });

        const user = userEvent.setup();
        await user.hover(getByText('A link'));

        expect(getByRole('link', {name: 'Other story › Intro'}))
          .toHaveAttribute('href', 'https://example.com/other#intro');
        expect(getByRole('link', {name: 'Open draft preview'}))
          .toHaveAttribute('href', '/admin/entries/other/preview#new-intro');
      });

      it('displays section hint', async () => {
        const {getByText, getByRole} = renderLinkPreview({entry: 7, section: 30}, {
          linkedEntry
        });

        const user = userEvent.setup();
        await user.hover(getByText('A link'));

        expect(getByText('Section in', {exact: false})).toBeInTheDocument();
        expect(getByRole('link', {name: 'Other story'}))
          .toHaveAttribute('href', 'https://example.com/other#section-30');
        expect(getByRole('link', {name: 'Open draft preview'}))
          .toHaveAttribute('href', '/admin/entries/other/preview#section-30');
      });
    });
  });

  it('displays tooltip for file link', async () => {
    const seed = {
      imageFileUrlTemplates: {
        original: ':id_partition/original/:basename.:extension'
      },
      imageFiles: [{id: 1, permaId: 100, displayName: 'MyImage.jpg'}],
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

    expect(queryByRole('link')).toHaveAttribute('href', '000/000/001/original/image.jpg?download=MyImage.jpg');
    expect(queryByRole('link')).toHaveTextContent('MyImage.jpg');
  });

  it('displays tooltip for excursion chapter link with title', async () => {
    const seed = {
      storylines: [
        {id: 1, configuration: {main: true}},
        {id: 2}
      ],
      chapters: [
        {permaId: 10, storylineId: 1, configuration: {title: 'Main Chapter'}},
        {permaId: 20, storylineId: 2, configuration: {title: 'Side Story'}}
      ]
    }
    const {getByText, queryByRole} = renderInEntry(
      <LinkTooltipProvider>
        <LinkPreview href={{chapter: 20}}>
          A link
        </LinkPreview>
      </LinkTooltipProvider>,
      {seed}
    );

    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toHaveAttribute('href', '#side-story');
    expect(queryByRole('link')).toHaveTextContent('Excursion: Side Story');
  });

  it('displays tooltip for excursion chapter link without title', async () => {
    const seed = {
      storylines: [
        {id: 1, configuration: {main: true}},
        {id: 2}
      ],
      chapters: [
        {permaId: 10, storylineId: 1, configuration: {title: 'Main Chapter'}},
        {permaId: 20, storylineId: 2, configuration: {}}
      ]
    }
    const {getByText, queryByRole} = renderInEntry(
      <LinkTooltipProvider>
        <LinkPreview href={{chapter: 20}}>
          A link
        </LinkPreview>
      </LinkTooltipProvider>,
      {seed}
    );

    const user = userEvent.setup();
    await user.hover(getByText('A link'));

    expect(queryByRole('link')).toHaveAttribute('href', '#chapter-20');
    expect(queryByRole('link')).toHaveTextContent('Untitled Excursion');
  });

  it('hides tooltip when storyline is in background', async () => {
    const Fixture = ({activeExcursion}) => (
      <MainStorylineActivity activeExcursion={activeExcursion}>
        <LinkTooltipProvider>
          <LinkPreview href="https://example.com" openInNewTab={false}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a>Test Link</a>
          </LinkPreview>
        </LinkTooltipProvider>
      </MainStorylineActivity>
    );

    const {getByText, queryByRole, rerender} = render(<Fixture activeExcursion={null} />);

    const user = userEvent.setup();
    await user.hover(getByText('Test Link'));

    expect(queryByRole('link')).toHaveAttribute('href', 'https://example.com');

    rerender(<Fixture activeExcursion={{id: 1}} />);

    await waitFor(() => {
      expect(queryByRole('link')).toBeNull();
    });
  });
});
