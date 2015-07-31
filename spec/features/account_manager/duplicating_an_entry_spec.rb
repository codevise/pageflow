require 'spec_helper'

feature 'account manager duplicating an entry' do
  scenario 'from own account' do
    account = create(:account)
    entry = create(:entry, :title => 'Test Entry', :account => account)

    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.duplicate_button.click
    Dom::Admin::EntryForm.first.submit_with(:title => 'My Copy of Test Title')

    expect(Dom::Admin::EntryPage.first.title).to eq('My Copy of Test Title')
  end
end
