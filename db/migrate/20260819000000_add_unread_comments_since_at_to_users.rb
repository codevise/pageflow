class AddUnreadCommentsSinceAtToUsers < ActiveRecord::Migration[7.1]
  class MigratedUser < ActiveRecord::Base
    self.table_name = 'users'
  end

  def up
    add_column :users, :unread_comments_since_at, :datetime

    # Comments written before the feature existed have not gone unread:
    # without a baseline, every one of them would turn up as unread for
    # every user at once.
    MigratedUser.update_all(unread_comments_since_at: Time.current)
  end

  def down
    remove_column :users, :unread_comments_since_at
  end
end
