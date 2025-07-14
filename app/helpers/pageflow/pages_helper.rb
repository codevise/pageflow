module Pageflow
  module PagesHelper
    def render_page_template(page, locals = {})
      page_type = Pageflow.config.page_types.find_by_name!(page.template)

      render(template: page_type.template_path,
             locals: locals.merge(page:,
                                  configuration: page.configuration))
    end

    def page_css_class(page)
      classes = ['page']
      classes << 'invert' if page.configuration['invert']
      classes << 'hide_title' if page.configuration['hide_title']
      if page.configuration['text_position'].present?
        classes << "text_position_#{page.configuration['text_position']}"
      end
      if page.configuration['scroll_indicator_mode'].present?
        classes << "scroll_indicator_mode_#{page.configuration['scroll_indicator_mode']}"
      end
      if page.configuration['scroll_indicator_orientation'].present?
        classes << "scroll_indicator_orientation_#{page.configuration['scroll_indicator_orientation']}"
      end
      if page.configuration['delayed_text_fade_in'].present?
        classes << "delayed_text_fade_in_#{page.configuration['delayed_text_fade_in']}"
      end
      classes << 'chapter_beginning' if page.position == 0
      classes << 'first_page' if page.is_first
      classes << 'no_text_content' unless page_has_content(page)
      classes << 'hide_logo' if page.configuration['hide_logo']
      classes.join(' ')
    end

    def page_default_content(page)
      safe_join([
                  page_header(page),
                  page_print_image(page),
                  page_text(page)
                ])
    end

    def page_header(page)
      content_tag(:h3, class: 'page_header') do
        safe_join([
                    content_tag(:span, page.configuration['tagline'],
                                class: 'page_header-tagline'),
                    content_tag(:span, page.configuration['title'],
                                class: 'page_header-title'),
                    content_tag(:span, page.configuration['subtitle'],
                                class: 'page_header-subtitle')
                  ])
      end
    end

    def page_print_image(page)
      background_image_tag(page.configuration['background_image_id'], 'class' => 'print_image')
    end

    def page_text(page)
      content_tag(:div, class: 'page_text') do
        content_tag(:div, raw(page.configuration['text']), class: 'paragraph')
      end
    end

    # @api private
    def page_has_content(page)
      has_title = ['title', 'subtitle', 'tagline'].any? do |attribute|
        page.configuration[attribute].present?
      end

      has_text = strip_tags(page.configuration['text']).present?

      (has_title && !page.configuration['hide_title']) || has_text
    end

    def page_navigation_css_class(page)
      classes = [page.template]
      classes << 'chapter_beginning' if page.position == 0
      classes << 'emphasized' if page.configuration['emphasize_in_navigation']
      classes << "chapter_#{page.chapter.position}"
      classes << (page.chapter.position.even? ? 'chapter_even' : 'chapter_odd')
      classes.join(' ')
    end

    def shadow_div(options = {})
      style = options[:opacity] ? "opacity: #{options[:opacity] / 100.0};" : nil
      content_tag(:div, '', class: 'shadow_wrapper') do
        content_tag(:div, '', class: 'shadow', style:)
      end
    end

    def page_media_breakpoints
      {
        desktop: :default,
        mobile: 'max-width: 900px'
      }
    end

    def page_thumbnail_image_class(page, hero)
      file_thumbnail_css_class(page_thumbnail_file(page),
                               hero ? :link_thumbnail_large : :link_thumbnail)
    end

    def page_thumbnail_url(page, *args)
      page_thumbnail_file(page).thumbnail_url(*args)
    end

    def page_thumbnail_file(page)
      ThumbnailFileResolver.new(@entry, page.page_type.thumbnail_candidates, page.configuration)
                           .find_thumbnail
    end
  end
end
