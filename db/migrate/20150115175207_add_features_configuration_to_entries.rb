class AddFeaturesConfigurationToEntries < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_entries, :features_configuration, :text
  end
end
