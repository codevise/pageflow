require 'spec_helper'

feature 'as account publisher, moving entry to folder' do
  scenario 'folder of entry is changed' do
    folder = create(:folder)
    Dom::Admin::Page.sign_in_as(:publisher, on: folder.account)
    entry = create(:entry, title: 'Test Entry', account: folder.account)

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.edit_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(folder_id: folder.id)

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name(folder.name).link.click
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present
  end
end
