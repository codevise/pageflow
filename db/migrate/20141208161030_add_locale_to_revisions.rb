class AddLocaleToRevisions < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_revisions, :locale, :string
  end
end
