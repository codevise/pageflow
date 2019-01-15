class AddDefaultLocaleToThemings < ActiveRecord::Migration
  def change
    add_column :pageflow_themings, :default_locale, :string,
               after: 'default_publisher', default: 'de'
  end
end