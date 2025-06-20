class AddCustom404EntryToSites < ActiveRecord::Migration[7.1]
  def change
    add_reference :pageflow_sites, :custom_404_entry, null: true
  end
end
