require 'spec_helper'

feature 'account manager suspending a user' do
  scenario 'suspended user can not sign in' do
    account = create(:account)
    user = create(:user, :account => account, :email => 'john@example.com', :password => '!Pass123')

    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.suspend_user_link.click

    expect(Dom::Admin::Page).not_to be_accessible_with(:email => 'john@example.com', :password => '!Pass123')
  end

  scenario 'suspended user can not sign in' do
    account = create(:account)
    user = create(:user, :suspended, :account => account, :email => 'john@example.com', :password => '!Pass123')

    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.unsuspend_user_link.click

    expect(Dom::Admin::Page).to be_accessible_with(:email => 'john@example.com', :password => '!Pass123')
  end
end
