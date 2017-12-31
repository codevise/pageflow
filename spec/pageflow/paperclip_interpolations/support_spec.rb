require 'spec_helper'

module Pageflow
  module PaperclipInterpolations
    RSpec.describe Support, type: :model do
      let(:video_file) { build(:video_file, :on_filesystem) }

      it 'has pageflow_placeholder' do
        support = described_class.new(video_file.attachment_on_filesystem, 'thumbnailxl')
        expect(support.pageflow_placeholder).to eq('pageflow/placeholder_thumbnailxl.jpg')
      end

      describe 'pageflow_attachments_version' do
        it 'has value when attachments version present and not :original style' do
          pageflow_configure do |config|
            config.paperclip_attachments_version = '303'
          end

          support = described_class.new(video_file.attachment_on_filesystem, 'thumbnailxl')
          expect(support.pageflow_attachments_version).to eq('303/')
        end

        it 'is nil for :original style' do
          pageflow_configure do |config|
            config.paperclip_attachments_version = '303'
          end

          support = described_class.new(video_file.attachment_on_filesystem, :original)
          expect(support.pageflow_attachments_version).to be_nil
        end

        it 'is nil when no attachments version is present' do
          pageflow_configure do |config|
            config.paperclip_attachments_version = ''
          end

          support = described_class.new(video_file.attachment_on_filesystem, 'thumbnailmd')
          expect(support.pageflow_attachments_version).to be_nil
        end
      end

      it 'has class_basename' do
        support = described_class.new(video_file.attachment_on_filesystem, 'thumbnailxs')
        expect(support.class_basename).to eq('video_files')
      end
    end
  end
end
