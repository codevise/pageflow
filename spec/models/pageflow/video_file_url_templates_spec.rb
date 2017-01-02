require 'spec_helper'

module Pageflow
  describe VideoFileUrlTemplates do
    it 'returns templates for encoded files and poster styles' do
      result = VideoFileUrlTemplates.new.call

      expect(result[:high]).to include('pageflow/video_files/:id_partition/high.mp4')
    end

    it 'returns template for large poster' do
      result = VideoFileUrlTemplates.new.call

      expect(result[:poster_large])
        .to include('pageflow/video_files/posters/:id_partition/large/poster-0.JPG')
    end

    it 'returns template for ultra poster' do
      result = VideoFileUrlTemplates.new.call

      expect(result[:poster_ultra])
        .to include('pageflow/video_files/posters/:id_partition/ultra/poster-0.JPG')
    end
  end
end
