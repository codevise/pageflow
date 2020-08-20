module PageflowScrolled
  # @api private
  module FaviconHelper
    include ThemesHelper

    def favicons_for_entry(theme)
      render partial: 'pageflow/favicons/entry', locals: theme_favicons_for_entry(theme)
    end

    def theme_favicons_for_entry(theme) 
      {
        icon_path: scrolled_theme_asset_path(theme, 'favicon.ico'),
        apple_touch_icon_path: scrolled_theme_asset_path(theme, 'apple-touch-icon.png'),
        icon_32_path: scrolled_theme_asset_path(theme, 'favicon-32x32.png'),
        icon_16_path: scrolled_theme_asset_path(theme, 'favicon-16x16.png'),
        safari_pinned_tab_path: scrolled_theme_asset_path(theme, 'safari-pinned-tab.svg'),
        webmanifest_path: scrolled_theme_asset_path(theme, 'site.webmanifest')
      }
    end
  end
end
