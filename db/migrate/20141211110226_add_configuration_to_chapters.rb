class AddConfigurationToChapters < ActiveRecord::Migration
  def change
    add_column :pageflow_chapters, :configuration, :text
  end
end
