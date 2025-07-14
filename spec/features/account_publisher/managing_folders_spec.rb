require 'spec_helper'

feature 'as account publisher, managing folders' do
  scenario 'adding a folder' do
    account = create(:account, name: 'New Folder Account')
    other_account = create(:account, name: 'Other')
    user = Dom::Admin::Page.sign_in_as(:publisher, on: account)
    create(:membership, user:, entity: other_account, role: :publisher)
    new_folder_account = create(:account, with_publisher: user, name: 'New Folder Account')

    visit(admin_entries_path)
    Dom::Admin::FolderPanel.first.add_folder_link.click
    Dom::Admin::FolderForm.first.submit_with(name: 'A new folder', account: new_folder_account)

    visit(admin_entries_path)
    expect(Dom::Admin::FolderPanelItem.find_by_name('A new folder')).to be_present
    expect(Dom::Admin::FolderPanelAccountItem.find_by(account_name: 'New Folder Account')).to be_present
  end

  scenario 'renaming a folder' do
    folder = create(:folder, name: 'A folder')
    Dom::Admin::Page.sign_in_as(:publisher, on: folder.account)

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name('A folder').edit_link.click
    Dom::Admin::FolderForm.first.submit_with(name: 'Renamed folder')

    expect(Dom::Admin::FolderPanelItem.find_by_name('Renamed folder')).to be_present
  end

  scenario 'destroying a folder' do
    folder = create(:folder, name: 'A folder')
    Dom::Admin::Page.sign_in_as(:publisher, on: folder.account)

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name('A folder').delete_link.click

    expect(Dom::Admin::FolderPanelItem.find_by_name('A folder')).not_to be_present
  end
end
