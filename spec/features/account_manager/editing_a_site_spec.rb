require 'spec_helper'

feature 'as account manager, editing a site' do
  scenario 'changing cname' do
    site = create(:site, cname: 'xxx')

    Dom::Admin::Page.sign_in_as(:manager, on: site.account)
    visit(admin_account_site_path(site.account, site))
    Dom::Admin::SitePage.first.edit_link.click
    Dom::Admin::SiteForm.first.submit_with(cname: 'foo.bar.org')

    expect(Dom::Admin::SitePage.first.cname).to eq('foo.bar.org')
  end
end
