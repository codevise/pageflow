require 'spec_helper'

feature 'as entry previewer, viewing entry revisions' do
  scenario 'view depublished revision' do
    revision = create(:revision, :depublished)
    Dom::Admin::Page.sign_in_as(:previewer, on: revision.entry)
    storyline = create(:storyline, revision:)
    chapter = create(:chapter, storyline:)
    create(:page, chapter:, template: 'background_image')

    visit(admin_entry_path(revision.entry))
    Dom::Admin::EntryRevision.first.show_link.click

    expect(Dom::Page.find_by_template('background_image')).to be_present
  end
end
