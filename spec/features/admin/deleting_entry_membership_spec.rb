require 'spec_helper'

feature 'deleting entry membership from user' do
  scenario 'delete the membership between user and entry' do
    user = create(:user)
    entry = create(:entry, :title => 'Test Entry')
    create(:membership, :user => user, :entry => entry)

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.delete_membership_link.click

    expect(Dom::Admin::Membership.find_by_entry_title('Test Entry')).not_to be_present
  end
end
