require 'spec_helper'

feature 'as system admin, deleting a user' do
  context 'with multiaccount uses forbidden' do
    scenario 'deleted user can no longer sign in' do
      pageflow_configure do |config|
        config.allow_multiaccount_users = false
      end

      account = create(:account)
      user = create(:user,
                    :member,
                    on: account,
                    email: 'john@example.com',
                    password: '!Pass123')

      Dom::Admin::Page.sign_in_as(:manager, on: account)
      visit(admin_user_path(user))
      Dom::Admin::UserPage.first.delete_user_link.click

      expect(Dom::Admin::Page).not_to be_accessible_with(email: 'john@example.com',
                                                         password: '!Pass123')
    end
  end
end
