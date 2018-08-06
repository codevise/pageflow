module Pageflow
  module PagesHelper
    def render_page_template(page, locals = {})
      page_type = Pageflow.config.page_types.find_by_name!(page.template)

      render(template: page_type.template_path,
             locals: locals.merge(page: page,
                                  configuration: page.configuration))
    end

    def page_css_class(page)
      classes = ['page']
      classes << 'invert' if page.configuration['invert']
      classes << 'hide_title' if page.configuration['hide_title']
      classes << "text_position_#{page.configuration['text_position']}" if page.configuration['text_position'].present?
      classes << "scroll_indicator_mode_#{page.configuration['scroll_indicator_mode']}" if page.configuration['scroll_indicator_mode'].present?
      classes << "scroll_indicator_orientation_#{page.configuration['scroll_indicator_orientation']}" if page.configuration['scroll_indicator_orientation'].present?
      classes << "delayed_text_fade_in_#{page.configuration['delayed_text_fade_in']}" if page.configuration['delayed_text_fade_in'].present?
      classes << 'chapter_beginning' if page.position == 0
      classes << 'no_text_content' if !page_has_content(page)
      classes.join(' ')
    end

    # @api private
    def page_has_content(page)
      has_title = ['title','subtitle','tagline'].any? do |attribute|
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
      page.chapter.position % 2 == 0 ? classes << 'chapter_even' : classes << 'chapter_odd'
      classes.join(' ')
    end

    def shadow_div(options = {})
      style = options[:opacity] ? "opacity: #{options[:opacity] / 100.0};" : nil
      content_tag(:div, '', :class => 'shadow_wrapper') do
        content_tag(:div, '', :class => 'shadow', :style => style)
      end
    end

    def page_media_breakpoints
      {
        :large => :default,
        :medium => 'max-width: 900px'
      }
    end

    def page_thumbnail_image_class(page, hero)
      file_thumbnail_css_class(page.thumbnail_file, hero ? :link_thumbnail_large : :link_thumbnail)
    end
  end
end
