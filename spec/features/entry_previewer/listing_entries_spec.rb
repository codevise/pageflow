feature 'as entry previewer, listing entries' do
  scenario 'only entries show up in entries table on which the user is at least previewer' do
    first_entry = create(:entry, title: 'First Entry')
    create(:entry, title: 'Second Entry')
    Dom::Admin::Page.sign_in_as(:previewer, on: first_entry)

    visit(admin_entries_path)

    expect(Dom::Admin::EntryInIndexTable.find_by_title('First Entry')).to be_present
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Second Entry')).not_to be_present
  end
end
