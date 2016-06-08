require 'spec_helper'

feature 'as system admin, deleting a user' do
  scenario 'deleted user can no longer sign in' do
    user = create(:user, email: 'john@example.com', password: '!Pass123')

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.delete_user_link.click

    expect(Dom::Admin::Page).not_to be_accessible_with(email: 'john@example.com',
                                                       password: '!Pass123')
  end
end
