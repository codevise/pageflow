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
                     home_url: 'http://example.com',
                     home_button_enabled: true
                   })

    visit(pageflow.entry_path(entry))

    expect(Dom::Navigation.first.home_button_url).to eq('http://example.com')
  end

  scenario 'html head contains a link to the atom feed' do
    entry = create(:entry, :published)

    visit(pageflow.entry_path(entry))

    head = page.find 'head', visible: false
    atom_link_tag = head.find('link[type="application/atom+xml"]', visible: false)

    expect(atom_link_tag).to be_present
    expect(atom_link_tag['href']).to eq(pageflow.entries_url(format: 'atom'))
  end
end
