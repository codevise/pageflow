json.key_format!(camelize: :lower)

json.config do
  json.file_url_templates do
    config_file_url_templates_seed(json, entry_config)
  end
  json.file_model_types do
    config_file_model_types_seed(json, entry_config)
  end

  json.pretty_url pretty_entry_url(entry)
  json.share_url_templates Pageflow::SocialShareLinksHelper::PROVIDER_URL_TEMPLATES

  json.default_file_rights entry.account.default_file_rights

  json.imprint_and_privacy do
    config_imprint_and_privacy_seed(json, entry)
  end
end

unless options[:skip_collections]
  json.collections do
    json.entries do
      json.array!([entry]) do |entry|
        json.call(entry, :id, :share_providers, :share_url, :credits)
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
