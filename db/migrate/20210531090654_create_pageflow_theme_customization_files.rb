class CreatePageflowThemeCustomizationFiles < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_theme_customization_files do |t|
      t.references :theme_customization,
                   index: {name: 'index_pageflow_theme_customization_files_on_customization'}
      t.string :type_name
      t.string :attachment_file_name
      t.string :attachment_content_type
      t.integer :attachment_file_size
      t.datetime :attachment_updated_at

      t.timestamps
    end
  end
end
