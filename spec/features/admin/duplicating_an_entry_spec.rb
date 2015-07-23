require 'spec_helper'

feature 'admin duplicating an entry' do
  scenario 'from other account' do
    entry = create(:entry, :title => 'Test Entry')

    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.duplicate_button.click
    Dom::Admin::EntryForm.first.submit_with(:title => 'My Copy of Test Title')

    expect(Dom::Admin::EntryPage.first.title).to eq('My Copy of Test Title')
  end
end
