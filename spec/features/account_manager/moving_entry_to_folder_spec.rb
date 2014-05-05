require 'spec_helper'

feature 'account manager moving entry to folder' do
  scenario 'changing title of entry of own account' do
    account = create(:account)
    entry = create(:entry, :title => 'Test Entry', :account => account)
    folder = create(:folder, :account => account)

    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.edit_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(:folder_id => folder.id)

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name(folder.name).link.click
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present
  end
end
