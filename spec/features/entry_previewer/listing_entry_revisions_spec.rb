require 'spec_helper'

feature 'as entry previewer, listing entry revisions' do
  scenario 'can see revisions on entry site' do
    revision = create(:revision, :published)
    Dom::Admin::Page.sign_in_as(:previewer, on: revision.entry)

    visit(admin_entry_path(revision.entry))

    expect(Dom::Admin::EntryRevision.first).to be_present
  end
end
