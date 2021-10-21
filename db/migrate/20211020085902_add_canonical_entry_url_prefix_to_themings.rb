class AddCanonicalEntryUrlPrefixToThemings < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_themings, :canonical_entry_url_prefix, :string
  end
end
