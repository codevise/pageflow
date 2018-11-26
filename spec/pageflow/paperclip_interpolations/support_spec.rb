require 'spec_helper'

module Pageflow
  module PaperclipInterpolations
    RSpec.describe Support do
      let(:video_file) { build(:video_file, :uploading) }

      it 'has pageflow_placeholder' do
        result = Support.pageflow_placeholder(video_file.attachment, 'thumbnailxl')

        expect(result).to eq('pageflow/placeholder_thumbnailxl.jpg')
      end

      describe 'pageflow_attachments_version' do
        it 'has value when attachments version present and not :original style' do
          Pageflow.config.paperclip_attachments_version = '303'

          result = Support.pageflow_attachments_version(video_file.attachment, 'thumbnailxl')

          expect(result).to eq('303/')
        end

        it 'is nil for :original style' do
          Pageflow.config.paperclip_attachments_version = '303'

          result = Support.pageflow_attachments_version(video_file.attachment, :original)

          expect(result).to be_nil
        end

        it 'is nil when no attachments version is present' do
          Pageflow.config.paperclip_attachments_version = ''

          result = Support.pageflow_attachments_version(video_file.attachment, 'thumbnailmd')

          expect(result).to be_nil
        end
      end

      it 'has class_basename' do
        result = Support.class_basename(video_file.attachment, 'thumbnailxs')

        expect(result).to eq('video_files')
      end
    end
  end
end
