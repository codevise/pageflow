require 'spec_helper'

module Pageflow
  describe UrlTemplate do
    describe '.from_attachment' do
      let(:video_file) { create(:video_file, :on_filesystem) }

      it 'returns url with :id_partition placeholder' do
        VideoFile.has_attached_file :attachment_on_filesystem, {
          url: '/:class/:attachment/:id_partition/:style/:filename'
        }
        result = described_class.from_attachment(video_file.attachment_on_filesystem)

        expect(result).to eq('/pageflow/video_files/attachment_on_filesystems/:id_partition/original/video.mp4?1356994800')
      end

      it 'only replaces last set of digits' do
        VideoFile.has_attached_file :attachment_on_filesystem, {
          url: '/123/:class/:id_partition/:style/:filename'
        }
        result = described_class.from_attachment(video_file.attachment_on_filesystem)

        expect(result).to eq('/123/pageflow/video_files/:id_partition/original/video.mp4?1356994800')
      end

      it 'ignores other numeric values in url pattern' do
        VideoFile.has_attached_file :attachment_on_filesystem, {
          url: '/_a123/_e1001/:class/:id_partition/:style/:filename'
        }
        result = described_class.from_attachment(video_file.attachment_on_filesystem)

        expect(result).to eq('/_a123/_e1001/pageflow/video_files/:id_partition/original/video.mp4?1356994800')
      end

      it 'ignores numeric file names' do
        VideoFile.has_attached_file :attachment_on_filesystem, {
          url: '/:class/:id_partition/:style/:filename',
          filename: '123'
        }
        video_file = create(:video_file, :numeric_filename_on_filesystem)
        result = described_class.from_attachment(video_file.attachment_on_filesystem)

        expect(result).to eq('/pageflow/video_files/:id_partition/original/123.mp4?1356994800')
      end
    end
  end
end
