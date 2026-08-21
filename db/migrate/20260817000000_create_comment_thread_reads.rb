class CreateCommentThreadReads < ActiveRecord::Migration[6.0]
  def change
    create_table :pageflow_comment_thread_reads do |t|
      t.integer :entry_id, null: false
      t.integer :user_id, null: false
      t.integer :comment_thread_perma_id, null: false
      t.datetime :read_at, null: false
    end

    add_index :pageflow_comment_thread_reads,
              [:user_id, :entry_id, :comment_thread_perma_id],
              unique: true,
              name: 'index_comment_thread_reads_on_user_and_entry_and_thread'
    add_index :pageflow_comment_thread_reads, :entry_id
  end
end
