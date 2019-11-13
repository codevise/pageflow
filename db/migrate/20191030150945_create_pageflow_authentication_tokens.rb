class CreatePageflowAuthenticationTokens < ActiveRecord::Migration[5.2]
  def change
    create_table :pageflow_authentication_tokens do |t|
      t.references :user
      t.string :provider
      t.text :auth_token
      t.datetime :expiry_time

      t.timestamps
    end
  end
end
