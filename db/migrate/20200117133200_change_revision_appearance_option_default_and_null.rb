class ChangeRevisionAppearanceOptionDefaultAndNull < ActiveRecord::Migration[5.2]
  def change
    change_column :pageflow_revisions, :emphasize_chapter_beginning, :boolean, default: nil,
                                                                               null: true
    change_column :pageflow_revisions, :emphasize_new_pages, :boolean, default: nil, null: true
    change_column :pageflow_revisions, :home_button_enabled, :boolean, default: nil, null: true
    change_column :pageflow_revisions, :home_url, :string, default: nil, null: true
    change_column :pageflow_revisions, :manual_start, :boolean, default: nil, null: true
    change_column :pageflow_revisions, :overview_button_enabled, :boolean, default: nil, null: true
  end
end
