class CreatePageflowPermalinkDirectories < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_permalink_directories do |t|
      t.string :path
      t.belongs_to :theming, index: true

      t.timestamps
    end
  end
end
