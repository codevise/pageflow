class AddParentFileToVideoFiles < ActiveRecord::Migration
  def change
    add_column :pageflow_video_files, :parent_file_id, :integer
    add_column :pageflow_video_files, :parent_file_model_type, :string
    add_index :pageflow_video_files, [:parent_file_id, :parent_file_model_type],
              name: 'index_video_files_on_parent_id_and_parent_model_type'
  end
end
