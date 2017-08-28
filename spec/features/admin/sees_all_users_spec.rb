require 'spec_helper'

feature 'as system admin, viewing all users' do
  scenario 'all users show up in users table' do
    create(:user,
           first_name: 'John',
           last_name: 'Doe',
           email: 'john@example.com')

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_users_path)

    expect(Dom::Admin::UserInIndexTable.find_by_full_name('John Doe')).to be_present
  end
end
