json.theme do
  json.assets do
    json.logo_desktop scrolled_theme_asset_path(theme, 'logoDesktop.svg')
    json.logo_mobile scrolled_theme_asset_path(theme, 'logoMobile.svg')
    json.favicon scrolled_theme_asset_path(theme, 'favicon.ico')
    json.favicon_16 scrolled_theme_asset_path(theme, 'favicon-16x16.png')
    json.favicon_32 scrolled_theme_asset_path(theme, 'favicon-32x32.png')
    json.apple_touch_icon scrolled_theme_asset_path(theme, 'apple-touch-icon.png')
    json.safari_pinned_tab scrolled_theme_asset_path(theme, 'safari-pinned-tab.svg')
    json.site_webmanifest scrolled_theme_asset_path(theme, 'site.webmanifest')
    json.mstile scrolled_theme_asset_path(theme, 'mstile-150x150.png')
    json.android_chrome scrolled_theme_asset_path(theme, 'android-chrome-192x192.png')
    json.android_chrome scrolled_theme_asset_path(theme, 'android-chrome-512x512.png')
  end
  json.options(theme.options.deep_transform_keys { |key| key.to_s.camelize(:lower) })
end
