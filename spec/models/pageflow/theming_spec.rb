require 'spec_helper'

module Pageflow
  describe Theming do
    describe '#theme_name' do
      it 'is invalid if not registered' do
        theming = build(:theming, :theme_name => 'unknown')

        theming.valid?

        expect(theming.errors).to include(:theme_name)
      end

      it 'is valid if registered for usage in theming' do
        Pageflow.config.themes.register(:custom)

        theming = build(:theming, theme_name: 'custom')

        expect(theming).to be_valid
      end
    end

    describe '#theme' do
      it 'looks up theme by #theme_name' do
        theming = build(:theming, :theme_name => 'default')

        expect(theming.theme).to be(Pageflow.config.themes.get(:default))
      end
    end

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
