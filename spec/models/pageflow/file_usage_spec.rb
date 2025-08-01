require 'spec_helper'

module Pageflow
  describe FileUsage do
    it 'allows nil display name' do
      file_usage = build(:file_usage,
                         revision: build(:revision, entry: build(:entry)),
                         file: build(:image_file),
                         display_name: nil)

      expect(file_usage).to be_valid
    end

    it 'requires display name extension to match file extension' do
      file = build(:image_file, file_name: 'foo.jpg')
      file_usage = build(:file_usage,
                         revision: build(:revision, entry: build(:entry)),
                         file:,
                         display_name: 'foo.png')

      file_usage.valid?

      expect(file_usage.errors[:display_name].length).to be >= 1
    end
  end
end
