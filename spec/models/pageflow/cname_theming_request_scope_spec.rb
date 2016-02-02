require 'spec_helper'

module Pageflow
  describe CnameThemingRequestScope do
    it 'finds theming by cname' do
      theming = create(:theming, cname: 'some.example.com')
      request = double('Request', host: 'some.example.com')

      result = CnameThemingRequestScope.new.call(Theming, request)

      expect(result.first).to eq(theming)
    end

    it 'finds theming by additional cname' do
      theming = create(:theming, cname: 'some.example.com', additional_cnames: 'other.example.com')
      request = double('Request', host: 'other.example.com')

      result = CnameThemingRequestScope.new.call(Theming, request)

      expect(result.first).to eq(theming)
    end

    it 'finds theming by one of multiple additional cname' do
      theming = create(:theming,
                       additional_cnames: 'some.example.com, other.example.com,more.example.com')
      request = double('Request', host: 'other.example.com')

      result = CnameThemingRequestScope.new.call(Theming, request)

      expect(result.first).to eq(theming)
    end

    it 'returns empty scope if neither matches' do
      create(:theming,
             cname: 'some.example.com',
             additional_cnames: 'some.example.com, other.example.com')
      request = double('Request', host: 'not.there.example.com')

      result = CnameThemingRequestScope.new.call(Theming, request)

      expect(result.count).to eq(0)
    end

    it 'returns empty scope if only a substring is matched' do
      create(:theming,
             additional_cnames: 'some.example.com')
      request = double('Request', host: 'example.com')

      result = CnameThemingRequestScope.new.call(Theming, request)

      expect(result.count).to eq(0)
    end

    it 'does not fail if host is invalid' do
      create(:theming,
             cname: 'some.example.com',
             additional_cnames: 'some.example.com, other.example.com')
      request = double('Request', host: 'should, not happen')

      result = CnameThemingRequestScope.new.call(Theming, request)

      expect(result.count).to eq(0)
    end
  end
end
