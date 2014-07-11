require 'spec_helper'

feature 'editor reusing a file', js: true do
  scenario 'from a another entry in account' do
    user = Dom::Admin::Page.sign_in_as(:editor)
    entry = create(:entry, title: 'Test Entry', with_member: user)
    other_entry = create(:entry, title: 'Other Entry', with_member: user)
    file = create(:image_file, used_in: other_entry.draft)

    visit(pageflow.edit_entry_path(entry))
    Dom::Editor::Sidebar.find!.manage_files_menu_item.click
    Dom::Editor::ManageFilesPanel.find!.request_file_reuse
    Dom::Editor::FilesExplorer.find!.select_file(entry, file)

    expect(Dom::Editor::FileItem.find_by_file!(file)).to be_present
  end
end
