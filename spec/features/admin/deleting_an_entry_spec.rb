require 'spec_helper'

feature 'deleting an entry' do
  scenario 'deleted entry does no longer exist' do
    entry = create(:entry, :title => 'Test Entry')

    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.delete_entry_link.click

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).not_to be_present
  end
end
