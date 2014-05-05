require 'spec_helper'

feature 'account manager inviting a user' do
  scenario 'invited user gains access via invitation email' do
    account = create(:account)
    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)

    visit(admin_users_path)
    Dom::Admin::UserPage.first.invite_user_link.click
    Dom::Admin::UserForm.first.submit_with(:first_name => 'John', :last_name => 'Doe', :email => 'john@example.com')
    visit(MailClient.of('john@example.com').receive_invitation_link)
    Dom::Admin::NewPasswordForm.first.submit_with(:password => '@new12345')

    expect(Dom::Admin::Page).to be_accessible_with(:email => 'john@example.com', :password => '@new12345')
  end

  scenario 're-sending an invitation email' do
    account = create(:account)
    user = create(:user, :account => account, :email => 'john@example.com', :password => '!Pass123')

    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.resend_invitation_link.click
    visit(MailClient.of('john@example.com').receive_invitation_link)
    Dom::Admin::NewPasswordForm.first.submit_with(:password => '@new12345')

    expect(Dom::Admin::Page).to be_accessible_with(:email => 'john@example.com', :password => '@new12345')
  end
end
