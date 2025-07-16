require 'spec_helper'

module Pageflow
  describe Account do
    describe 'with entries' do
      it 'cannot be deleted' do
        account = create(:account)
        create(:entry, account:)

        expect { account.destroy }.to raise_error(ActiveRecord::DeleteRestrictionError)
      end
    end

    describe 'with users' do
      it 'cannot be deleted' do
        account = create(:account)
        create(:user, :editor, on: account)

        expect { account.destroy }.to raise_error(ActiveRecord::DeleteRestrictionError)
      end
    end

    describe '#build_default_site' do
      it 'sets default site to new site' do
        account = create(:account)

        site = account.build_default_site

        expect(account.default_site).to eq(site)
      end

      it 'initializes account of new site to self' do
        account = create(:account)

        site = account.build_default_site

        expect(site.account).to eq(account)
      end

      it 'creates root permalink directory' do
        account = build(:account)

        site = account.build_default_site

        expect(site.permalink_directories.size).to eq(1)
        expect(site.permalink_directories.first.path).to eq('')
      end

      it 'destroys default site when account is destroyed' do
        account = create(:account)

        expect { account.destroy }.to change(Site, :count).by(-1)
      end
    end

    it 'destroys folders when account is destroyed' do
      account = create(:account)
      create(:folder, account:)

      expect { account.destroy }.to change(Folder, :count).by(-1)
    end
  end

  describe 'serialization' do
    it 'does not include features_configuration' do
      account = build(:account, features_configuration: {some_feature: true})

      expect(account.to_json).not_to include('some_feature')
    end
  end
end
