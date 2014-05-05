require 'spec_helper'

feature 'account manager adding an entry' do
  scenario 'added entry shows up in entries table' do
    Dom::Admin::Page.sign_in_as(:account_manager)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).not_to be_present

    Dom::Admin::EntriesPage.first.add_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(:title => 'Test Entry')

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present
  end
end
