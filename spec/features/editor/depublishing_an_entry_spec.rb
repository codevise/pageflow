require 'spec_helper'

feature 'depublishing an entry' do
  scenario 'depublishing published revision' do
    revision = create(:revision, :published)
    user = Dom::Admin::Page.sign_in_as(:editor)
    create(:membership, :entry => revision.entry, :user => user)

    visit(admin_entry_path(revision.entry))
    Dom::Admin::EntryPage.first.depublish_button.click

    expect(Dom::Admin::EntryPage.first).not_to be_published
  end
end
