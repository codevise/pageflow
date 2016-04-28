require 'spec_helper'

feature 'inviting a user' do
  scenario 'invited user gains access to his account via invitation email' do
    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_users_path)
    Dom::Admin::UserPage.first.invite_user_link.click
    Dom::Admin::UserForm.first.submit_with(:first_name => 'John', :last_name => 'Doe', :email => 'john@example.com')
    visit(MailClient.of('john@example.com').receive_invitation_link)
    Dom::Admin::NewPasswordForm.first.submit_with(:password => '@new12345')

    expect(Dom::Admin::Page).to be_accessible_with(:email => 'john@example.com', :password => '@new12345')
  end

  scenario 're-sending an invitation email' do
    user = create(:user, :email => 'john@example.com', :password => '!Pass123')

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.resend_invitation_link.click
    visit(MailClient.of('john@example.com').receive_invitation_link)
    Dom::Admin::NewPasswordForm.first.submit_with(:password => '@new12345')

    expect(Dom::Admin::Page).to be_accessible_with(:email => 'john@example.com', :password => '@new12345')
  end

  scenario 'inviting a user for another account' do
    account = create(:account, :name => 'another account')
    user = create(:user, email: 'existing_user@example.org', first_name: 'Hans')

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_users_path)
    Dom::Admin::UserPage.first.invite_user_link.click
    Dom::Admin::UserForm.first.submit_with(:account_id => account.id, :first_name => 'John', :last_name => 'Doe', :email => 'existing_user@example.org')
    visit(admin_users_path)

    expect(Dom::Admin::UserInIndexTable.find_by_full_name('Hans Doe').account_names).to include(account.name)
  end
end
