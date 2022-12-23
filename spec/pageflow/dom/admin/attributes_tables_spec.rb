require 'spec_helper'

describe 'attributes table dominos', type: :feature do
  it 'allows reading row contents of entry attributes table' do
    entry = create(:entry)

    pageflow_configure do |config|
      config.admin_attributes_table_rows.register(:entry, :custom) { 'Custom' }
    end

    Pageflow::Dom::Admin.sign_in_as(:admin)
    table = Pageflow::Dom::Admin::EntryAttributesTable.for(entry)

    expect(table.contents_of_row(:custom)).to have_text('Custom')
  end

  it 'allows reading row contents of account attributes table' do
    account = create(:account)

    pageflow_configure do |config|
      config.admin_attributes_table_rows.register(:account, :custom) { 'Custom' }
    end

    Pageflow::Dom::Admin.sign_in_as(:admin)
    table = Pageflow::Dom::Admin::AccountAttributesTable.for(account)

    expect(table.contents_of_row(:custom)).to have_text('Custom')
  end

  it 'allows reading row contents of site attributes table' do
    account = create(:account)

    pageflow_configure do |config|
      config.admin_attributes_table_rows.register(:site, :custom) { 'Custom' }
    end

    Pageflow::Dom::Admin.sign_in_as(:admin)
    table = Pageflow::Dom::Admin::SiteAttributesTable.for(account.default_site)

    expect(table.contents_of_row(:custom)).to have_text('Custom')
  end
end
