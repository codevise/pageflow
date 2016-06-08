require 'spec_helper'

feature 'as account manager, inviting a user' do
  scenario 'invited user gains access via invitation email' do
    account = create(:account)
    Dom::Admin::Page.sign_in_as(:manager, on: account)

    visit(admin_users_path)
    Dom::Admin::UserPage.first.invite_user_link.click
    Dom::Admin::UserForm.first.submit_with(first_name: 'John',
                                           last_name: 'Doe',
                                           email: 'sepp@example.com')
    visit(MailClient.of('sepp@example.com').receive_invitation_link)
    Dom::Admin::NewPasswordForm.first.submit_with(password: '@new12345')

    expect(Dom::Admin::Page).to be_accessible_with(email: 'sepp@example.com', password: '@new12345')
  end

  scenario 're-sending an invitation email' do
    account = create(:account)
    user = create(:user, :member, on: account, email: 'heinz@example.com', password: '!Pass123')

    Dom::Admin::Page.sign_in_as(:manager, on: account)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.resend_invitation_link.click
    visit(MailClient.of('heinz@example.com').receive_invitation_link)
    Dom::Admin::NewPasswordForm.first.submit_with(password: '@new12345')

    expect(Dom::Admin::Page).to be_accessible_with(email: 'heinz@example.com',
                                                   password: '@new12345')
  end

  scenario 'inviting a user for another account' do
    account = create(:account, name: 'another account')
    create(:user, email: 'existing_user@example.org', first_name: 'Walter', last_name: 'Doe')

    Dom::Admin::Page.sign_in_as(:manager, on: account)
    visit(admin_users_path)
    Dom::Admin::UserPage.first.invite_user_link.click
    Dom::Admin::UserForm.first.submit_with(account_id: account.id,
                                           first_name: 'John',
                                           last_name: 'Doe',
                                           email: 'existing_user@example.org')
    visit(admin_users_path)

    expect(Dom::Admin::UserInIndexTable.find_by_full_name('Walter Doe').account_names)
      .to include(account.name)
  end
end
