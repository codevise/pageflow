require 'spec_helper'

feature 'account manager deleting an entry' do
  scenario 'deleting entry of own account' do
    account = create(:account)
    entry = create(:entry, :title => 'Test Entry', :account => account)

    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.delete_entry_link.click

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).not_to be_present
  end
end
