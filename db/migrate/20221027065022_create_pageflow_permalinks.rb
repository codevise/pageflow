class CreatePageflowPermalinks < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_permalinks do |t|
      t.string :slug
      t.belongs_to :directory, index: true

      t.timestamps

      t.index ['slug', 'directory_id'], name: 'index_pageflow_peralinks_on_slug', unique: true
    end
  end
end
