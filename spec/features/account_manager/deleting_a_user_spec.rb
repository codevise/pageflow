require 'spec_helper'

feature 'account manager deleting a user' do
  scenario 'deleting user of own account' do
    pending 'User invite feature getting finished'
    account = create(:account)
    user = create(:user, :email => 'john@example.com', :password => '!Pass123', :account => account)

    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.delete_user_link.click

    expect(Dom::Admin::Page).not_to be_accessible_with(:email => 'john@example.com', :password => '!Pass123')
    fail
  end
end
