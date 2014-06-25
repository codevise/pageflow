# This migration comes from pageflow (originally 20140624135424)
class CreateAccountsThemesJoinTable < ActiveRecord::Migration
  def change
    create_table :pageflow_accounts_themes, id: false do |t|
      t.belongs_to :account
      t.belongs_to :theme
    end
  end
end
