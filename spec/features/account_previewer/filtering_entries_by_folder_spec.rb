require 'spec_helper'

feature 'as account previewer, filtering entries by folder' do
  scenario 'listing entries in a folder' do
    folder = create(:folder)
    user = Dom::Admin::Page.sign_in_as(:previewer, on: folder.account)
    entry_in_folder = create(:entry, account: folder.account, folder:, with_previewer: user)
    entry_not_in_folder = create(:entry, account: folder.account, with_previewer: user)

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name(folder.name).link.click

    expect(Dom::Admin::EntryInIndexTable.find_by_title(entry_in_folder.title)).to be_present
    expect(Dom::Admin::EntryInIndexTable.find_by_title(entry_not_in_folder.title)).not_to be_present
  end
end
