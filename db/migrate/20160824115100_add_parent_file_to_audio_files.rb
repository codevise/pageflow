class AddParentFileToAudioFiles < ActiveRecord::Migration
  def change
    add_column :pageflow_audio_files, :parent_file_id, :integer
    add_column :pageflow_audio_files, :parent_file_model_type, :string
    add_index :pageflow_audio_files, [:parent_file_id, :parent_file_model_type],
              name: 'index_audio_files_on_parent_id_and_parent_model_type'
  end
end
