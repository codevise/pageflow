require 'spec_helper'

module Pageflow
  describe ReusableFile do
    context 'nesting files' do
      describe 'parent_allows_type_for_nesting validation' do
        it 'returns invalid if nested type is unregistered with parent' do
          entry = create(:entry)
          parent_file = create(:image_file, used_in: entry.draft)

          nested_file = build(:image_file, parent_file:, entry:)

          expect(nested_file).to have(1).error_on(:base)
        end
      end

      describe 'parent_belongs_to_same_entry validation' do
        it 'returns invalid if file entry is not among usage entries of parent' do
          parent_file = create(:video_file)

          nested_file = build(:text_track_file, parent_file:)

          expect(nested_file).to have(1).error_on(:base)
        end
      end

      describe 'nested file that is valid' do
        it 'returns valid if nested type is registered with parent and among usage entries of '\
           'parent' do
          entry = create(:entry)
          parent_file = create(:video_file, used_in: entry.draft)
          nested_file = create(:text_track_file, parent_file:, entry:)

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
        nested_file = create(:text_track_file, parent_file:, entry: parent_file.entry)

        nested_text_track_files = parent_file.nested_files(TextTrackFile)

        expect(nested_text_track_files.first).to eq(nested_file)
      end
    end

    it 'touches all using revisions when file becomes ready' do
      revision = create(:revision)
      file = create(:image_file, state: 'processing', used_in: revision)

      Timecop.freeze(1.minute.from_now) do
        file.reload.update!(state: 'processed')

        expect(revision.reload.updated_at).to eq(Time.zone.now)
      end
    end

    it 'does not touch usages when file is saved but is not yet ready' do
      revision = create(:revision)
      file = create(:image_file, state: 'processing', used_in: revision)

      Timecop.freeze(1.minute.from_now) do
        expect {
          file.reload.update!(width: 100, height: 200)
        }.not_to(change { revision.reload.updated_at })
      end
    end

    describe '#basename' do
      it 'returns placeholder value' do
        reusable_file = Object.new.extend(ReusableFile)

        expect(reusable_file.basename).to eq('unused')
      end
    end

    describe '#extension' do
      it 'returns placeholder value' do
        reusable_file = Object.new.extend(ReusableFile)

        expect(reusable_file.extension).to eq('unused')
      end
    end
  end
end
