require 'spec_helper'

feature 'previewer filtering entries by folder' do
  scenario 'listing entries in a folder' do
    folder = create(:folder)
    entry_in_folder = create(:entry, account: folder.account, folder: folder)
    entry_not_in_folder = create(:entry, account: folder.account)
    user = Dom::Admin::Page.sign_in_as(:previewer, on: entry_not_in_folder)
    create(:membership, entry: entry_in_folder, user: user, role: 'previewer')

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name(folder.name).link.click

    expect(Dom::Admin::EntryInIndexTable.find_by_title(entry_in_folder.title)).to be_present
    expect(Dom::Admin::EntryInIndexTable.find_by_title(entry_not_in_folder.title)).not_to be_present
  end
end
