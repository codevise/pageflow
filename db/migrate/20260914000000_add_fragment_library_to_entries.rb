class AddFragmentLibraryToEntries < ActiveRecord::Migration[7.1]
  def change
    add_column :pageflow_entries, :fragment_library, :string
  end
end
