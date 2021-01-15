class CreateTestRevisionComponents < ActiveRecord::Migration[4.2]
  def change
    create_table :test_revision_components do |t|
      t.belongs_to :revision
      t.integer :perma_id

      t.string :text
      t.timestamps
    end

    create_table :test_nested_revision_components do |t|
      t.belongs_to :parent
      t.integer :perma_id

      t.string :text
      t.timestamps
    end

    create_table :test_deeply_nested_revision_components do |t|
      t.belongs_to :parent
      t.integer :perma_id

      t.string :text
      t.timestamps
    end
  end
end
