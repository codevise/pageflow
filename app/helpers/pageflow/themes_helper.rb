module Pageflow
  module ThemesHelper
    include RenderJsonHelper

    def themes_options_json_seed(config = Pageflow.config)
      config.themes.each_with_object({}) do |theme, options|
        options[theme.name] = theme.options
      end.to_json.html_safe
    end
  end
end
