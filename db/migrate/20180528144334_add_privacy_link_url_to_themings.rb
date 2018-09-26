class AddPrivacyLinkUrlToThemings < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_themings, :privacy_link_url, :string
  end
end
