json.entry_translations do
  json.array!(entry.translations(lambda {
                                   preload(:site, :account)
                                 }, include_noindex: true)) do |translation|
    json.(translation, :id, :locale)
    json.display_locale public_locale_name_for(translation.locale)

    if translation.published_revision?
      json.url social_share_entry_url(translation)
    else
      json.url main_app.preview_admin_entry_path(translation)
    end
  end
end
