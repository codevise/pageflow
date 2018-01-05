require 'spec_helper'

feature 'as account manager, suspending a user' do
  context 'with multiaccount users forbidden' do
    scenario 'suspended user can not sign in' do
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
      Dom::Admin::UserPage.first.suspend_user_link.click

      expect(Dom::Admin::Page).not_to be_accessible_with(email: 'john@example.com',
                                                         password: '!Pass123')
    end

    scenario 'unsuspended user can sign in' do
      pageflow_configure do |config|
        config.allow_multiaccount_users = false
      end

      account = create(:account)
      user = create(:user,
                    :suspended,
                    :member,
                    on: account,
                    email: 'john@example.com',
                    password: '!Pass123')

      Dom::Admin::Page.sign_in_as(:manager, on: account)
      visit(admin_user_path(user))
      Dom::Admin::UserPage.first.unsuspend_user_link.click

      expect(Dom::Admin::Page).to be_accessible_with(email: 'john@example.com',
                                                     password: '!Pass123')
    end
  end
end
