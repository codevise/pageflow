require 'spec_helper'

feature 'as entry publisher, depublishing an entry' do
  scenario 'depublishing published revision' do
    revision = create(:revision, :published)
    Dom::Admin::Page.sign_in_as(:publisher, on: revision.entry)

    visit(admin_entry_path(revision.entry))
    Dom::Admin::EntryPage.first.depublish_button.click

    expect(Dom::Admin::EntryPage.first).not_to be_published
  end
end
