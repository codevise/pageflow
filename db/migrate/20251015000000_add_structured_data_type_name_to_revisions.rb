class AddStructuredDataTypeNameToRevisions < ActiveRecord::Migration[6.0]
  def change
    add_column :pageflow_revisions, :structured_data_type_name, :string
  end
end
