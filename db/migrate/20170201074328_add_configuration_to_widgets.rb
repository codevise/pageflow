class AddConfigurationToWidgets < ActiveRecord::Migration
  def change
    add_column :pageflow_widgets, :configuration, :text
  end
end
