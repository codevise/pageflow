require 'spec_helper'

feature 'as system admin, viewing all entries' do
  scenario 'all entries show up in entries table if admin is logged in' do
    Dom::Admin::Page.sign_in_as(:admin)

    create(:entry, title: 'First Entry')
    create(:entry, title: 'Second Entry')

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('First Entry')).to be_present
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Second Entry')).to be_present
  end
end
