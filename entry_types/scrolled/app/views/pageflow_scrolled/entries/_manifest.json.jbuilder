json.icons do
  json.array! %w[192 512] do |size|
    json.type 'image/png'

    json.src(
      scrolled_theme_asset_path(
        theme,
        "favicons/android-chrome-#{size}x#{size}.png",
        theme_file_role: :favicon_png,
        theme_file_style: :"w#{size}"
      )
    )

    json.sizes "#{size}x#{size}"
  end
end
