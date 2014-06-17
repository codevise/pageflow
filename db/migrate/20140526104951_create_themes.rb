class CreateThemes < ActiveRecord::Migration
  def change
    create_table :pageflow_themes do |t|
      t.string :css_dir, :default => '', :null => false
      t.boolean :global, :default => false, :null => false

      t.timestamps
    end
  end
end
