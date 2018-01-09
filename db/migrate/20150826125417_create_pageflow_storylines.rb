class CreatePageflowStorylines < ActiveRecord::Migration[4.2]
  def change
    create_table :pageflow_storylines do |t|
      t.integer :perma_id
      t.belongs_to :revision, index: true
      t.integer :position
      t.text :configuration

      t.timestamps
    end
  end
end
