require 'spec_helper'

module Pageflow
  module Policies
    describe AccountPolicy do
      it_behaves_like 'a membership-based permission that',
                      allows: 'publisher',
                      but_forbids: 'editor',
                      of_account: -> (topic) { topic },
                      to: :publish,
                      topic: -> { create(:account) }

      it_behaves_like 'a membership-based permission that',
                      allows: 'publisher',
                      but_forbids: 'editor',
                      of_account: -> (topic) { topic },
                      to: :configure_folder_on,
                      topic: -> { create(:account) }
    end

    describe '.entry_creatable' do
      it 'includes accounts with memberships with correct user, correct account and ' \
      'sufficient role' do
        user = create(:user)
        account = create(:account, with_publisher: user)

        expect(Policies::AccountPolicy::Scope.new(user,
                                                  Account).entry_creatable).to include(account)
      end

      it 'does not include accounts with memberships with wrong entity id' do
        user = create(:user)
        account = create(:account)

        expect(Policies::AccountPolicy::Scope.new(user,
                                                  Account).entry_creatable).not_to include(account)
      end

      it 'does not include accounts with memberships with wrong user' do
        user = create(:user)
        wrong_user = create(:user)
        account = create(:account, with_publisher: wrong_user)

        expect(Policies::AccountPolicy::Scope.new(user,
                                                  Account).entry_creatable).not_to include(account)
      end

      it 'does not include accounts with memberships with insufficient role' do
        user = create(:user)
        account = create(:account, with_editor: user)

        expect(Policies::AccountPolicy::Scope.new(user,
                                                  Account).entry_creatable).not_to include(account)
      end

      it 'does not include accounts with membership with nil account id' do
        user = create(:user)
        account = Account.new
        create(:membership, user: user, entity: account)

        expect(Policies::AccountPolicy::Scope.new(user,
                                                  Account).entry_creatable).not_to include(account)
      end
    end
  end
end
