module Pageflow
  module ThemesHelper
    def themes_options_json_seed
      Pageflow.config.themes.each_with_object({}) do |theme, options|
        options[theme.name] = theme.options
      end.to_json.html_safe
    end
  end
end
