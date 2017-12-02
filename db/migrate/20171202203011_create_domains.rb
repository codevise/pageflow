class CreateDomains < ActiveRecord::Migration
  def change
    create_table :pageflow_domains do |t|
      t.string :name, default: '', null: false
      t.index :name, unique: true
      t.references :theming, index: true
      t.boolean :primary
    end
  end
end
