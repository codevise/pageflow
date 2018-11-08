require 'spec_helper'

module Pageflow
  describe PrimaryDomainEntryRedirect do
    it 'returns primary theming domain when request uses unknown domain' do
      theming = create(:theming, cname: 'pageflow.example.com')
      entry = create(:entry, theming: theming)
      request = request('https://legacy.example.com/some-entry')

      redirect = PrimaryDomainEntryRedirect.new.call(entry, request)

      expect(redirect).to eq('https://pageflow.example.com/some-entry')
    end

    it 'returns nil when request uses primary theming domain' do
      theming = create(:theming, cname: 'pageflow.example.com')
      entry = create(:entry, theming: theming)
      request = request('https://pageflow.example.com')

      redirect = PrimaryDomainEntryRedirect.new.call(entry, request)

      expect(redirect).to eq(nil)
    end

    it 'returns nil when request uses additional theming domain' do
      theming = create(:theming,
                       cname: 'pageflow.example.com',
                       additional_cnames: 'extra.example.com, other.example.com')
      entry = create(:entry, theming: theming)
      request = request('https://extra.example.com/some-entry')

      redirect = PrimaryDomainEntryRedirect.new.call(entry, request)

      expect(redirect).to eq(nil)
    end

    it 'returns nil if theming does not have domains' do
      theming = create(:theming, cname: '')
      entry = create(:entry, theming: theming)
      request = request('https://some.example.com/some-entry')

      redirect = PrimaryDomainEntryRedirect.new.call(entry, request)

      expect(redirect).to eq(nil)
    end

    def request(uri)
      ActionDispatch::Request.new(Rack::MockRequest.env_for(uri))
    end
  end
end
