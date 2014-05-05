require 'spec_helper'

feature 'account manager deleting entry membership from user' do
  scenario 'deleting a membership from a user of own account' do
    account = create(:account)
    user = create(:user, :first_name => 'Bob', :last_name => 'Bobson', :email => 'bob@example.com', :account => account)
    entry = create(:entry, :title => 'Test Entry', :account => account)

    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)
    visit(admin_user_path(user))
    Dom::Admin::UserPage.first.add_membership_link.click
    Dom::Admin::NewMembershipForm.first.submit_with(:entry_id => entry.id)
    expect(Dom::Admin::Membership.find_by_entry_title('Test Entry')).to be_present
    Dom::Admin::UserPage.first.delete_membership_link.click
    expect(Dom::Admin::Membership.find_by_entry_title('Test Entry')).not_to be_present
  end
end
