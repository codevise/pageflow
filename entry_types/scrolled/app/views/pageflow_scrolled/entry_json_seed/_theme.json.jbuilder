json.theme do
  json.assets do
    json.logo_desktop scrolled_theme_asset_path(
      theme, 'logoDesktop.svg',
      theme_file_role: :logo_desktop
    )
    json.logo_mobile scrolled_theme_asset_path(
      theme, 'logoMobile.svg',
      theme_file_role: :logo_mobile
    )
    json.logo_dark_variant_desktop scrolled_theme_asset_path(
      theme, 'logoDarkVariantDesktop.svg',
      theme_file_role: :logo_dark_variant_desktop
    )
    json.logo_dark_variant_mobile scrolled_theme_asset_path(
      theme, 'logoDarkVariantMobile.svg',
      theme_file_role: :logo_dark_variant_mobile
    )

    json.unmute scrolled_theme_asset_path(theme, 'unmute.mp3')

    json.icons({})
    json.icons do
      icons_directory = theme.options.fetch(:custom_icons_directory, 'icons')

      theme.options.fetch(:custom_icons, []).each do |icon_name|
        json.set!(icon_name,
                  scrolled_theme_asset_path(theme, File.join(icons_directory, "#{icon_name}.svg"),
                                            relative_url: true))
      end
    end
  end
  json.options(theme.options.deep_transform_keys { |key| key.to_s.camelize(:lower) })
end
