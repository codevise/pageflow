json.key_format!(camelize: :lower)

json.config do
  json.file_url_templates do
    config_file_url_templates_seed(json, entry_config)
  end
  json.file_model_types do
    config_file_model_types_seed(json, entry_config)
  end
end

unless options[:skip_collections]
  json.collections do
    json.entries do
      json.array!([entry]) do |entry|
        json.call(entry, :id, :share_providers)
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

json.imprintAndPrivacy do
  json.credits raw(entry.credits)
  json.fileRights entry_file_rights(entry)
  json.imprint do
    json.imprintLinkLabel entry.theming.imprint_link_label
    json.imprintLinkUrl entry.theming.imprint_link_url
  end
  json.copyright do
    json.copyrightLinkLabel raw entry.theming.copyright_link_label
    json.copyrightLinkUrl entry.theming.copyright_link_url
  end
  json.privacy do
    json.privacyLinkLabel I18n.t('pageflow.public.privacy_notice')
    json.privacyLinkUrl "#{entry.theming.privacy_link_url}?lang=#{entry.locale}"
  end
end

json.shareLinks do
  json.array!(entry.share_providers) do |provider, active|
    next unless active
    json.partial! 'pageflow_scrolled/entry_json_seed/share_provider_config',
                  entry: entry,
                  provider: provider.to_sym
  end
end
