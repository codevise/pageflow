class AddFeaturesConfigurationToAccounts < ActiveRecord::Migration
  def change
    add_column :pageflow_accounts, :features_configuration, :text
  end
end
