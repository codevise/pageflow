class CreatePageflowScrolledLottieFiles < ActiveRecord::Migration[7.1]
  def change
    create_table :pageflow_scrolled_lottie_files do |t|
      t.belongs_to :entry, index: true
      t.belongs_to :uploader, index: true

      t.bigint 'parent_file_id'
      t.string 'parent_file_model_type'

      t.string 'state'
      t.string 'rights'

      t.string 'attachment_on_s3_file_name'
      t.string 'attachment_on_s3_content_type'
      t.bigint 'attachment_on_s3_file_size'
      t.datetime 'attachment_on_s3_updated_at'

      t.timestamps

      t.index ['parent_file_id', 'parent_file_model_type'],
              name: 'index_lottie_files_on_parent_id_and_parent_model_type'
    end
  end
end
