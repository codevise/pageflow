require 'spec_helper'

feature 'account manager managing user roles' do
  scenario 'marking a user as account manager' do
    account = create(:account)
    user = create(:user, :account => account)

    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.edit_user_link.click
    Dom::Admin::UserForm.first.submit_with(:account_manager => true)

    expect(Dom::Admin::UserPage.first).to have_account_manager_flag
  end

  # scenario 'marking a user as no longer account manager' do
  #   account = create(:account)
  #   user = create(:user, :account_manager, :account => account)

  #   Dom::Admin::Page.sign_in_as(:account_manager, on: account)
  #   visit(admin_user_path(user))
  #   Dom::Admin::UserPage.first.edit_user_link.click
  #   Dom::Admin::UserForm.first.submit_with(:account_manager => false)

  #   expect(Dom::Admin::UserPage.first).not_to have_account_manager_flag
  # end
end
