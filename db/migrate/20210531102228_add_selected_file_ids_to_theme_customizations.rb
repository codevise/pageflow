class AddSelectedFileIdsToThemeCustomizations < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_theme_customizations, :selected_file_ids, :text
  end
end
