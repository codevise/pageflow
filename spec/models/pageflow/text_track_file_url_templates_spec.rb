require 'spec_helper'

module Pageflow
  describe TextTrackFileUrlTemplates do
    it 'returns template for vtt file' do
      result = TextTrackFileUrlTemplates.new.call

      expect(result[:vtt])
        .to include('pageflow/text_track_files/attachment_on_s3s/' \
                    ':id_partition/vtt/:basename.vtt')
    end
  end
end
