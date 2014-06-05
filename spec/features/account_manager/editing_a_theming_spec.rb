require 'spec_helper'

feature 'account manager editing a theming' do
  scenario 'changing imprint label of theming of own account' do
    theming = create(:theming)
    account = create(:account, :default_theming => theming)

    Dom::Admin::Page.sign_in_as(:account_manager, :account => account)

    visit(admin_theming_path(theming))
    Dom::Admin::ThemingPage.first.edit_link.click
    Dom::Admin::ThemingForm.first.submit_with(:imprint_label => 'Impressum Label')

    visit(admin_theming_path(theming))

    expect(Dom::Admin::ThemingPage.first.imprint_label).to eq('Impressum Label')
  end
end
