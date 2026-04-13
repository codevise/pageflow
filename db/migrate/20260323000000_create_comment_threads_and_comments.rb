class CreateCommentThreadsAndComments < ActiveRecord::Migration[6.0]
  def change
    create_table :pageflow_comment_threads do |t|
      t.integer :revision_id, null: false
      t.integer :perma_id
      t.string :subject_type, null: false
      t.integer :subject_id, null: false
      t.integer :creator_id, null: false
      t.datetime :resolved_at
      t.integer :resolved_by_id
      t.timestamps
    end

    add_index :pageflow_comment_threads, :revision_id
    add_index :pageflow_comment_threads, :creator_id
    add_index :pageflow_comment_threads, [:revision_id, :subject_type, :subject_id],
              name: 'index_comment_threads_on_revision_and_subject'

    create_table :pageflow_comments do |t|
      t.integer :comment_thread_id, null: false
      t.integer :perma_id
      t.integer :creator_id, null: false
      t.text :body, null: false
      t.timestamps
    end

    add_index :pageflow_comments, :comment_thread_id
    add_index :pageflow_comments, :creator_id
  end
end
