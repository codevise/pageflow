# This migration comes from pageflow (originally 20140624135420)
class CreateThemings < ActiveRecord::Migration
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
