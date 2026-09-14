require 'spec_helper'

module PageflowScrolled
  RSpec.describe FragmentLibrary do
    describe '.all' do
      it 'includes entries marked as shared fragment library' do
        entry = create(:entry, type_name: 'scrolled', fragment_library: 'shared')

        expect(FragmentLibrary.all.map(&:id)).to include(entry.id)
      end

      it 'skips entries that are not fragment libraries' do
        entry = create(:entry, type_name: 'scrolled')

        expect(FragmentLibrary.all.map(&:id)).not_to include(entry.id)
      end

      it 'orders libraries by creation' do
        account = create(:account)
        first = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')
        second = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')

        expect(FragmentLibrary.where(account:).map(&:id)).to eq([first.id, second.id])
      end

      it 'can be narrowed to account' do
        account = create(:account)
        entry = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')
        create(:entry, type_name: 'scrolled', fragment_library: 'shared')

        expect(FragmentLibrary.where(account:).map(&:id)).to eq([entry.id])
      end

      it 'can be emptied' do
        create(:entry, type_name: 'scrolled', fragment_library: 'shared')

        expect(FragmentLibrary.all.none.to_a).to be_empty
      end

      it 'can be merged with entry scope' do
        account = create(:account)
        entry = create(:entry, type_name: 'scrolled', account:, fragment_library: 'shared')
        create(:entry, type_name: 'scrolled', fragment_library: 'shared')

        libraries = FragmentLibrary.all.merge(Pageflow::Entry.where(account:))

        expect(libraries.map(&:id)).to eq([entry.id])
      end

      it 'has fragment library as model' do
        expect(FragmentLibrary.all.model).to eq(FragmentLibrary)
      end
    end

    describe '#chapters' do
      it 'returns chapters of library draft' do
        entry = create(:entry, type_name: 'scrolled', fragment_library: 'shared')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        library = FragmentLibrary.new(Pageflow::DraftEntry.new(entry))

        expect(library.chapters).to eq([chapter])
      end
    end
  end
end
