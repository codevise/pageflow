module Pageflow
  module EntriesHelper
    def pretty_entry_title(entry)
      [entry.title, entry.theming.cname_domain.presence].compact.join(' - ')
    end

    def pretty_entry_url(entry, options = {})
      params = options.reverse_merge(Pageflow.config.theming_url_options(entry.theming) || {})
      pageflow.short_entry_url(entry.to_model, params)
    end

    def entry_file_rights(entry)
      rights = Pageflow.config.file_types.map do |file_type|
        entry.find_files(file_type.model).map do |file|
          file.rights.presence || entry.account.default_file_rights.presence
        end
      end.flatten.compact.sort.uniq

      if rights.any?
        content_tag :p, class: 'rights' do
          I18n.t('pageflow.helpers.entries.image_rights') + ": " + rights * ', '
        end
      else
        ''
      end
    end

    def entry_global_links(entry)
      links = []
      if entry.theming.imprint_link_label.present? && entry.theming.imprint_link_url.present?
        links << link_to(raw(entry.theming.imprint_link_label), entry.theming.imprint_link_url, :target => '_blank', :tabindex => 2, :class => 'legal')
      end
      if entry.theming.copyright_link_label.present? && entry.theming.copyright_link_url.present?
        links << link_to(raw(entry.theming.copyright_link_label), entry.theming.copyright_link_url, :target => '_blank', :tabindex => 2, :class => 'copy')
      end

      if links.any?
        content_tag(:h2, I18n.t('pageflow.helpers.entries.global_links'), :class => 'hidden') + safe_join(links, ''.html_safe)
      else
        ''
      end
    end

    def entry_theme_stylesheet_link_tag(entry)
      stylesheet_link_tag(entry.theming.theme.stylesheet_path, :media => 'all')
    end

    def entry_stylesheet_link_tag(entry)
      url = polymorphic_path(entry.stylesheet_model,
                             v: entry.stylesheet_cache_key,
                             p: Pageflow::VERSION,
                             format: 'css')

      stylesheet_link_tag(url,
                          media: 'all',
                          data: {name: 'entry'})
    end

    def entry_mobile_navigation_pages(entry)
      entry.pages.displayed_in_navigation.tap do |pages|
        if entry.pages.any? && !entry.pages.first.display_in_navigation
          pages.unshift(entry.pages.first)
        end
      end
    end

    def entry_css_class(entry)
      [
        present_widgets_css_class(entry),
        entry.emphasize_chapter_beginning ? 'emphasize_chapter_beginning' : nil
      ].compact.join(' ')
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
