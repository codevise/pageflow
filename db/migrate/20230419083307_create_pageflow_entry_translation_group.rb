class CreatePageflowEntryTranslationGroup < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_entry_translation_groups do |t|
      t.belongs_to :default_translation, index: false
    end

    add_reference(:pageflow_entries, :translation_group)
  end
end
