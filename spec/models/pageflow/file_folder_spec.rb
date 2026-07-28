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

    it 'allows parent folder from same revision' do
      revision = create(:revision)
      parent = create(:file_folder, revision:)
      folder = build(:file_folder, revision:, parent_folder_perma_id: parent.perma_id)

      expect(folder).to be_valid
    end

    it 'requires parent folder perma id to refer to folder of same revision' do
      entry = create(:entry)
      other_folder = create(:file_folder, revision: entry.draft)
      folder = build(:file_folder,
                     revision: create(:revision, entry:),
                     parent_folder_perma_id: other_folder.perma_id)

      folder.valid?

      expect(folder.errors[:parent_folder_perma_id].length).to be >= 1
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

      # Data which the validation prevents from being created in the
      # first place.
      it 'ignores folders of other revisions' do
        entry = create(:entry)
        other_folder = create(:file_folder, revision: entry.draft)
        folder = build(:file_folder,
                       revision: create(:revision, entry:),
                       parent_folder_perma_id: other_folder.perma_id)
        folder.save!(validate: false)

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
        build(:file_folder,
              revision: create(:revision, entry:),
              parent_folder_perma_id: folder.perma_id).save!(validate: false)

        expect(folder.children).to be_empty
      end
    end
  end
end
