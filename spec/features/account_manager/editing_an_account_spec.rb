require 'spec_helper'

feature 'as account manager, editing an account' do
  scenario 'changing name' do
    account = create(:account, name: 'Codevise')

    Dom::Admin::Page.sign_in_as(:manager, on: account)
    visit(admin_account_path(account))
    Dom::Admin::AccountPage.first.edit_link.click
    Dom::Admin::AccountForm.first.submit_with(name: 'Codevise Solutions')

    expect(Dom::Admin::AccountPage.first.name).to eq('Codevise Solutions')
  end

  scenario 'changing meta fields' do
    account = create(:account, name: 'Codevise')
    create(:entry_template, account: account, entry_type: 'paged')

    Dom::Admin::Page.sign_in_as(:admin)
    visit(admin_account_path(account))
    Dom::Admin::AccountPage.first.edit_link.click
    Dom::Admin::AccountForm.first.submit_with(
      default_author: 'Codevise Solutions',
      default_publisher: 'Codevise Solutions',
      default_keywords: 'codevise, solutions'
    )

    expect(Dom::Admin::AccountPage.first.default_author).to eq('Codevise Solutions')
    expect(Dom::Admin::AccountPage.first.default_publisher).to eq('Codevise Solutions')
    expect(Dom::Admin::AccountPage.first.default_keywords).to eq('codevise, solutions')
  end

  scenario 'changing nested theming' do
    pageflow_configure do |config|
      config.themes.register(:foo)
      config.themes.register(:bar)
    end

    account = create(:account)
    create(:entry_template, account: account, entry_type: 'paged', theme_name: 'foo')

    Dom::Admin::Page.sign_in_as(:manager, on: account)
    visit(admin_account_path(account))
    Dom::Admin::AccountPage.first.edit_link.click
    Dom::Admin::AccountForm.first.submit_with(theme_name: 'bar')

    expect(Dom::Admin::AccountPage.first.theme).to eq('bar')
  end

  scenario 'changing nested cname' do
    theming = create(:theming, cname: 'xxx')
    account = create(:account, default_theming: theming)

    Dom::Admin::Page.sign_in_as(:manager, on: account)
    visit(admin_account_path(account))
    Dom::Admin::AccountPage.first.edit_link.click
    Dom::Admin::AccountForm.first.submit_with(cname: 'foo.bar.org')

    expect(Dom::Admin::AccountPage.first.cname).to eq('foo.bar.org')
  end
end
