require 'spec_helper'

feature 'as account previewer, viewing entries of own account' do
  scenario 'entry of account shows up in entries table' do
    entry = create(:entry, title: 'Entry of Account')
    Dom::Admin::Page.sign_in_as(:previewer, on: entry.account)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Entry of Account')).to be_present
  end
end
