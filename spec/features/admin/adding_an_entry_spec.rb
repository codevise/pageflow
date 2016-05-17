require 'spec_helper'

feature 'admin adding an entry' do
  scenario 'added entry shows up in entries table' do
    create(:account)
    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).not_to be_present

    Dom::Admin::EntriesPage.first.add_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(title: 'Test Entry')

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present
  end

  scenario 'adding entry for other account' do
    account = create(:account, name: 'other account')
    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_entries_path)
    Dom::Admin::EntriesPage.first.add_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(title: 'Test Entry', account_id: account.id)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry').account_name)
      .to eq(account.name)
  end
end
