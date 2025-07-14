require 'spec_helper'

module Pageflow
  describe UsedFile do
    describe '#cache_key' do
      it 'differs for different file usages' do
        file = create(:image_file)
        used_file = UsedFile.new(
          file,
          create(:file_usage, file:, revision: create(:revision))
        )
        used_file_for_other_usage = UsedFile.new(
          file,
          create(:file_usage, file:, revision: create(:revision))
        )

        expect(used_file.cache_key).not_to eq(used_file_for_other_usage.cache_key)
      end
    end

    describe '#cache_key_with_version' do
      it 'differs for different file usages' do
        file = create(:image_file)
        used_file = UsedFile.new(
          file,
          create(:file_usage, file:, revision: create(:revision))
        )
        used_file_for_other_usage = UsedFile.new(
          file,
          create(:file_usage, file:, revision: create(:revision))
        )

        expect(used_file.cache_key_with_version)
          .not_to eq(used_file_for_other_usage.cache_key_with_version)
      end
    end
  end
end
