require 'spec_helper'

feature 'account previewer sees entries of own account' do
  scenario 'entries of account shows up in entries table' do
    entry = create(:entry, title: 'Entry of Account')
    Dom::Admin::Page.sign_in_as(:previewer, on: entry.account)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Entry of Account')).to be_present
  end

  scenario 'entries of other accounts do not show up in entries table' do
    create(:entry, title: 'Entry of other Account')
    Dom::Admin::Page.sign_in_as(:account_manager)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Entry of other Account')).not_to be_present
  end
end
