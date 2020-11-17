json.theme do
  json.assets do
    json.logo_desktop scrolled_theme_asset_path(theme, 'logoDesktop.svg')
    json.logo_mobile scrolled_theme_asset_path(theme, 'logoMobile.svg')
    json.unmute scrolled_theme_asset_path(theme, 'unmute.mp3')
  end
  json.options(theme.options.deep_transform_keys { |key| key.to_s.camelize(:lower) })
end
