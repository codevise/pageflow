module Pageflow
  module EntriesHelper
    def pretty_entry_url(entry)
      if entry.theming.cname.present?
        short_entry_url(entry.to_model, :host => entry.theming.cname)
      else
        short_entry_url(entry.to_model)
      end
    end

    def entry_collection_for_parent(parent)
      if parent.is_a?(User)
        parent.account.entries - parent.entries
      else
        parent.account.entries
      end
    end

    def entry_file_rights(entry)
      [:audio_files, :image_files, :video_files].map do |collection|
        entry.send(collection).map do |file|
          file.rights.presence || entry.account.default_file_rights
        end
      end.flatten.sort.uniq * ', '
    end

    def entry_theme_stylesheet_link_tag(entry)
      stylesheet_link_tag(entry.theming.theme.stylesheet_path, :media => 'all')
    end

    def entry_stylesheet_link_tag(entry)
      stylesheet_link_tag(polymorphic_path(entry.stylesheet_model, :format => 'css'), :media => 'all')
    end

    def entry_mobile_navigation_pages(entry)
      entry.pages.displayed_in_navigation.tap do |pages|
        if entry.pages.any? && !entry.pages.first.display_in_navigation
          pages.unshift(entry.pages.first)
        end
      end
    end

    def entry_header_css_class(entry)
      css_class = 'header'
      if entry.pages.any? && entry.pages.first.configuration['invert']
        css_class += ' invert'
      end
      css_class
    end

    def entry_summary(entry)
      return '' if entry.summary.blank?
      strip_tags(entry.summary.gsub(/<br ?\/?>/, ' ').squish)
    end
  end
end
