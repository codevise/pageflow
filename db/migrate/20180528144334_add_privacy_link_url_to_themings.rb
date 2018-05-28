class AddPrivacyLinkUrlToThemings < ActiveRecord::Migration
  def change
    add_column :pageflow_themings, :privacy_link_url, :string
  end
end
