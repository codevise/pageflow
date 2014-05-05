feature 'listing entries' do
  scenario 'only entries show up in entries table in which the user is a member' do
    user = Dom::Admin::Page.sign_in_as(:editor)
    first_entry = create(:entry, :title => 'First Entry')
    create(:entry, :title => 'Second Entry')
    create(:membership, :entry => first_entry, :user => user)

    visit(admin_entries_path)

    expect(Dom::Admin::EntryInIndexTable.find_by_title('First Entry')).to be_present
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Second Entry')).not_to be_present
  end
end
