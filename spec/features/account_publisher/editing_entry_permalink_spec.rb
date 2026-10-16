require 'spec_helper'

feature 'as account publisher, editing entry permalink' do
  scenario 'slug placeholder does not treat own slug as taken', js: true do
    account = create(:account)
    de_directory = create(:permalink_directory, site: account.default_site, path: 'de/')
    en_directory = create(:permalink_directory, site: account.default_site, path: 'en/')
    entry = create(:entry,
                   account:,
                   title: 'Some Title',
                   permalink_attributes: {slug: 'some-title', directory: en_directory})
    create(:entry,
           account:,
           permalink_attributes: {slug: 'some-title', directory: de_directory})
    Dom::Admin::Page.sign_in_as(:publisher, on: account)

    visit(edit_admin_entry_path(entry))
    fill_in('entry_permalink_attributes_slug', with: '')
    select('de/', from: 'entry_permalink_attributes_directory_id')

    expect(page).to have_selector('#entry_permalink_attributes_slug[placeholder="some-title-2"]')

    select('en/', from: 'entry_permalink_attributes_directory_id')

    expect(page).to have_selector('#entry_permalink_attributes_slug[placeholder="some-title"]')
  end
end
