require 'spec_helper'

feature 'editing an account' do
  scenario 'changing name' do
    account = create(:account, :name => 'Codevise')

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_account_path(account))
    Dom::Admin::AccountPage.first.edit_link.click
    Dom::Admin::AccountForm.first.submit_with(:name => 'Codevise Solutions')

    expect(Dom::Admin::AccountPage.first.name).to eq('Codevise Solutions')
  end

  scenario 'changing nested theming' do
    theme = create(:theme, :css_dir => 'foo')
    another_theme = create(:theme, :css_dir => 'bar')

    theming = create(:theming, :theme => theme)
    account = create(:account, :default_theming => theming)

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_account_path(account))
    Dom::Admin::AccountPage.first.edit_link.click
    Dom::Admin::AccountForm.first.submit_with(:theme_id => another_theme.id)

    expect(Dom::Admin::AccountPage.first.theme).to eq('bar')
  end

  scenario 'changing nested cname' do
    theming = create(:theming, :cname => 'xxx')
    account = create(:account, :default_theming => theming)

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_account_path(account))
    Dom::Admin::AccountPage.first.edit_link.click
    Dom::Admin::AccountForm.first.submit_with(:cname => 'foo.bar.org')

    expect(Dom::Admin::AccountPage.first.cname).to eq('foo.bar.org')
  end
end
