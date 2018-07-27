class AddMetaFieldsToTheming < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_themings, :default_author, :string
    add_column :pageflow_themings, :default_publisher, :string
    add_column :pageflow_themings, :default_keywords, :string
  end
end
