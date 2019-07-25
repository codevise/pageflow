module Pageflow
  module VideoFilesHelper
    include RevisionFileHelper

    def mobile_poster_image_div(config = {})
      classes = ['background', 'background_image']
      position = {x: 50, y: 50}

      if config['mobile_poster_image_id']
        classes << "image_#{config['mobile_poster_image_id']}"
        position[:x] = config['mobile_poster_image_x'] || 50
        position[:y] = config['mobile_poster_image_y'] || 50
      elsif config['poster_image_id']
        classes << "image_#{config['poster_image_id']}"
        position[:x] = config['poster_image_x'] || 50
        position[:y] = config['poster_image_y'] || 50
      elsif config['video_file_id']
        classes << "video_poster_#{config['video_file_id']}"
        position[:x] = config['video_file_x'] || 50
        position[:y] = config['video_file_y'] || 50
      else
        classes << 'video_poster_none'
      end

      content_tag(:div, '',
                  class: classes.join(' '),
                  style: "background-position: #{position[:x]}% #{position[:y]}%;")
    end

    def poster_image_tag(video_file_perma_id, poster_image_perma_id = nil, options = {})
      video_file = find_file_in_entry(VideoFile, video_file_perma_id)
      poster = poster_image_perma_id.present? ? find_file_in_entry(ImageFile, poster_image_perma_id) : nil

      if poster&.ready?
        options = options.merge('data-src' => poster.attachment.url(:medium))
        options = options.merge('data-printsrc' => poster.attachment.url(:print))
      elsif video_file
        options = options.merge('data-src' => video_file.poster.url(:medium))
        options = options.merge('data-printsrc' => video_file.poster.url(:print))
      end

      image_tag('', options)
    end

    def video_file_video_tag(video_file, options = {})
      defaults = {
        crossorigin: 'anonymous',
        class: [
          'player video-js video-viewport vjs-default-skin',
          options.delete(:class)
        ].compact * ' ',
        preload:  options.delete(:preload) ? 'metadata' : 'none'
      }

      options.reverse_merge! defaults
      url_options = {unique_id: options.delete(:unique_id)}

      poster_image_id = options.delete(:poster_image_id)
      poster = poster_image_id.present? ? find_file_in_entry(ImageFile, poster_image_id) : nil
      mobile_poster_image_id = options.delete(:mobile_poster_image_id)
      mobile_poster = mobile_poster_image_id.present? ? find_file_in_entry(ImageFile, mobile_poster_image_id) : nil

      options[:data] = {}

      if mobile_poster&.ready?
        options[:data][:mobile_poster] = mobile_poster.attachment.url(:medium)
        options[:data][:mobile_large_poster] = mobile_poster.attachment.url(:large)
      end

      if poster&.ready?
        options[:data][:poster] = poster.attachment.url(:medium)
        options[:data][:large_poster] = poster.attachment.url(:large)
      elsif video_file
        options[:data][:poster] = video_file.poster.url(:medium)
        options[:data][:large_poster] = video_file.poster.url(:large)
      end

      if video_file && video_file.width.present? && video_file.height.present?
        options[:data][:width] = video_file.width
        options[:data][:height] = video_file.height
      end

      render('pageflow/video_files/video_tag',
             video_file: video_file,
             options: options,
             url_options: url_options)
    end

    # @deprecated
    def lookup_video_tag(video_id, poster_image_id, options = {})
      video_file_script_tag(video_id, options.merge(poster_image_id: poster_image_id))
    end

    def video_file_script_tag(video_file_perma_id, options = {})
      video_file = find_file_in_entry(VideoFile, video_file_perma_id)

      script_tag_data = {template: 'video'}

      if video_file && video_file.width.present? && video_file.height.present?
        script_tag_data[:video_width] = video_file.width
        script_tag_data[:video_height] = video_file.height
      end

      render('pageflow/video_files/script_tag',
             script_tag_data: script_tag_data,
             video_file: video_file,
             options: options)
    end

    def video_file_non_js_link(entry, video_file_perma_id)
      video_file = find_file_in_entry(VideoFile, video_file_perma_id)
      return unless video_file

      link_to(t('pageflow.public.play_video'),
              short_video_file_path(entry, video_file.id),
              class: 'hint')
    end

    def video_file_sources(video_file, options = {})
      [
        {
          type: 'application/x-mpegURL',
          src: video_file.hls_playlist.url(options),
          high_src: video_file.hls_playlist.url(options)
        },
        {
          type: 'video/mp4',
          src: video_file.mp4_medium.url(options),
          high_src: video_file.mp4_high.url(options)
        }
      ]
    end
  end
end
