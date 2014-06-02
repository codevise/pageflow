# This migration comes from pageflow (originally 20140526111538)
class AddThemeReferenceToTheming < ActiveRecord::Migration
  def change
    add_reference :pageflow_themings, :theme, :index => true
  end
end