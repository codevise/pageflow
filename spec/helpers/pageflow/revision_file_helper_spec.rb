require 'spec_helper'

module Pageflow
  describe RevisionFileHelper do
    describe '#find_file_in_entry' do
      it 'raises exception when no entry is set' do
        expect { helper.find_file_in_entry(ImageFile, 1) }.to(
          raise_error('No entry of type PublishedEntry or DraftEntry set.')
        )
      end

      it 'returns nil if file specified by id can not be found' do
        @entry = DraftEntry.new(create(:entry))

        result = helper.find_file_in_entry(ImageFile, 1)
        expect(result).to be_nil
      end

      it 'returns nil if the file with the specified id is not used by the entry' do
        @entry = DraftEntry.new(create(:entry))
        image_file = create(:image_file)

        result = helper.find_file_in_entry(ImageFile, image_file.id)
        expect(result).to be_nil
      end

      context 'draft' do
        it 'finds a file specified by its usages perma_id within the revisions usage scope' do
          entry = create(:entry)
          revision = entry.draft
          image_file = create(:image_file)
          usage = create(:file_usage, revision:, file: image_file)
          @entry = DraftEntry.new(entry)

          result = helper.find_file_in_entry(ImageFile, usage.perma_id)
          expect(result).to eq(image_file)
        end
      end

      context 'published entry' do
        it 'finds a file specified by its usages perma_id within the revisions usage scope' do
          entry = create(:entry)
          revision = create(:revision, :published, entry:)
          image_file = create(:image_file)
          usage = create(:file_usage, revision:, file: image_file)
          @entry = PublishedEntry.new(entry)

          result = helper.find_file_in_entry(ImageFile, usage.perma_id)
          expect(result).to eq(image_file)
        end
      end

      it 'allows passing entry explicitly' do
        entry = create(:entry)
        revision = create(:revision, :published, entry:)
        image_file = create(:image_file)
        usage = create(:file_usage, revision:, file: image_file)
        entry = PublishedEntry.new(entry)

        result = helper.find_file_in_entry(ImageFile, usage.perma_id, entry)
        expect(result).to eq(image_file)
      end
    end
  end
end
