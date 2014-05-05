require 'spec_helper'

feature 'editing an entry' do
  scenario 'changing entry title' do
    entry = create(:entry, :title => 'Test Entry')

    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.edit_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(:title => 'Test Title')

    expect(Dom::Admin::EntryPage.first.title).to eq('Test Title')
  end

  scenario 'changing account' do
    entry = create(:entry, :title => 'Test Entry')
    other_account = create(:account, :name => 'Other Account')

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.edit_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(:account_id => other_account.id)

    expect(Dom::Admin::EntryPage.first.account).to eq(other_account.name)
  end
end
