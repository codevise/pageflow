module Pageflow
  module ThemesHelper # rubocop:todo Style/Documentation
    include RenderJsonHelper

    def themes_options_json_seed(config = Pageflow.config)
      config.themes.to_h { |theme| [theme.name, theme.options] }.to_json.html_safe
    end

    def theme_json_seeds(config, theme_asset_resolver: SprocketsThemeAssetResolver.new)
      render_json_partial('pageflow/themes/theme',
                          collection: config.themes.to_a,
                          as: :theme,
                          theme_asset_resolver:)
    end
  end
end
