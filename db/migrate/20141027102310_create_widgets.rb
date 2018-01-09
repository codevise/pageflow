class CreateWidgets < ActiveRecord::Migration[4.2]
  def change
    create_table :pageflow_widgets do |t|
      t.belongs_to :subject, polymorphic: true
      t.string :type_name
      t.string :role

      t.timestamps
    end
  end
end
