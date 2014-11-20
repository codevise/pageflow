module Pageflow
  module PagesHelper
    def page_css_class(page)
      classes = ['page']
      classes << 'invert' if page.configuration['invert']
      classes << 'hide_title' if page.configuration['hide_title']
      classes << "text_position_#{page.configuration['text_position']}" if page.configuration['text_position'].present?
      classes << 'chapter_beginning' if page.position == 0
      classes.join(' ')
    end

    def page_navigation_css_class(page)
      classes = [page.template]
      classes << 'chapter_beginning' if page.position == 0
      classes << "chapter_#{page.chapter.position}"
      page.chapter.position % 2 == 0 ? classes << 'chapter_even' : classes << 'chapter_odd'
      classes.join(' ')
    end

    def shadow_div(options = {})
      style = options[:opacity] ? "opacity: #{options[:opacity] / 100.0};" : nil
      content_tag(:div, '', :class => 'shadow', :style => style)
    end

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

      content_tag(:div, '', :class => classes.join(' '),
                  :style => "background-position: #{position[:x]}% #{position[:y]}%;")
    end

    def poster_image_tag(video_id, poster_image_id, options = {})
      video_file = VideoFile.find_by_id(video_id)
      poster = ImageFile.find_by_id(poster_image_id)

      if poster
        options = options.merge('data-src' => poster.attachment.url(:medium))
        options = options.merge('data-printsrc' => poster.attachment.url(:print))
      elsif video_file
        options = options.merge('data-src' => video_file.poster.url(:medium))
        options = options.merge('data-printsrc' => video_file.poster.url(:print))
      end

      image_tag('', options)
    end

    def lookup_video_tag(video_id, poster_image_id, options = {})

      defaults = {:class => ['player video-js video-viewport vjs-default-skin', options.delete(:class)].compact * ' ',
        :preload =>  options.delete(:preload) ? 'metadata' : 'none'}

      options.reverse_merge! defaults
      url_options = {:unique_id => options.delete(:unique_id)}

      video_file = VideoFile.find_by_id(video_id)
      poster = ImageFile.find_by_id(poster_image_id)
      mobile_poster = ImageFile.find_by_id(options.delete(:mobile_poster_image_id))

      options[:data] = {}
      script_tag_data = {:template => 'video'}

      if mobile_poster
        options[:data][:mobile_poster] = mobile_poster.attachment.url(:medium)
        options[:data][:mobile_large_poster] = mobile_poster.attachment.url(:large)
      end

      if poster
        options[:data][:poster] = poster.attachment.url(:medium)
        options[:data][:large_poster] = poster.attachment.url(:large)
      elsif video_file
        options[:data][:poster] = video_file.poster.url(:medium)
        options[:data][:large_poster] = video_file.poster.url(:large)
      end

      if video_file && video_file.width.present? && video_file.height.present?
        script_tag_data[:video_width] = options[:data][:width] = video_file.width
        script_tag_data[:video_height] = options[:data][:height] = video_file.height
      end

      render('pageflow/pages/video_tag',
             :video_file => video_file, :script_tag_data => script_tag_data,
             :options => options, :url_options => url_options)
    end

    def video_file_sources(video_file, options = {})
      [{
          :type => 'video/webm',
          :src => video_file.webm_medium.url(options),
          :high_src => video_file.webm_high.url(options)
        },
        {
          :type => 'application/x-mpegURL',
          :src => video_file.hls_playlist.url(options),
          :high_src => video_file.hls_playlist.url(options)
        },
        {
          :type => 'video/mp4',
          :src => video_file.mp4_medium.url(options),
          :high_src => video_file.mp4_high.url(options)
        }]
    end

    def page_media_breakpoints
      {
        :large => :default,
        :medium => 'max-width: 900px'
      }
    end

    def page_thumbnail_item(page_ids, index, layout_name)
      page_ids ||= {}
      page = @entry.pages.find_by_perma_id(page_ids[index.to_s])

      content_tag(:li,
                  page ? page_thumbnail_link(page, page_thumbnail_hero?(index, layout_name)) : '',
                  :data => {:reference_key => index},
                  :class => page ? 'title_hover' : 'title_hover empty')
    end

    def page_thumbnail_hero?(index, layout_name)
      index == {
        'hero_top_left' => 1,
        'hero_top_right' => 1
      }[layout_name]
    end

    def page_thumbnail_link(page, hero = false)
      link_to(content_tag(:span, raw(page.configuration['description']), :class => 'title'),
              "##{page.perma_id}",
              :title => page.title,
              :data => {:page => page.id},
              :class => ['thumbnail', page_thumbnail_image_class(page, hero)] * ' ')
    end

    def page_thumbnail_image_class(page, hero)
      file_thumbnail_css_class(page.thumbnail_file, hero ? :link_thumbnail : :link_thumbnail_large)
    end

    CSS_RENDERED_THUMBNAIL_STYLES = [:link_thumbnail, :link_thumbnail_large]
  end
end
