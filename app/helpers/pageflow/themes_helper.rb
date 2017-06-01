module Pageflow
  module ThemesHelper
    include RenderJsonHelper

    def themes_options_json_seed(config = Pageflow.config)
      config.themes.each_with_object({}) { |theme, options|
        options[theme.name] = theme.options
      }.to_json.html_safe
    end
  end
end
