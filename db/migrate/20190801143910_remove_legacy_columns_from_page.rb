# removes intermediary columns left over from moving data
class RemoveLegacyColumnsFromPage < ActiveRecord::Migration[5.2]
  def change
    remove_column :pageflow_pages, :legacy_template, :string
    remove_column :pageflow_pages, :legacy_configuration, :text
  end
end
