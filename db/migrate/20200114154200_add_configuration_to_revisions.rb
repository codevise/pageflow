class AddConfigurationToRevisions < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_revisions, :configuration, :text
  end
end
