require 'spec_helper'

module Pageflow
  describe CnameSiteRequestScope do
    it 'finds site by cname' do
      site = create(:site, cname: 'some.example.com')
      request = double('Request', host: 'some.example.com')

      result = CnameSiteRequestScope.new.call(Site, request)

      expect(result.first).to eq(site)
    end

    it 'finds site by additional cname' do
      site = create(:site, cname: 'some.example.com', additional_cnames: 'other.example.com')
      request = double('Request', host: 'other.example.com')

      result = CnameSiteRequestScope.new.call(Site, request)

      expect(result.first).to eq(site)
    end

    it 'finds site by one of multiple additional cname' do
      site = create(:site,
                    additional_cnames: 'some.example.com, other.example.com,more.example.com')
      request = double('Request', host: 'other.example.com')

      result = CnameSiteRequestScope.new.call(Site, request)

      expect(result.first).to eq(site)
    end

    it 'returns empty scope if neither matches' do
      create(:site,
             cname: 'some.example.com',
             additional_cnames: 'some.example.com, other.example.com')
      request = double('Request', host: 'not.there.example.com')

      result = CnameSiteRequestScope.new.call(Site, request)

      expect(result.count).to eq(0)
    end

    it 'returns empty scope if only a substring is matched' do
      create(:site,
             additional_cnames: 'some.example.com')
      request = double('Request', host: 'example.com')

      result = CnameSiteRequestScope.new.call(Site, request)

      expect(result.count).to eq(0)
    end

    it 'does not fail if host is invalid' do
      create(:site,
             cname: 'some.example.com',
             additional_cnames: 'some.example.com, other.example.com')
      request = double('Request', host: 'should, not happen')

      result = CnameSiteRequestScope.new.call(Site, request)

      expect(result.count).to eq(0)
    end
  end
end
