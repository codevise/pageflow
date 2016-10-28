require 'spec_helper'

feature 'as visitor, viewing entry embed' do
  scenario 'visitor sees pages of entry' do
    entry = create(:entry, :published)

    visit(pageflow.entry_embed_path(entry))

    expect(page.driver.response.headers).not_to include('X-Frame-Options')
  end
end
