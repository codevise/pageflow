require 'spec_helper'

feature 'as visitor, reading entry' do
  scenario 'visitor sees pages of entry' do
    entry = create(:entry, :published)
    storyline = create(:storyline, revision: entry.published_revision)
    chapter = create(:chapter, storyline: storyline)
    page = create(:page, chapter: chapter, template: 'background_image')

    visit(pageflow.entry_path(page.chapter.entry))

    expect(Dom::Page.find_by_template('background_image')).to be_present
  end

  scenario 'sees the configured home button if supported by theme' do
    entry = create(:entry, :published, published_revision_attributes: {
                     configuration: {
                       home_url: 'http://example.com',
                       home_button_enabled: true
                     }
                   })

    visit(pageflow.entry_path(entry))

    expect(Dom::Navigation.first.home_button_url).to eq('http://example.com')
  end

  scenario 'can change pages', js: true do
    entry = create(:entry, :published)
    storyline = create(:storyline, revision: entry.published_revision)
    chapter = create(:chapter, storyline: storyline)
    create(:page,
           chapter: chapter,
           template: 'background_image',
           configuration: {title: 'Page one'})
    create(:page,
           chapter: chapter,
           template: 'video',
           configuration: {title: 'Page two'})

    visit(pageflow.entry_path(entry))
    entry = Dom::Entry.find!
    entry.wait_until_loading_spinner_disappears
    entry.go_to_next_page

    expect(Dom::Page.active).to have_text('Page two')
  end
end
