require 'spec_helper'

feature 'adding user membership to entry' do
  scenario 'creating a membership between entry and user of same account' do
    user = create(:user, first_name: 'Paul')
    account = create(:account, with_member: user)
    entry = create(:entry, account: account)

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.add_member_link.click
    Dom::Admin::MembershipForm.first.submit_with(:user_id => user.id)

    expect(Dom::Admin::Membership.find_by_user_full_name(user.formal_name)).to be_present
  end
end
