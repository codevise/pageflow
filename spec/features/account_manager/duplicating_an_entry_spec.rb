require 'spec_helper'

feature 'duplicating an entry' do
  scenario 'as publisher of entry' do
    user = Dom::Admin::Page.sign_in_as(:editor)

    entry = create(:entry, with_publisher: user, title: 'Test Entry')

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.duplicate_button.click
    Dom::Admin::EntryForm.first.submit_with(title: 'My Copy of Test Title')

    expect(Dom::Admin::EntryPage.first.title).to eq('My Copy of Test Title')
  end
end
