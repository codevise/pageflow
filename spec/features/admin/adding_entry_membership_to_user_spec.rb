require 'spec_helper'

feature 'adding entry membership to user' do
  scenario 'creating a membership between user and entry of same account' do
    account = create(:account)
    user = create(:user, :account => account)
    entry = create(:entry, :account => account)

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.add_membership_link.click
    Dom::Admin::NewMembershipForm.first.submit_with(:entry_id => entry.id)

    expect(Dom::Admin::Membership.find_by_entry_title(entry.title)).to be_present
  end
end
