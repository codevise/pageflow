require 'spec_helper'

feature 'managing admins' do
  scenario 'marking a user as admin' do
    pending 'change of admin as role to admin flag on User'
    user = create(:user)

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.edit_user_link.click
    Dom::Admin::UserForm.first.submit_with(:admin => true)

    expect(Dom::Admin::UserPage.first).to have_admin_flag
    fail
  end

  scenario 'marking a user as no longer admin' do
    user = create(:user, :admin)

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.edit_user_link.click
    Dom::Admin::UserForm.first.submit_with(:admin => false)

    expect(Dom::Admin::UserPage.first).not_to have_admin_flag
  end
end
