require 'spec_helper'

feature 'deleting own user' do
  scenario 'user is deleted per default configuration' do
    create(:user, email: 'john@example.com', password: '@qwert12345')

    Dom::Admin::Page.sign_in(email: 'john@example.com', password: '@qwert12345')
    visit('/admin/users/me')
    Dom::Admin::ProfileForm.first.delete_account_link.click
    Dom::Admin::DeleteAccountForm.first.submit_with(current_password: '@qwert12345')

    expect(Dom::Admin::Page).not_to be_accessible_with(email: 'john@example.com',
                                                       password: '@new12345')
  end
end
