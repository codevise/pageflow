class AddConfigurationToChapters < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_chapters, :configuration, :text
  end
end
