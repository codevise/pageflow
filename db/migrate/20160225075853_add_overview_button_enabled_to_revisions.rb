class AddOverviewButtonEnabledToRevisions < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_revisions, :overview_button_enabled, :boolean, default: true, null: false
  end
end
