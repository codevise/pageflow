require 'spec_helper'

feature 'account manager sees entries of own account' do
  scenario 'entries of account shows up in entries table' do
    user = Dom::Admin::Page.sign_in_as(:account_manager)
    create(:entry, :account => user.account, :title => 'Entry of Account')

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Entry of Account')).to be_present
  end

  scenario 'entries of other accounts do not show up in entries table' do
    user = Dom::Admin::Page.sign_in_as(:account_manager)
    create(:entry, :title => 'Entry of other Account')

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Entry of other Account')).not_to be_present
  end
end
