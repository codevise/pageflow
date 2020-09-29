module PageflowScrolled
  # @api private
  module FaviconHelper
    include ThemesHelper

    def scrolled_favicons_for_entry(theme)
      render partial: 'pageflow_scrolled/favicons/entry',
      locals:
      {
        icon_path: scrolled_theme_asset_path(theme, 'favicons/favicon.ico'),
        apple_touch_icon_path: scrolled_theme_asset_path(theme, 'favicons/apple-touch-icon.png'),
        icon_32_path: scrolled_theme_asset_path(theme, 'favicons/favicon-32x32.png'),
        icon_16_path: scrolled_theme_asset_path(theme, 'favicons/favicon-16x16.png'),
        safari_pinned_tab_path: scrolled_theme_asset_path(theme, 'favicons/safari-pinned-tab.svg'),
        webmanifest_path: scrolled_theme_asset_path(theme, 'favicons/site.webmanifest'),
        msapplication_image: scrolled_theme_asset_path(theme, 'favicons/browserconfig.xml'),
        theme_color: theme.options[:theme_color]
      } 
    end
  end
end
