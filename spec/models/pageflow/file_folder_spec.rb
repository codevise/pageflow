require 'spec_helper'

module Pageflow
  describe FileFolder do
    it 'generates perma id on create' do
      folder = create(:file_folder)

      expect(folder.perma_id).to be_present
    end

    it 'requires name' do
      folder = build(:file_folder, name: '')

      expect(folder).not_to be_valid
    end

    describe '#parent' do
      it 'returns folder with matching perma id from same revision' do
        revision = create(:revision)
        parent = create(:file_folder, revision:)
        folder = create(:file_folder, revision:, parent_folder_perma_id: parent.perma_id)

        expect(folder.parent).to eq(parent)
      end

      it 'returns nil for folder without parent' do
        folder = create(:file_folder)

        expect(folder.parent).to be_nil
      end

      it 'ignores folders of other revisions' do
        entry = create(:entry)
        other_folder = create(:file_folder, revision: entry.draft)
        folder = create(:file_folder,
                        revision: create(:revision, entry:),
                        parent_folder_perma_id: other_folder.perma_id)

        expect(folder.parent).to be_nil
      end
    end

    describe '#children' do
      it 'returns folders referring to folder as parent' do
        revision = create(:revision)
        folder = create(:file_folder, revision:)
        child = create(:file_folder, revision:, parent_folder_perma_id: folder.perma_id)
        create(:file_folder, revision:)

        expect(folder.children).to eq([child])
      end

      it 'ignores folders of other revisions' do
        entry = create(:entry)
        folder = create(:file_folder, revision: entry.draft)
        create(:file_folder,
               revision: create(:revision, entry:),
               parent_folder_perma_id: folder.perma_id)

        expect(folder.children).to be_empty
      end
    end
  end
end
