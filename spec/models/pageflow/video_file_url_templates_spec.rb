require 'spec_helper'

module Pageflow
  describe VideoFileUrlTemplates do
    it 'returns templates for encoded files and poster styles' do
      result = VideoFileUrlTemplates.new.call

      expect(result[:high]).to include('pageflow/video_files/:id_partition/high.mp4')
      expect(result[:poster_large])
        .to include('pageflow/video_files/posters/:id_partition/large/poster-0.JPG')
    end
  end
end
