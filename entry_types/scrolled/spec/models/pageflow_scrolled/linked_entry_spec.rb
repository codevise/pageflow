require 'spec_helper'

module PageflowScrolled
  RSpec.describe LinkedEntry do
    describe '.all' do
      it 'wraps entries of given scope ordered by id' do
        entries = create_list(:entry, 2)

        result = LinkedEntry.all(Pageflow::Entry.all,
                                 entries[1].id => [],
                                 entries[0].id => [])

        expect(result.map(&:entry)).to eq(entries)
      end

      it 'ignores entries outside of given scope' do
        entry = create(:entry)

        expect(LinkedEntry.all(Pageflow::Entry.none, entry.id => [])).to eq([])
      end

      it 'returns chapters for given perma ids' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        create(:scrolled_chapter, revision: entry.draft)

        linked_entry = LinkedEntry.all(Pageflow::Entry.all, entry.id => [chapter.perma_id]).first

        expect(linked_entry.chapters.map(&:perma_id)).to eq([chapter.perma_id])
      end

      it 'skips chapters that can not be found' do
        entry = create(:published_entry, type_name: 'scrolled')

        linked_entry = LinkedEntry.all(Pageflow::Entry.all, entry.id => [1234]).first

        expect(linked_entry.chapters).to eq([])
      end

      it 'uses slug of published revision' do
        entry = create(:published_entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter,
                         revision: entry.revision,
                         configuration: {title: 'Old title'})
        create(:scrolled_chapter,
               revision: entry.entry.draft,
               perma_id: chapter.perma_id,
               configuration: {title: 'New title'})

        expect(linked_chapter(entry.entry, chapter).slug).to eq('old-title')
      end

      it 'falls back to slug of draft for chapters that are not published yet' do
        entry = create(:published_entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter,
                         revision: entry.entry.draft,
                         configuration: {title: 'New chapter'})

        expect(linked_chapter(entry.entry, chapter).slug).to eq('new-chapter')
      end

      it 'uses slug and title of draft for previews' do
        entry = create(:published_entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter,
                         revision: entry.revision,
                         configuration: {title: 'Old title'})
        create(:scrolled_chapter,
               revision: entry.entry.draft,
               perma_id: chapter.perma_id,
               configuration: {title: 'New title'})

        linked_chapter = linked_chapter(entry.entry, chapter)

        expect(linked_chapter.preview_slug).to eq('new-title')
        expect(linked_chapter.title).to eq('New title')
      end

      it 'falls back to slug and title of published revision for previews' do
        entry = create(:published_entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter,
                         revision: entry.revision,
                         configuration: {title: 'Deleted in draft'})

        linked_chapter = linked_chapter(entry.entry, chapter)

        expect(linked_chapter.preview_slug).to eq('deleted-in-draft')
        expect(linked_chapter.title).to eq('Deleted in draft')
      end

      it 'takes preceding chapters into account for slugs' do
        entry = create(:entry, type_name: 'scrolled')
        create(:scrolled_chapter, revision: entry.draft, position: 1,
                                  configuration: {title: 'Intro'})
        chapter = create(:scrolled_chapter, revision: entry.draft, position: 2,
                                            configuration: {title: 'Intro'})

        expect(linked_chapter(entry, chapter).slug).to eq("intro-#{chapter.perma_id}")
      end

      it 'loads chapters of all entries with a single query' do
        entries = create_list(:entry, 2, type_name: 'scrolled')
        chapters = entries.map { |entry| create(:scrolled_chapter, revision: entry.draft) }
        allow(Chapter).to receive(:joins).and_call_original

        result = LinkedEntry.all(Pageflow::Entry.all,
                                 entries[0].id => [chapters[0].perma_id],
                                 entries[1].id => [chapters[1].perma_id])

        expect(result.flat_map(&:chapters).map(&:perma_id)).to eq(chapters.map(&:perma_id))
        expect(Chapter).to have_received(:joins).once
      end

      it 'does not load chapters of entries linked as a whole' do
        entry = create(:entry, type_name: 'scrolled')
        create(:scrolled_chapter, revision: entry.draft)
        allow(Chapter).to receive(:joins).and_call_original

        LinkedEntry.all(Pageflow::Entry.all, entry.id => [])

        expect(Chapter).not_to have_received(:joins)
      end
    end

    def linked_chapter(entry, chapter)
      LinkedEntry.all(Pageflow::Entry.all, entry.id => [chapter.perma_id]).first.chapters.first
    end
  end
end
