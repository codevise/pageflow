class CreateCommentNotificationSettings < ActiveRecord::Migration[7.1]
  def change
    create_table :pageflow_comment_thread_notification_overrides do |t|
      t.integer :user_id, null: false
      t.integer :entry_id, null: false
      t.integer :comment_thread_perma_id, null: false
      t.string :level, null: false
      t.timestamps
    end

    add_index :pageflow_comment_thread_notification_overrides,
              [:user_id, :entry_id, :comment_thread_perma_id],
              unique: true,
              name: 'index_comment_thread_notification_overrides_on_user_and_thread'
    add_index :pageflow_comment_thread_notification_overrides, :entry_id,
              name: 'index_comment_thread_notification_overrides_on_entry_id'

    create_table :pageflow_entry_comment_notification_overrides do |t|
      t.integer :user_id, null: false
      t.integer :entry_id, null: false
      t.string :level, null: false
      t.timestamps
    end

    add_index :pageflow_entry_comment_notification_overrides,
              [:user_id, :entry_id],
              unique: true,
              name: 'index_entry_comment_notification_overrides_on_user_and_entry'
    add_index :pageflow_entry_comment_notification_overrides, :entry_id,
              name: 'index_entry_comment_notification_overrides_on_entry_id'

    create_table :pageflow_account_member_comment_settings do |t|
      t.integer :user_id, null: false
      t.integer :account_id, null: false
      t.string :assigned_entries_notification_level
      t.string :other_entries_notification_level
      t.timestamps
    end

    add_index :pageflow_account_member_comment_settings,
              [:user_id, :account_id],
              unique: true,
              name: 'index_account_member_comment_settings_on_user_and_account'

    create_table :pageflow_account_comment_settings do |t|
      t.integer :account_id, null: false
      t.string :assigned_entries_notification_level
      t.string :other_entries_notification_level
      t.timestamps
    end

    add_index :pageflow_account_comment_settings, :account_id, unique: true
  end
end
