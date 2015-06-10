require 'spec_helper'

feature 'admim enabling a feature for an account' do
  scenario 'enabled for account' do
    account = create(:account)

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_account_path(account))
    Dom::Admin::AccountPage.find!.features_tab.click
    Dom::Admin::FeaturesForm.find!.submit_with(test_feature: true)

    expect(Pageflow.config_for(account.reload).features.enabled?('test_feature')).to eq(true)
  end
end
