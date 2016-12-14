require 'spec_helper'

module Pageflow
  describe UploadedFile do
    context 'nesting files' do
      describe 'parent_allows_type_for_nesting validation' do
        it 'returns invalid if nested type is unregistered with parent' do
          entry = create(:entry)
          parent_file = create(:image_file, used_in: entry.draft)

          nested_file = build(:image_file, parent_file: parent_file, entry: entry)

          expect(nested_file).to have(1).error_on(:base)
        end
      end

      describe 'parent_belongs_to_same_entry validation' do
        it 'returns invalid if file entry is not among usage entries of parent' do
          parent_file = create(:video_file)

          nested_file = build(:text_track_file, parent_file: parent_file)

          expect(nested_file).to have(1).error_on(:base)
        end
      end

      describe 'nested file that is valid' do
        it 'returns valid if nested type is registered with parent and among usage entries of '\
           'parent' do
          entry = create(:entry)
          parent_file = create(:video_file, used_in: entry.draft)
          nested_file = create(:text_track_file, parent_file: parent_file, entry: entry)

          expect(nested_file).to be_valid
        end
      end

      it 'returns valid if file is not nested' do
        unnested_file = create(:text_track_file, parent_file: nil)

        expect(unnested_file).to be_valid
      end
    end

    describe '#nested_files' do
      it 'returns nested files of provided class' do
        entry = create(:entry)
        parent_file = create(:video_file, used_in: entry.draft)
        nested_file = create(:text_track_file, parent_file: parent_file, entry: parent_file.entry)

        nested_text_track_files = parent_file.nested_files(TextTrackFile)

        expect(nested_text_track_files.first).to eq(nested_file)
      end
    end
  end
end
