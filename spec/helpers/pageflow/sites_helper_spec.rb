require 'spec_helper'

module Pageflow
  describe SitesHelper do
    before(:each) do
      helper.extend(Pageflow::Engine.routes.url_helpers)
    end

    describe '#pretty_site_url' do
      it 'uses default host' do
        site = create(:site, cname: '')

        expect(helper.pretty_site_url(site)).to eq('http://test.host/')
      end

      it 'uses site cname if present' do
        site = create(:site, cname: 'my.example.com')

        expect(helper.pretty_site_url(site)).to eq('http://my.example.com/')
      end

      it 'can be configured via hash in public_entry_url_options' do
        Pageflow.config.public_entry_url_options = {host: 'public.example.com'}
        site = create(:site, cname: 'my.example.com')

        expect(helper.pretty_site_url(site)).to eq('http://public.example.com/')
      end

      it 'can be configured via lambda in public_entry_url_options' do
        Pageflow.config.public_entry_url_options = lambda { |site| {host: "#{site.account.name}.example.com" } }
        account = create(:account, name: 'myaccount')

        expect(helper.pretty_site_url(account.default_site)).to eq('http://myaccount.example.com/')
      end
    end
  end
end
