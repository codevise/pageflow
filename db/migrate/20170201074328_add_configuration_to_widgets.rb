class AddConfigurationToWidgets < ActiveRecord::Migration[4.2]
  def change
    add_column :pageflow_widgets, :configuration, :text
  end
end
