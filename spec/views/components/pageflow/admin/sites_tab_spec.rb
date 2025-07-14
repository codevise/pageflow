require 'spec_helper'

module Pageflow
  describe Admin::SitesTab, type: :view_component do
    before do
      helper.extend(ActiveAdmin::ViewHelpers)
    end

    it 'renders table with sites of account' do
      account = create(:account,
                       default_site_attributes: {cname: 'my.example.com'})
      create(:site, account:, name: 'Second', cname: 'second.example.com')
      create(:site, cname: 'other-acount.example.com')

      allow(helper).to receive(:authorized?).and_return(true)

      render(account)

      expect(rendered).to have_selector('table td', text: '(Default)')
      expect(rendered).to have_selector('table td', text: 'Second')
      expect(rendered).to have_selector('table td', text: 'my.example.com')
      expect(rendered).to have_selector('table td', text: 'second.example.com')
      expect(rendered).not_to have_selector('table td', text: 'other-account.example.com')
    end
  end
end
