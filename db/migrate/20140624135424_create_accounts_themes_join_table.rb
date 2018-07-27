class CreateAccountsThemesJoinTable < ActiveRecord::Migration[4.2]
  def change
    create_table :pageflow_accounts_themes, id: false do |t|
      t.belongs_to :account
      t.belongs_to :theme
    end
  end
end
