json.theme do
  json.assets do
    json.logo_desktop scrolled_theme_asset_path(theme, 'logoDesktop.svg',
                                                theme_file_role: :logo_desktop)
    json.logo_mobile scrolled_theme_asset_path(theme, 'logoMobile.svg',
                                               theme_file_role: :logo_mobile)
    json.unmute scrolled_theme_asset_path(theme, 'unmute.mp3')

    json.icons({})
    json.icons do
      theme.options.fetch(:custom_icons, []).each do |icon_name|
        json.set!(icon_name,
                  scrolled_theme_asset_path(theme, "icons/#{icon_name}.svg",
                                            relative_url: true))
      end
    end
  end
  json.options(theme.options.deep_transform_keys { |key| key.to_s.camelize(:lower) })
end
