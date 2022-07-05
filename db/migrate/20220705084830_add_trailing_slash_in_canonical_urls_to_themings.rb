class AddTrailingSlashInCanonicalUrlsToThemings < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_themings, :trailing_slash_in_canonical_urls, :boolean
  end
end
