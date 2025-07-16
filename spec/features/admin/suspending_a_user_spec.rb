require 'spec_helper'

feature 'as system admin, suspending a user' do
  scenario 'suspended user can not sign in' do
    user = create(:user, email: 'john@example.com', password: '!Pass123')

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.suspend_user_link.click

    expect(Dom::Admin::Page).not_to be_accessible_with(email: 'john@example.com',
                                                       password: '!Pass123')
  end

  scenario 'unsuspended user can sign in' do
    user = create(:user, :suspended, email: 'john@example.com', password: '!Pass123')

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.unsuspend_user_link.click

    expect(Dom::Admin::Page).to be_accessible_with(email: 'john@example.com', password: '!Pass123')
  end
end
