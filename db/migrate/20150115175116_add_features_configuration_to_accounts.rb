class AddFeaturesConfigurationToAccounts < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_accounts, :features_configuration, :text
  end
end
