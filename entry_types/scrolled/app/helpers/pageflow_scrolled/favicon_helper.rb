module PageflowScrolled
  # @api private
  module FaviconHelper
    include ThemesHelper

    def scrolled_favicons_for_entry(entry)
      render(
        'pageflow_scrolled/favicons/entry',
        manifest_path: pageflow.entry_manifest_path(
          entry,
          format: 'webmanifest'
        ),

        svg_path: entry.theme.files.dig(:favicon, :original),

        png_16_path: scrolled_theme_asset_path(
          entry.theme,
          'favicons/favicon-16x16.png',
          theme_file_role: :favicon_png,
          theme_file_style: :w16
        ),
        png_32_path: scrolled_theme_asset_path(
          entry.theme,
          'favicons/favicon-32x32.png',
          theme_file_role: :favicon_png,
          theme_file_style: :w32
        ),

        apple_touch_icon_path: scrolled_theme_asset_path(
          entry.theme,
          'favicons/apple-touch-icon.png',
          theme_file_role: :favicon_png,
          theme_file_style: :w180
        ),

        ico_path: scrolled_theme_asset_path(
          entry.theme,
          'favicons/favicon.ico',
          theme_file_role: :favicon_ico,
          theme_file_style: :original
        ),

        theme_color: entry.theme.options[:theme_color]
      )
    end
  end
end
