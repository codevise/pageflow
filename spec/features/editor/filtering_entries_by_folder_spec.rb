require 'spec_helper'

feature 'editor filtering entries by folder' do
  scenario 'listing entries in a folder' do
    user = Dom::Admin::Page.sign_in_as(:editor)
    folder = create(:folder, :account => user.account)
    entry_in_folder = create(:entry, :account => user.account, :folder => folder)
    entry_not_in_folder = create(:entry, :account => user.account)
    create(:membership, :entry => entry_in_folder, :user => user)
    create(:membership, :entry => entry_not_in_folder, :user => user)

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name(folder.name).link.click

    expect(Dom::Admin::EntryInIndexTable.find_by_title(entry_in_folder.title)).to be_present
    expect(Dom::Admin::EntryInIndexTable.find_by_title(entry_not_in_folder.title)).not_to be_present
  end
end
