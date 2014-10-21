require 'spec_helper'

module Pageflow
  describe DraftEntry do
    describe '#files' do
      it 'returns files of given type' do
        entry = create(:entry)
        image_file = create(:image_file)
        entry.draft.image_files << image_file
        draft_entry = DraftEntry.new(entry)

        result = draft_entry.files(Pageflow::ImageFile)

        expect(result).to eq([image_file])
      end
    end

    describe '#create_file' do
      it 'creates image_file on draft' do
        entry = create(:entry)
        draft_entry = DraftEntry.new(entry)

        image_file = draft_entry.create_file(ImageFile, {})

        expect(entry.draft.reload).to have(1).image_file
      end

      it 'sets usage_id on created image_file' do
        entry = create(:entry)
        draft_entry = DraftEntry.new(entry)

        image_file = draft_entry.create_file(ImageFile, {})

        expect(image_file.usage_id).to be_present
      end
    end

    describe '#add_file' do
      it 'creates usage for given file' do
        entry = create(:entry)
        draft_entry = DraftEntry.new(entry)
        file = create(:image_file)

        image_file = draft_entry.add_file(file)

        expect(entry.draft).to have(1).image_file
      end
    end

    describe '#remove_file' do
      it 'removes file from files used by draft' do
        entry = create(:entry)
        image_file = create(:image_file)
        entry.draft.image_files << image_file
        draft_entry = DraftEntry.new(entry)

        draft_entry.remove_file(image_file)

        expect(entry.draft).to have(0).image_files
      end

      it 'removes file if no usages are left' do
        entry = create(:entry)
        image_file = create(:image_file)
        entry.draft.image_files << image_file
        draft_entry = DraftEntry.new(entry)

        expect {
          draft_entry.remove_file(image_file)
        }.to change { ImageFile.count }.by(-1)
      end

      it 'does not remove file from other revisions ' do
        entry = create(:entry)
        other_revision = create(:revision, :published, :entry => entry)
        image_file = create(:image_file)
        other_revision.image_files << image_file
        entry.draft.image_files << image_file
        draft_entry = DraftEntry.new(entry)

        draft_entry.remove_file(image_file)

        expect(other_revision).to have(1).image_file
      end
    end

    describe '.accessible_by' do
      it 'delegates to Entry.accessible_by' do
        ability = double('Ability')
        action = :read

        allow(Entry).to receive(:accessible_by).and_return([])

        DraftEntry.accessible_by(ability, action)

        expect(Entry).to have_received(:accessible_by).with(ability, action)
      end

      it 'decorates entries with DraftEntry' do
        draft = build_stubbed(:revision)
        entry = build_stubbed(:entry, :draft => draft)

        allow(Entry).to receive(:accessible_by).and_return([entry])

        result = DraftEntry.accessible_by(double('Ability'), :read)

        expect(result.first).to be_a(DraftEntry)
        expect(result.first.entry).to be(entry)
        expect(result.first.draft).to be(draft)
      end
    end
  end
end
