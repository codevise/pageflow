require 'spec_helper'

feature 'as account publisher, adding an entry' do
  scenario 'added entry shows up in entries table' do
    filler_account = create(:account, name: 'Filler Account')
    account = create(:account, name: 'Stock Report')
    account_publisher = Dom::Admin::Page.sign_in_as(:publisher, on: account)
    create(:membership, role: :member, entity: filler_account, user: account_publisher)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).not_to be_present

    Dom::Admin::EntriesPage.first.add_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(title: 'Test Entry', account: account)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present
    expect(Dom::Admin::EntryInIndexTable.find_by_account_name('Stock Report')).to be_present
  end
end
