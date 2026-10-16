require 'spec_helper'

feature 'as account publisher, adding an entry' do
  scenario 'added entry shows up in entries table' do
    filler_account = create(:account, name: 'Filler Account')
    account = create(:account, name: 'Stock Report')
    account_publisher = Dom::Admin::Page.sign_in_as(:publisher, on: account)
    create(:membership, role: :member, entity: filler_account, user: account_publisher)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).not_to be_present

    Dom::Admin::EntriesPage.first.add_entry_link.click
    Dom::Admin::EntryForm.first.submit_with(title: 'Test Entry', account:)

    visit(admin_entries_path)
    expect(Dom::Admin::EntryInIndexTable.find_by_title('Test Entry')).to be_present
    expect(Dom::Admin::EntryInIndexTable.find_by_account_name('Stock Report')).to be_present
  end

  scenario 'switching between accounts with different entry type features', js: true do
    doged_entry_type = Pageflow::TestEntryType.new(name: 'doged')
    nyan_entry_type = Pageflow::TestEntryType.new(name: 'nyan')
    pageflow_configure do |config|
      config.features.register('doged_entry_type') do |feature_config|
        feature_config.entry_types.register(doged_entry_type)
      end
      config.features.register('nyan_entry_type') do |feature_config|
        feature_config.entry_types.register(nyan_entry_type)
      end
      config.features.enable_by_default('doged_entry_type')
      config.features.enable_by_default('nyan_entry_type')
    end
    doged_account = create(:account,
                           name: 'Doge',
                           features_configuration: {'nyan_entry_type' => false})
    both_account = create(:account, name: 'Both')
    publisher = create(:user,
                       :publisher,
                       email: 'test@example.com',
                       password: 'testtest',
                       on: doged_account)
    create(:membership, user: publisher, entity: both_account, role: 'publisher')
    doged_entry_type_name = doged_entry_type.name
    nyan_entry_type_name = nyan_entry_type.name

    Dom::Admin::Page.sign_in(email: 'test@example.com', password: 'testtest')
    visit(new_admin_entry_path)
    Dom::Admin::EntryForm.first.select_account(doged_account.id)

    expect(Dom::Admin::EntryForm.first
             .has_entry_type_option?(doged_entry_type_name)).to eq(true)
    expect(Dom::Admin::EntryForm.first
             .has_entry_type_option?(nyan_entry_type_name)).to eq(false)

    Dom::Admin::EntryForm.first.select_account(both_account.id)

    expect(Dom::Admin::EntryForm.first
             .has_entry_type_option?(doged_entry_type_name)).to eq(true)
    expect(Dom::Admin::EntryForm.first
             .has_entry_type_option?(nyan_entry_type_name)).to eq(true)

    Dom::Admin::EntryForm.first.select_account(doged_account.id)

    expect(Dom::Admin::EntryForm.first
             .has_entry_type_option?(doged_entry_type_name)).to eq(true)
    expect(Dom::Admin::EntryForm.first
             .has_entry_type_option?(nyan_entry_type_name)).to eq(false)
  end

  scenario 'slug placeholder takes taken slugs of selected directory into account', js: true do
    account = create(:account)
    create(:permalink_directory, site: account.default_site, path: 'de/')
    en_directory = create(:permalink_directory, site: account.default_site, path: 'en/')
    create(:entry, account:, permalink_attributes: {slug: 'some-title', directory: en_directory})
    Dom::Admin::Page.sign_in_as(:publisher, on: account)

    visit(new_admin_entry_path)
    fill_in('entry_title', with: 'Some Title')

    expect(page).to have_selector('#entry_permalink_attributes_slug[placeholder="some-title"]')

    select('en/', from: 'entry_permalink_attributes_directory_id')

    expect(page).to have_selector('#entry_permalink_attributes_slug[placeholder="some-title-2"]')
  end
end
