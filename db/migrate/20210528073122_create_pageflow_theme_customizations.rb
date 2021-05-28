class CreatePageflowThemeCustomizations < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_theme_customizations do |t|
      t.references :account
      t.string :entry_type_name
      t.text :overrides

      t.timestamps
    end
  end
end
