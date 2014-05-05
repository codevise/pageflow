require 'spec_helper'

feature 'account manager managing folders' do
  scenario 'adding a folder' do
    Dom::Admin::Page.sign_in_as(:account_manager)

    visit(admin_entries_path)
    Dom::Admin::FolderPanel.first.add_folder_link.click
    Dom::Admin::FolderForm.first.submit_with(:name => 'A new folder')

    visit(admin_entries_path)
    expect(Dom::Admin::FolderPanelItem.find_by_name('A new folder')).to be_present
  end

  scenario 'renaming a folder' do
    user = Dom::Admin::Page.sign_in_as(:account_manager)
    create(:folder, :name => 'A folder', :account => user.account)

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name('A folder').edit_link.click
    Dom::Admin::FolderForm.first.submit_with(:name => 'Renamed folder')

    expect(Dom::Admin::FolderPanelItem.find_by_name('Renamed folder')).to be_present
  end

  scenario 'destroying a folder' do
    user = Dom::Admin::Page.sign_in_as(:account_manager)
    create(:folder, :name => 'A folder', :account => user.account)

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name('A folder').delete_link.click

    expect(Dom::Admin::FolderPanelItem.find_by_name('A folder')).not_to be_present
  end
end
