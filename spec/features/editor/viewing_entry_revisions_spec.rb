require 'spec_helper'

feature 'viewing entry revisions' do
  scenario 'view depublished revision' do
    user = Dom::Admin::Page.sign_in_as(:editor)

    entry = create(:entry, with_previewer: user)
    revision = create(:revision, :depublished, entry: entry)
    storyline = create(:storyline, revision: revision)
    chapter = create(:chapter, storyline: storyline)
    create(:page, chapter: chapter, template: 'background_image')

    visit(admin_entry_path(entry))
    Dom::Admin::EntryRevision.first.show_link.click

    expect(Dom::Page.find_by_template('background_image')).to be_present
  end
end
