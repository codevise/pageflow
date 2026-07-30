class AddQuoteToComments < ActiveRecord::Migration[7.1]
  def change
    add_column :pageflow_comments, :quote, :text
  end
end
