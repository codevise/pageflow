require 'spec_helper'

feature 'account manager deleting user membership from entry' do
  scenario 'deleting membership from entry of own account' do
    account = create(:account)
    user = create(:user, :account => account)
    entry = create(:entry, :account => account)
    create(:membership, :user => user, :entry => entry)

    Dom::Admin::Page.sign_in_as(:admin, :account => account)
    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.delete_member_link.click

    expect(Dom::Admin::Membership.find_by_user_full_name(user.full_name)).not_to be_present
  end
end
