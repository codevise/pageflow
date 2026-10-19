require 'spec_helper'

module PageflowScrolled
  RSpec.describe LinkableEntry do
    describe '.all' do
      it 'wraps entries of given scope' do
        entry = create(:entry)
        other_entry = create(:entry, title: 'Other story')

        result = LinkableEntry.all(Pageflow::Entry.all, except: entry)

        expect(result.map(&:entry)).to eq([other_entry])
        expect(result.first.title).to eq('Other story')
      end

      it 'skips fragment libraries' do
        entry = create(:entry)
        create(:entry, fragment_library: 'shared')

        expect(LinkableEntry.all(Pageflow::Entry.all, except: entry)).to eq([])
      end
    end

    describe '.find' do
      it 'returns linkable scrolled entry' do
        entry = create(:entry)
        other_entry = create(:entry, type_name: 'scrolled')

        result = LinkableEntry.find(Pageflow::Entry.all, other_entry.id, except: entry)

        expect(result.entry).to eq(other_entry)
      end

      it 'returns nil for entries of other types' do
        entry = create(:entry)
        other_entry = create(:entry, type_name: 'paged')

        expect(LinkableEntry.find(Pageflow::Entry.all, other_entry.id, except: entry)).to be_nil
      end

      it 'returns nil for given entry' do
        entry = create(:entry, type_name: 'scrolled')

        expect(LinkableEntry.find(Pageflow::Entry.all, entry.id, except: entry)).to be_nil
      end

      it 'returns nil for fragment libraries' do
        entry = create(:entry)
        library = create(:entry, type_name: 'scrolled', fragment_library: 'shared')

        expect(LinkableEntry.find(Pageflow::Entry.all, library.id, except: entry)).to be_nil
      end
    end

    describe '#content' do
      it 'includes hidden sections of draft' do
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        section = create(:section, chapter:, configuration: {hidden: true})

        expect(LinkableEntry.new(entry).content.sections).to eq([section])
      end
    end

    describe '#published_entry' do
      it 'uses published revision' do
        entry = create(:published_entry, revision_attributes: {title: 'Published'})
        entry.entry.draft.update!(title: 'Draft')

        expect(LinkableEntry.new(entry.entry).published_entry.title).to eq('Published')
      end

      it 'falls back to draft for entries that are not published' do
        entry = create(:entry)
        entry.draft.update!(title: 'Draft')

        expect(LinkableEntry.new(entry).published_entry.title).to eq('Draft')
      end
    end
  end
end
