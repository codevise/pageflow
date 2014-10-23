class CreateTestRevisionComponent < ActiveRecord::Migration
  def change
    create_table :test_revision_components do |t|
      t.belongs_to :revision
      t.integer :perma_id

      t.string :text
    end
  end
end
