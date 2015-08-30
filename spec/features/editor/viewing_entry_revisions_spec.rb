require 'spec_helper'

feature 'viewing entry revisions' do
  scenario 'view depublished revision' do
    entry = create(:entry)
    revision = create(:revision, :depublished, :entry => entry)
    storyline = create(:storyline, :revision => revision)
    chapter = create(:chapter, :storyline => storyline)
    create(:page, :chapter => chapter, :template => 'background_image')

    user = Dom::Admin::Page.sign_in_as(:editor)
    create(:membership, :entry => revision.entry, :user => user)

    visit(admin_entry_path(entry))
    Dom::Admin::EntryRevision.first.show_link.click

    expect(Dom::Page.find_by_template('background_image')).to be_present
  end
end
