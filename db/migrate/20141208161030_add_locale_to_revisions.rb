class AddLocaleToRevisions < ActiveRecord::Migration
  def change
    add_column :pageflow_revisions, :locale, :string
  end
end
