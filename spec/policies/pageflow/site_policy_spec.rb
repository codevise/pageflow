require 'spec_helper'

module Pageflow
  describe SitePolicy do
    it_behaves_like 'a membership-based permission that',
                    allows: :publisher,
                    but_forbids: :editor,
                    of_account: -> (topic) { topic.account },
                    to: :edit,
                    topic: -> { create(:site) }

    describe '.sites_allowed_for(accounts)' do
      it 'includes all sites for admins' do
        user = create(:user, :admin)
        site = create(:site)

        expect(SitePolicy::Scope
                .new(user, Site).sites_allowed_for(create(:account))).to include(site)
      end

      it 'includes sites for one account' do
        user = create(:user)
        account = create(:account, with_publisher: user)
        site = create(:site, account: account)

        expect(SitePolicy::Scope
                .new(user, Site).sites_allowed_for(account)).to include(site)
      end

      it 'excludes a site for whose account the user is not at least publisher' do
        user = create(:user)

        account = create(:account, with_editor: user)
        site = create(:site, account: account)
        create(:entry, account: account, site: site, with_manager: user)

        account_policy_scope = AccountPolicy::Scope.new(user, Account)
        accounts = account_policy_scope.sites_accessible

        scope = SitePolicy::Scope.new(user, Site).sites_allowed_for(accounts)

        expect(scope).to_not include(site)
      end

      it 'does not include sites for wrong account' do
        user = create(:user)
        site = create(:site)

        scope = SitePolicy::Scope.new(user, Site).sites_allowed_for(site.account)

        expect(scope).to_not include(site)
      end
    end
  end
end
