require 'spec_helper'

feature 'as entry editor, editing an entry' do
  scenario 'changing title of entry of own account' do
    entry = create(:entry, title: 'Test Entry')

    Dom::Admin::Page.sign_in_as(:editor, on: entry)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.edit_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(title: 'Test Title')

    expect(Dom::Admin::EntryPage.first.title).to eq('Test Title')
  end
end
