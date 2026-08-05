class AddAttributeTranslationsToSites < ActiveRecord::Migration[7.1]
  def change
    add_column :pageflow_sites, :attribute_translations, :text
  end
end
