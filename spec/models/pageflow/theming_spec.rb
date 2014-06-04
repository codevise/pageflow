require 'spec_helper'

module Pageflow
  describe Theming do
    describe '#cname_domain' do
      it 'removes subdomain' do
        theming = build(:theming, :cname => 'foo.bar.com')

        expect(theming.cname_domain).to eq('bar.com')
      end

      it 'removes multiple subdomain' do
        theming = build(:theming, :cname => 'foo.bar.baz.com')

        expect(theming.cname_domain).to eq('baz.com')
      end

      it 'does not change anything if no subdomain is present' do
        theming = build(:theming, :cname => 'foo.org')

        expect(theming.cname_domain).to eq('foo.org')
      end

      it 'does not change bogus' do
        theming = build(:theming, :cname => 'localhost')

        expect(theming.cname_domain).to eq('localhost')
      end

      it 'is empty if cname is empty' do
        theming = build(:theming, :cname => '')

        expect(theming.cname_domain).to eq('')
      end
    end
  end
end
