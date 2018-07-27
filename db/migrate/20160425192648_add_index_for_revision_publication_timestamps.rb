class AddIndexForRevisionPublicationTimestamps < ActiveRecord::Migration[4.2]
  def change
    add_index 'pageflow_revisions', ['entry_id', 'published_at', 'published_until'], name: 'index_pageflow_revisions_on_publication_timestamps', using: :btree
  end
end
