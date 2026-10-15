require 'spec_helper'

feature 'as entry publisher, duplicating an entry' do
  scenario 'entry is duplicated with selected title' do
    entry = create(:entry, title: 'Test Entry')
    Dom::Admin::Page.sign_in_as(:publisher, on: entry)

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.duplicate_button.click
    Dom::Admin::EntryForm.first.submit_with(title: 'My Copy of Test Title')

    expect(Dom::Admin::EntryPage.first.title).to eq('My Copy of Test Title')
  end

  scenario 'leaving duplicate form without submitting' do
    entry = create(:entry, title: 'Test Entry')
    Dom::Admin::Page.sign_in_as(:publisher, on: entry)

    visit(admin_entry_path(entry))

    expect {
      Dom::Admin::EntryPage.first.duplicate_button.click
    }.not_to(change { Pageflow::Entry.count })
  end

  scenario 'entry is duplicated without members' do
    entry = create(:entry, title: 'Test Entry', with_previewer: create(:user))
    Dom::Admin::Page.sign_in_as(:admin)

    visit(admin_entry_path(entry))
    Dom::Admin::EntryPage.first.duplicate_button.click
    Dom::Admin::EntryForm.first.submit_with(title: 'Copy', copy_memberships: false)

    expect(Dom::Admin::EntryPage.first).not_to have_role_flag(:previewer)
  end
end
