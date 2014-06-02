class AddThemeReferenceToTheming < ActiveRecord::Migration
  def change
    add_reference :pageflow_themings, :theme, :index => true
  end
end