class CreatePageflowPermalinkRedirects < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_permalink_redirects do |t|
      t.belongs_to :entry, index: true
      t.string :slug
      t.belongs_to :directory, index: true

      t.timestamps

      t.index ['slug', 'directory_id'], name: 'index_pageflow_permalink_redirects_on_slug_and_dir',
                                        unique: true
    end
  end
end
