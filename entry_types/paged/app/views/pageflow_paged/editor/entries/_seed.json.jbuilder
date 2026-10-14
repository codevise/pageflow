theme_stylesheet_paths = Pageflow.config_for(entry).themes.to_h do |theme|
  [theme.name, stylesheet_path(theme.stylesheet_path)]
end

json.theme_stylesheet_paths(theme_stylesheet_paths)
