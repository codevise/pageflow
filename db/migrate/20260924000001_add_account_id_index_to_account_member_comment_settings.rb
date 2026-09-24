class AddAccountIdIndexToAccountMemberCommentSettings < ActiveRecord::Migration[7.2]
  def change
    add_index :pageflow_account_member_comment_settings,
              [:account_id, :other_entries_notification_level],
              name: 'index_account_member_comment_settings_on_account_and_level'
  end
end
