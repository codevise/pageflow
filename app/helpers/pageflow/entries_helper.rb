module Pageflow
  module EntriesHelper # rubocop:todo Style/Documentation
    def pretty_entry_title(entry)
      return entry.title if entry.site.title == ' '

      [entry.title,
       entry.site.display_title].compact.join(' - ')
    end

    def pretty_entry_url(entry, options = {})
      PrettyUrl.build(pageflow, entry, options)
    end

    # @api private
    module PrettyUrl
      extend self

      def build(routes, entry, options = {})
        with_custom_canonical_url_prefix(entry) ||
          default(routes, entry, options)
      end

      private

      def with_custom_canonical_url_prefix(entry)
        return if entry.site.canonical_entry_url_prefix.blank?

        entry = ensure_entry_with_revision(entry)

        [
          entry.site.canonical_entry_url_prefix.gsub(':locale', entry.locale),
          entry_suffix(entry),
          entry.site.trailing_slash_in_canonical_urls ? '/' : ''
        ].join
      end

      def entry_suffix(entry)
        if entry.permalink.present?
          entry_permalink_parts(entry).join
        else
          entry.to_param
        end
      end

      def default(routes, entry, options)
        params =
          options
          .reverse_merge(trailing_slash: entry.site.trailing_slash_in_canonical_urls)
          .reverse_merge(Pageflow.config_for(entry).public_entry_url_options_for(entry) || {})

        if entry.permalink.present?
          routes.permalink_url(*entry_permalink_parts(entry), params)
        else
          routes.short_entry_url(entry.to_model, params)
        end
      end

      def entry_permalink_parts(entry)
        [
          entry.permalink.directory&.path || '',
          entry.permalink.slug
        ]
      end

      def ensure_entry_with_revision(entry)
        if entry.is_a?(EntryAtRevision)
          entry
        else
          PublishedEntry.new(entry, entry.published_revision || entry.draft)
        end
      end
    end

    def entry_privacy_link_url(entry)
      url = entry.legal_info.privacy_url

      return unless url.present?
      return url if url.start_with?('javascript:')

      "#{url}?lang=#{entry.locale}"
    end

    def entry_file_rights(entry)
      rights = Pageflow.config.file_types.map { |file_type|
        entry.find_files(file_type.model).map do |file|
          file.rights.presence || entry.account.default_file_rights.presence
        end
      }.flatten.compact.sort.uniq

      if rights.any?
        content_tag :p, class: 'rights' do
          "#{I18n.t('pageflow.helpers.entries.image_rights')}: #{rights * ', '}"
        end
      else
        ''
      end
    end

    def entry_global_links(entry) # rubocop:todo Metrics/AbcSize
      legal_info = entry.legal_info

      candidates = [
        [legal_info.imprint.label, legal_info.imprint.url, 'legal'],
        [legal_info.copyright.label, legal_info.copyright.url, 'copy'],
        [I18n.t('pageflow.public.privacy_notice'), entry_privacy_link_url(entry), 'privacy']
      ]

      links = candidates.filter_map do |label, url, css_class|
        next if label.blank? || url.blank?

        link_to(raw(label),
                url,
                target: url.start_with?('javascript:') ? nil : '_blank',
                tabindex: 2,
                class: css_class)
      end

      return '' if links.empty?

      content_tag(:span, I18n.t('pageflow.helpers.entries.global_links'),
                  class: 'hidden') + safe_join(links, ''.html_safe)
    end

    def entry_theme_stylesheet_link_tag(entry)
      stylesheet_link_tag(entry.theme.stylesheet_path,
                          media: 'all',
                          data: {name: 'theme'})
    end

    def entry_stylesheet_link_tag(entry)
      url = pageflow.polymorphic_path(entry.stylesheet_model,
                                      action: :stylesheet,
                                      v: entry.stylesheet_cache_key,
                                      p: Pageflow::VERSION,
                                      format: 'css')

      # We cannot use stylesheet_link_tag here since that always uses
      # the asset host. Entry stylesheet requests are subject to
      # `Configuration#public_entry_request_scope` and
      # `Configuration#public_entry_redirect` which might depend on
      # the hostname.
      tag(:link,
          rel: 'stylesheet',
          href: url,
          media: 'all',
          data: {name: 'entry'})
    end

    def entry_mobile_navigation_pages(entry)
      entry.pages.displayed_in_navigation.tap do |pages|
        if entry.pages.any? && !entry.pages.first.display_in_navigation
          [entry.pages.first, pages].flatten
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
      css_class += ' invert' if entry.pages.any? && entry.pages.first.configuration['invert']
      css_class
    end

    def entry_summary(entry)
      return '' if entry.summary.blank?

      strip_tags(entry.summary.gsub(%r{<br ?/?>}, ' ').squish)
    end
  end
end
