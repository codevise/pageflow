require 'spec_helper'

feature 'listing entry revisions' do
  scenario 'editor can see revisions on entry site' do
    revision = create(:revision, :published)
    user = Dom::Admin::Page.sign_in_as(:editor)
    create(:membership, :entry => revision.entry, :user => user)

    visit(admin_entry_path(revision.entry))

    expect(Dom::Admin::EntryRevision.first).to be_present
  end
end
