require 'spec_helper'

describe 'edit form dominos', type: :feature do
  it 'allows reading row contents of entry attributes table' do
    entry = create(:entry)

    pageflow_configure do |config|
      config.admin_form_inputs.register(:entry, :custom_field)
    end

    Pageflow::Dom::Admin.sign_in_as(:admin)
    form = Pageflow::Dom::Admin::EntryEditForm.for(entry)

    expect(form).to have_input_for_attribute(:custom_field)
  end

  it 'allows reading row contents of account attributes form' do
    account = create(:account)

    pageflow_configure do |config|
      config.admin_form_inputs.register(:account, :custom_field)
    end

    Pageflow::Dom::Admin.sign_in_as(:admin)
    form = Pageflow::Dom::Admin::AccountEditForm.for(account)

    expect(form).to have_input_for_attribute(:custom_field)
  end

  it 'allows reading row contents of site attributes form' do
    account = create(:account)

    pageflow_configure do |config|
      config.admin_form_inputs.register(:site, :custom_field)
    end

    Pageflow::Dom::Admin.sign_in_as(:admin)
    form = Pageflow::Dom::Admin::SiteEditForm.for(account.default_site)

    expect(form).to have_input_for_attribute(:custom_field)
  end
end
