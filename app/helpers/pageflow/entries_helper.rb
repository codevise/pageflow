module Pageflow
  module EntriesHelper
    def pretty_entry_title(entry)
      [entry.title, entry.theming.cname_domain.presence].compact.join(' - ')
    end

    def pretty_entry_url(entry, options = {})
      PrettyUrl.build(pageflow, entry, options)
    end

    # @api private
    module PrettyUrl
      extend self

      def build(routes, entry, options)
        with_custom_canonical_url_prefix(entry) ||
          default(routes, entry, options)
      end

      private

      def with_custom_canonical_url_prefix(entry)
        return if entry.theming.canonical_entry_url_prefix.blank?
        entry = ensure_entry_with_revision(entry)

        [
          entry.theming.canonical_entry_url_prefix.gsub(':locale', entry.locale),
          entry.to_param,
          entry.theming.trailing_slash_in_canonical_urls ? '/' : ''
        ].join
      end

      def default(routes, entry, options)
        params =
          options
          .reverse_merge(trailing_slash: entry.theming.trailing_slash_in_canonical_urls)
          .reverse_merge(Pageflow.config.theming_url_options(entry.theming) || {})

        if entry.permalink.present?
          routes.permalink_url(
            entry.permalink.directory&.path || '',
            entry.permalink.slug,
            params
          )
        else
          routes.short_entry_url(entry.to_model, params)
        end
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
      return unless entry.theming.privacy_link_url.present?
      "#{entry.theming.privacy_link_url}?lang=#{entry.locale}"
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
        links << link_to(raw(entry.theming.imprint_link_label),
                         entry.theming.imprint_link_url,
                         target: '_blank',
                         tabindex: 2,
                         class: 'legal')
      end

      if entry.theming.copyright_link_label.present? && entry.theming.copyright_link_url.present?
        links << link_to(raw(entry.theming.copyright_link_label),
                         entry.theming.copyright_link_url,
                         target: '_blank',
                         tabindex: 2,
                         class: 'copy')
      end

      if entry.theming.privacy_link_url.present?
        links << link_to(I18n.t('pageflow.public.privacy_notice'),
                         entry_privacy_link_url(entry),
                         target: '_blank',
                         tabindex: 2,
                         class: 'privacy')
      end

      if links.any?
        content_tag(:span, I18n.t('pageflow.helpers.entries.global_links'), class: 'hidden') + safe_join(links, ''.html_safe)
      else
        ''
      end
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
