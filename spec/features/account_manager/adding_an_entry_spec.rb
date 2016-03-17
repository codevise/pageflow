require 'spec_helper'

feature 'adding an entry' do
  scenario 'added entry shows up in entries table for account manager' do
    account = create(:account)
    Dom::Admin::Page.sign_in_as(:account_manager, on: account)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).not_to be_present

    Dom::Admin::EntriesPage.first.add_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(:title => 'Test Entry')

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present
  end

  # scenario 'can add entry for different accounts as account manager of two accounts' do
  #   user = Dom::Admin::Page.sign_in_as(:account_manager)
  #   other_account = FactoryGirl.create(:account)
  #   FactoryGirl.create(:entry, title: 'Test3', account: other_account)
  #   FactoryGirl.create(:membership, user: user, entity: other_account, role: 'manager')

  #   visit(admin_entries_path)
  #   expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).not_to be_present

  #   Dom::Admin::EntriesPage.first.add_entry_link.click
  #   Dom::Admin::EntryForm.first.submit_with(:title => 'Test Entry', account_id: user.account.id)

  #   Dom::Admin::EntriesPage.first.add_entry_link.click
  #   Dom::Admin::EntryForm.first.submit_with(:title => 'Test2 Entry', account_id: other_account.id)

  #   visit(admin_entries_path)
  #   expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present
  #   expect(Dom::Admin::EntryInIndexTable.find_by_title('Test2 Entry')).to be_present
  # end
end
