module PageflowScrolled
  # @api private
  module ThemesHelper
    def scrolled_theme_asset_path(theme, path)
      asset_pack_path("media/pageflow-scrolled/themes/#{theme.name}/#{path}")
    end
  end
end
