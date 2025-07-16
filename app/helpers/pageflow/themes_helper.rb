module Pageflow
  module ThemesHelper # rubocop:todo Style/Documentation
    include RenderJsonHelper

    def themes_options_json_seed(config = Pageflow.config)
      config.themes.each_with_object({}) { |theme, options|
        options[theme.name] = theme.options
      }.to_json.html_safe
    end

    def theme_json_seeds(config)
      render_json_partial('pageflow/themes/theme',
                          collection: config.themes.to_a,
                          as: :theme)
    end
  end
end
