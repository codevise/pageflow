class AddDigestIntervalToCommentSettings < ActiveRecord::Migration[7.2]
  def change
    add_column :pageflow_account_comment_settings, :digest_interval, :string
    add_column :pageflow_account_member_comment_settings, :digest_interval, :string
  end
end
