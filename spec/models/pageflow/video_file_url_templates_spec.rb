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

    it 'returns template for hls playlist' do
      result = VideoFileUrlTemplates.new.call

      expect(result[:'hls-playlist'])
        .to include('pageflow/video_files/:id_partition/hls-playlist.m3u8')
    end

    it 'returns template for hls playlist with smil suffix' do
      Pageflow.config.zencoder_options[:hls_smil_suffix] = '/master.m3u8'

      result = VideoFileUrlTemplates.new.call

      expect(result[:'hls-playlist'])
        .to include('pageflow/video_files/:id_partition/hls-playlist.smil/master.m3u8')
    end

    it 'supports custom smil playlist name' do
      Pageflow.config.zencoder_options.merge!(
        hls_smil_suffix: '/master.m3u8',
        hls_smil_file_name: 'playlist.csmil'
      )

      result = VideoFileUrlTemplates.new.call

      expect(result[:'hls-playlist'])
        .to include('pageflow/video_files/:id_partition/playlist.csmil/master.m3u8')
    end

    it 'preserves hls qualities placeholder smil playlist name' do
      Pageflow.config.zencoder_options.merge!(
        hls_smil_suffix: '/master.m3u8',
        hls_smil_file_name: ',:pageflow_hls_qualities,mp4.csmil'
      )

      result = VideoFileUrlTemplates.new.call

      expect(result[:'hls-playlist'])
        .to include('pageflow/video_files/:id_partition/' \
                    ',:pageflow_hls_qualities,mp4.csmil/master.m3u8')
    end

    it 'includes original URL with extname placeholder' do
      result = VideoFileUrlTemplates.new.call

      expect(result[:original])
        .to include('pageflow/video_files/attachment_on_s3s/' \
                    ':id_partition/original/:basename.:extension')
    end
  end
end
