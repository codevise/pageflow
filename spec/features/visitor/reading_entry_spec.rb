require 'spec_helper'

feature 'reading entry' do
  scenario 'visitor sees pages of entry' do
    entry = create(:entry, :published)
    chapter = create(:chapter, :revision => entry.published_revision)
    page = create(:page, :chapter => chapter, :template => 'background_image')

    visit(pageflow.entry_path(page.chapter.entry))

    expect(Dom::Page.find_by_template('background_image')).to be_present
  end
end
