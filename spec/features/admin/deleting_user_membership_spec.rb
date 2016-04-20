require 'spec_helper'

feature 'deleting user membership from entry' do
  scenario 'delete the membership between entry and user' do
    user = create(:user)
    entry = create(:entry, with_previewer: user)

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_entry_path(entry))

    Dom::Admin::EntryPage.first.delete_member_link('previewer').click

    expect(Dom::Admin::Membership.find_by_user_full_name(user.full_name)).not_to be_present
  end
end
