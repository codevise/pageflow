require 'spec_helper'

module Pageflow
  describe Admin::SitesTab, type: :view_component do
    before do
      helper.extend(ActiveAdmin::ViewHelpers)
    end

    it 'renders table with sites of account' do
      account = create(:account)
      create(:site, account: account, cname: 'my.example.com')
      create(:site, account: account, cname: 'second.example.com')
      create(:site, cname: 'other-acount.example.com')

      render(account)

      expect(rendered).to have_selector('table td', text: 'my.example.com')
      expect(rendered).to have_selector('table td', text: 'second.example.com')
      expect(rendered).not_to have_selector('table td', text: 'other-account.example.com')
    end
  end
end
