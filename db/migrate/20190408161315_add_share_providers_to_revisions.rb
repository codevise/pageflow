class AddShareProvidersToRevisions < ActiveRecord::Migration[5.2]
  def change
    add_column :pageflow_revisions, :share_providers, :text, after: 'keywords'
  end
end
