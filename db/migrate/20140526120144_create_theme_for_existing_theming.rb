class CreateThemeForExistingTheming < ActiveRecord::Migration
  def up
    execute("INSERT INTO pageflow_themes(css_dir, created_at, updated_at) SELECT DISTINCT name, date(0), date(0) FROM pageflow_themings;")
    execute("UPDATE pageflow_themings SET theme_id = (SELECT id FROM pageflow_themes where pageflow_themes.css_dir = pageflow_themings.name);")

#    Theming.all.each do |theming|
#      theme = Theme.find_or_create(:css_dir => theming.name)
#      theming.theme_id = theme.id
#      theming.save!
#    end
  end

end