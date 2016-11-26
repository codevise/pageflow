require 'spec_helper'

module Pageflow
  describe OriginalHostedFileUrlTemplates do
    it 'returns templates for original' do
      result = OriginalHostedFileUrlTemplates.new(extension: 'vtt').call

      expect(result[:original])
        .to include('pageflow/text_track_files/attachment_on_s3s/' \
                    ':id_partition/original/:basename.vtt')
    end
  end
end
