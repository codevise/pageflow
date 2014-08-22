require 'spec_helper'

# TODO
ActionView::TestCase::TestController.send(:include, Pageflow::Engine.routes.url_helpers)

module Pageflow
  describe ThemingsHelper do
    describe '#pretty_theming_url' do
      it 'uses default host' do
        theming = create(:theming, cname: '')

        expect(helper.pretty_theming_url(theming)).to eq('http://test.host/')
      end

      it 'uses theming cname if present' do
        theming = create(:theming, cname: 'my.example.com')

        expect(helper.pretty_theming_url(theming)).to eq('http://my.example.com/')
      end

      it 'can be configured via hash in public_entry_url_options' do
        Pageflow.config.public_entry_url_options = {host: 'public.example.com'}
        theming = create(:theming, cname: 'my.example.com')

        expect(helper.pretty_theming_url(theming)).to eq('http://public.example.com/')
      end

      it 'can be configured via lambda in public_entry_url_options' do
        Pageflow.config.public_entry_url_options = lambda { |theming| {host: "#{theming.account.name}.example.com" } }
        account = create(:account, name: 'myaccount')

        expect(helper.pretty_theming_url(account.default_theming)).to eq('http://myaccount.example.com/')
      end
    end
  end
end
