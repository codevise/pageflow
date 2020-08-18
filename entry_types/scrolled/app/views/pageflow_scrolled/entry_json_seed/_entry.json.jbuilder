json.key_format!(camelize: :lower)

json.config do
  json.file_url_templates do
    config_file_url_templates_seed(json, entry_config)
  end
  json.file_model_types do
    config_file_model_types_seed(json, entry_config)
  end

  json.pretty_url pretty_entry_url(entry)
  json.share_url_templates share_provider_url_templates

  json.default_file_rights entry.account.default_file_rights

  json.legal_info do
    theming = entry.theming
    json.imprint do
      json.label raw(theming.imprint_link_label)
      json.url theming.imprint_link_url
    end
    json.copyright do
      json.label raw(theming.copyright_link_label)
      json.url theming.copyright_link_url
    end
    json.privacy do
      json.label I18n.t('pageflow.public.privacy_notice')
      json.url entry_privacy_link_url(entry)
    end
  end

  json.partial! 'pageflow_scrolled/entry_json_seed/theme', theme: entry.theme
end

unless options[:skip_i18n]
  json.i18n do
    json.default_locale I18n.default_locale
    json.locale I18n.locale
    json.translations scrolled_i18n_translations(entry,
                                                 **options.fetch(:translations, {}))
  end
end

unless options[:skip_collections]
  json.collections do
    json.entries do
      json.array!([entry]) do |entry|
        json.call(entry, :id, :locale, :share_providers, :share_url, :credits)
        json.published_at entry.published_at.try(:iso8601, 0)
        json.permaId entry.id # required as keyAttribute in EntryStateProvider
      end
    end

    json.chapters do
      json.array!(chapters) do |chapter|
        json.partial! 'pageflow_scrolled/chapters/chapter', chapter: chapter
      end
    end

    json.sections do
      json.array!(sections) do |section|
        json.partial! 'pageflow_scrolled/sections/section', section: section
      end
    end

    json.content_elements do
      json.array!(content_elements) do |content_element|
        json.partial! 'pageflow_scrolled/content_elements/content_element',
                      content_element: content_element
      end
    end

    files_json_seed(json, entry) unless options[:skip_files]
  end
end
