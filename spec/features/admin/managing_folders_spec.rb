require 'spec_helper'

feature 'admin managing folders' do
  scenario 'adding a folder to another account' do
    account = create(:account, :name => 'other account')
    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_entries_path)
    Dom::Admin::FolderPanel.first.add_folder_link.click
    Dom::Admin::FolderForm.first.submit_with(:name => 'A new folder', :account_id => account.id)

    visit(admin_entries_path)
    expect(Dom::Admin::FolderPanelItem.find_by_name('A new folder')).to be_present
  end

  scenario 'renaming a folder of other account' do
    user = Dom::Admin::Page.sign_in_as(:admin)
    create(:folder, :name => 'A folder')

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name('A folder').edit_link.click
    Dom::Admin::FolderForm.first.submit_with(:name => 'Renamed folder')

    expect(Dom::Admin::FolderPanelItem.find_by_name('Renamed folder')).to be_present
  end

  scenario 'destroying a folder of other account' do
    user = Dom::Admin::Page.sign_in_as(:admin)
    create(:folder, :name => 'A folder')

    visit(admin_entries_path)
    Dom::Admin::FolderPanelItem.find_by_name('A folder').delete_link.click

    expect(Dom::Admin::FolderPanelItem.find_by_name('A folder')).not_to be_present
  end
end
