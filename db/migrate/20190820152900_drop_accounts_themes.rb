class DropAccountsThemes < ActiveRecord::Migration[5.2]
  def change
    drop_table :pageflow_accounts_themes, id: false, options: 'ENGINE=InnoDB DEFAULT CHARSET=utf8',
                                          force: :cascade do |t|
      t.integer 'account_id'
      t.integer 'theme_name'
    end
  end
end
