require 'spec_helper'

module Pageflow
  describe SitePolicy do
    context 'with allow_multiaccount_users' do
      before do
        pageflow_configure do |config|
          config.allow_multiaccount_users = true
        end
      end

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic.account },
                      to: :read,
                      topic: -> { create(:site) }

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic.account },
                      to: :update,
                      topic: -> { create(:site) }

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic.account },
                      to: :manage_root_entry,
                      topic: -> { create(:site) }

      it_behaves_like 'an admin permission that',
                      of_account: ->(topic) { topic.account },
                      to: :manage_root_entry,
                      topic: -> { create(:site) }
    end

    context 'without allow_multiaccount_users' do
      before do
        pageflow_configure do |config|
          config.allow_multiaccount_users = false
        end
      end

      it_behaves_like 'an admin permission that',
                      allows_admins_but_forbids_even_managers: true,
                      of_account: ->(topic) { topic.account },
                      to: :read,
                      topic: -> { create(:site) }

      it_behaves_like 'an admin permission that',
                      allows_admins_but_forbids_even_managers: true,
                      of_account: ->(topic) { topic.account },
                      to: :update,
                      topic: -> { create(:site) }

      it_behaves_like 'a membership-based permission that',
                      allows: :manager,
                      but_forbids: :publisher,
                      of_account: ->(topic) { topic.account },
                      to: :manage_root_entry,
                      topic: -> { create(:site) }

      it_behaves_like 'an admin permission that',
                      of_account: ->(topic) { topic.account },
                      to: :manage_root_entry,
                      topic: -> { create(:site) }
    end

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
        site = create(:site, account:)

        expect(SitePolicy::Scope
                .new(user, Site).sites_allowed_for(account)).to include(site)
      end

      it 'excludes a site for whose account the user is not at least publisher' do
        user = create(:user)

        account = create(:account, with_editor: user)
        site = create(:site, account:)
        create(:entry, account:, site:, with_manager: user)

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
