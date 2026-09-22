class CreateCommentDigestWatermarks < ActiveRecord::Migration[7.2]
  def change
    create_table :pageflow_comment_digest_watermarks do |t|
      t.integer :entry_id, null: false
      t.datetime :considered_up_to, null: false
    end

    add_index :pageflow_comment_digest_watermarks, :entry_id, unique: true
  end
end
