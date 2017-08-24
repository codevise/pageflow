require 'spec_helper'

feature 'as account manager, listening users' do
  scenario 'only users from managed accounts show up' do
    account = create(:account)
    create(:user, :member, on: account, first_name: 'Michael', last_name: 'Managed')
    create(:user, first_name: 'Otis', last_name: 'Other')

    Dom::Admin::Page.sign_in_as(:manager, on: account)
    visit(admin_users_path)

    expect(Dom::Admin::UserInIndexTable.find_by_full_name('Michael Managed')).to be_present
    expect(Dom::Admin::UserInIndexTable.find_by_full_name('Otis Other')).not_to be_present
  end
end
