require 'spec_helper'

module Pageflow
  describe Account do
    describe '#cname_domain' do
      it 'removes subdomain' do
        account = build(:account, :cname => 'reportage.wdr.de')

        expect(account.cname_domain).to eq('wdr.de');
      end

      it 'removes multiple subdomain' do
        account = build(:account, :cname => 'meine.reportage.wdr.de')

        expect(account.cname_domain).to eq('wdr.de');
      end

      it 'does not change anything if no subdomain is present' do
        account = build(:account, :cname => 'wdr.de')

        expect(account.cname_domain).to eq('wdr.de');
      end

      it 'does not change bogus' do
        account = build(:account, :cname => 'localhost')

        expect(account.cname_domain).to eq('localhost');
      end

      it 'is empty if cname is empty' do
        account = build(:account, :cname => '')

        expect(account.cname_domain).to eq('');
      end
    end
  end
end
