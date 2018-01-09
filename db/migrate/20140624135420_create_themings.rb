class CreateThemings < ActiveRecord::Migration[4.2]
  def change
    create_table :pageflow_themings do |t|
      t.string :imprint_link_url
      t.string :imprint_link_label
      t.string :copyright_link_url
      t.string :copyright_link_label

      t.belongs_to :account
      t.belongs_to :theme

      t.timestamps
    end
  end
end
