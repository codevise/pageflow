class AddFeedsEnabledToSites < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_sites, :feeds_enabled, :boolean
  end
end
