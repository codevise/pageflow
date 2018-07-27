class AddHomeUrlAttributesToThemingsAndRevisions < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_themings, :home_url, :string, default: '', null: false
    add_column :pageflow_themings, :home_button_enabled_by_default, :boolean, default: true, null: false

    add_column :pageflow_revisions, :home_url, :string, default: '', null: false
    add_column :pageflow_revisions, :home_button_enabled, :boolean, default: false, null: false
  end
end
