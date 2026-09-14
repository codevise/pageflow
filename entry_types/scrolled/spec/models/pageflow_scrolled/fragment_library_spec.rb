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

    describe '.all.find' do
      it 'returns library with id' do
        entry = create(:entry, type_name: 'scrolled', fragment_library: 'shared')

        library = FragmentLibrary.all.find(entry.id)

        expect(library.id).to eq(entry.id)
      end

      it 'raises not found for entry that is not a fragment library' do
        entry = create(:entry, type_name: 'scrolled')

        expect {
          FragmentLibrary.all.find(entry.id)
        }.to raise_error(ActiveRecord::RecordNotFound)
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

    describe '#copy_fragment_to' do
      it 'copies sections of fragment chapter to end of chapter' do
        library_entry = create(:entry, type_name: 'scrolled', fragment_library: 'shared')
        fragment = create(:scrolled_chapter, revision: library_entry.draft)
        create(:section, chapter: fragment, configuration: {'layout' => 'left'})
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        create(:section, chapter:, position: 0)
        library = FragmentLibrary.new(Pageflow::DraftEntry.new(library_entry))

        sections = library.copy_fragment_to(fragment_perma_id: fragment.perma_id,
                                            entry: Pageflow::DraftEntry.new(entry),
                                            chapter:)

        expect(chapter.sections.reload.map(&:configuration))
          .to match([anything, include('layout' => 'left')])
        expect(sections).to eq([chapter.sections.last])
      end

      it 'raises not found for unknown fragment' do
        library_entry = create(:entry, type_name: 'scrolled', fragment_library: 'shared')
        entry = create(:entry, type_name: 'scrolled')
        chapter = create(:scrolled_chapter, revision: entry.draft)
        library = FragmentLibrary.new(Pageflow::DraftEntry.new(library_entry))

        expect {
          library.copy_fragment_to(fragment_perma_id: 404,
                                   entry: Pageflow::DraftEntry.new(entry),
                                   chapter:)
        }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
