content_element_vendors =
  entry_config.content_element_consent_vendors.by_content_element_id(entry)

json.content_element_consent_vendors(content_element_vendors)

I18n.with_locale(entry.locale) do
  json.consent_vendors do
    json.array!(content_element_vendors.values.uniq) do |name|
      json.name name
      json.display_name t("pageflow_scrolled.consent_vendors.#{name}.name")
      json.description t("pageflow_scrolled.consent_vendors.#{name}.description")
      json.opt_in_prompt t("pageflow_scrolled.consent_vendors.#{name}.opt_in_prompt")
      json.paradigm 'lazy opt-in'
    end
  end
end
