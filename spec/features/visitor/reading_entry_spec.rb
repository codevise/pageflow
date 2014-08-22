require 'spec_helper'

feature 'reading entry' do
  scenario 'visitor sees pages of entry' do
    entry = create(:entry, :published)
    chapter = create(:chapter, :revision => entry.published_revision)
    page = create(:page, :chapter => chapter, :template => 'background_image')

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
end
