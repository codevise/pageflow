require 'spec_helper'

feature 'as account manager, editing an entry template' do
  scenario 'changing meta fields' do
    account = create(:account, name: 'Codevise')
    create(:entry_template, account: account, entry_type_name: 'paged')

    Dom::Admin::Page.sign_in_as(:manager, on: account)
    visit(admin_account_path(account))
    Dom::Admin::EntryTemplatesTab.first.edit_link.click
    Dom::Admin::EntryTemplateForm.first.submit_with(
      default_author: 'Codevise Solutions',
      default_publisher: 'Codevise Solutions',
      default_keywords: 'codevise, solutions'
    )

    expect(Dom::Admin::AccountPage.first.default_author).to eq('Codevise Solutions')
    expect(Dom::Admin::AccountPage.first.default_publisher).to eq('Codevise Solutions')
    expect(Dom::Admin::AccountPage.first.default_keywords).to eq('codevise, solutions')
  end

  scenario 'changing theming' do
    pageflow_configure do |config|
      config.themes.register(:foo)
      config.themes.register(:bar)
      config.allow_multiaccount_users = true
    end

    account = create(:account)
    create(:entry_template, account: account, entry_type_name: 'paged', theme_name: 'foo')

    Dom::Admin::Page.sign_in_as(:manager, on: account)
    visit(admin_account_path(account))
    Dom::Admin::EntryTemplatesTab.first.edit_link.click
    Dom::Admin::EntryTemplateForm.first.submit_with(theme_name: 'bar')

    expect(Dom::Admin::AccountPage.first.theme).to eq('bar')
  end
end
