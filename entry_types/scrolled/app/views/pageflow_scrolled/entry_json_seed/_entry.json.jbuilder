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
    site = entry.site
    json.imprint do
      json.label raw(site.imprint_link_label)
      json.url site.imprint_link_url
    end
    json.copyright do
      json.label raw(site.copyright_link_label)
      json.url site.copyright_link_url
    end
    json.privacy do
      json.label I18n.t('pageflow.public.privacy_notice')
      json.url entry_privacy_link_url(entry)
    end
  end

  json.enabled_feature_names entry.enabled_feature_names
  json.partial!('pageflow_scrolled/entry_json_seed/theme', theme: entry.theme, entry_config:)

  json.additional_seed_data(
    entry_config
      .additional_frontend_seed_data
      .for(entry,
           request,
           include_unused: options[:include_unused_additional_seed_data])
  )

  json.partial!('pageflow_scrolled/entry_json_seed/consent_vendors', entry:, entry_config:)
  json.partial!('pageflow_scrolled/entry_json_seed/entry_translations', entry:)

  json.file_licenses(
    I18n.t('pageflow.file_licenses', default: {}).slice(*entry_config.available_file_licenses)
  )

  json.cut_off entry.cutoff_mode_enabled_for?(request)
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
        json.call(entry, :id, :locale, :share_providers, :share_url, :credits, :configuration)
        json.published_at entry.published_at.try(:iso8601, 0)
        json.permaId entry.id # required as keyAttribute in EntryStateProvider
      end
    end

    json.storylines do
      json.array!(storylines) do |storyline|
        json.partial! 'pageflow_scrolled/storylines/storyline', storyline:
      end
    end

    json.chapters do
      json.array!(chapters) do |chapter|
        json.partial! 'pageflow_scrolled/chapters/chapter', chapter:
      end
    end

    json.sections do
      json.array!(sections) do |section|
        json.partial! 'pageflow_scrolled/sections/section', section:
      end
    end

    json.content_elements do
      json.array!(content_elements) do |content_element|
        json.partial! 'pageflow_scrolled/content_elements/content_element',
                      content_element:
      end
    end

    json.widgets do
      json.array!(widgets) do |widget|
        json.partial! 'pageflow_scrolled/entry_json_seed/widget',
                      widget:
      end
    end

    files_json_seed(json, entry) unless options[:skip_files]
  end
end
