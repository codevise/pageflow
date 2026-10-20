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
