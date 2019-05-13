class AddDefaultShareProvidersToThemings < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_themings, :default_share_providers, :text, after: 'default_keywords'
  end
end
