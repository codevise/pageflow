require 'spec_helper'

module Pageflow
  module Admin
    describe MembershipsHelper do
      describe '#membership_users_collection' do
        it 'returns pairs of formal name and id' do
          john = create(:user, first_name: 'John', last_name: 'Doe')
          account = create(:account)
          membership = create(:membership, entity: account, role: 'member', user: john)
          new_membership = Membership.new
          entry = create(:entry, account: account)

          pairs = membership_users_collection(entry, membership, new_membership)

          expect(pairs).to eq([['Doe, John', john.id]])
        end

        it 'filters users that are already members of parent' do
          account = create(:account)
          user = create(:user, account: account, first_name: 'John', last_name: 'Doe')
          entry = create(:entry, account: account)
          membership = create(:membership, entity: entry, role: 'member', user: user)
          new_membership = Membership.new

          pairs = membership_users_collection(entry, membership, new_membership)

          expect(pairs).to eq([])
        end
      end

      describe '#membership_accounts_collection' do
        it 'returns pairs of name and id' do
          pending 'alternative to current_user in the Memberships helper'
          user = create(:user)
          account = create(:account, name: 'Mediacorp')
          membership = create(:membership, entity: account, role: 'member', user: user)
          new_membership = Membership.new
          entry = create(:entry, account: account)

          account_manager = Dom::Admin::Page.sign_in_as(:manager, on: account)
          allow_any_instance_of(ApplicationController).to receive(:current_user).and_return(account_manager)
          pairs = membership_accounts_collection(user, membership, new_membership)

          expect(pairs).to eq([['Mediacorp', account.id]])
          fail
        end

        it 'filters accounts that are already members of parent' do
          pending 'alternative to current_user in the Memberships helper'
          account = create(:account)
          user = create(:user, account: account, first_name: 'John', last_name: 'Doe')
          entry = create(:entry, account: account)
          membership = create(:membership, entity: entry, role: 'member', user: user)
          new_membership = Membership.new

          pairs = membership_users_collection(entry, membership, new_membership)

          expect(pairs).to eq([])
          fail
        end
      end

      describe '#membership_entries_collection' do
        it 'returns pairs of title and id with Entry as parent' do
          account = create(:account)
          entry = create(:entry, account: account, title: 'My Pageflow')
          membership = create(:membership)
          new_membership = Membership.new

          pairs = membership_entries_collection(entry, membership, new_membership)

          expect(pairs).to eq([['My Pageflow', entry.id]])
        end

        it 'returns pairs of title and id with User as parent' do
          account = create(:account)
          entry = create(:entry, account: account, title: 'My Pageflow')
          user = create(:user, :member, on: account)
          membership = create(:membership)
          new_membership = Membership.new(entity: entry)

          pairs = membership_entries_collection(user, new_membership, new_membership)

          expect(pairs).to eq([['My Pageflow', entry.id]])
        end

        it 'filters entries that the user is already member of' do
          account = create(:account)
          entry = create(:entry, account: account, title: 'My Pageflow')
          user = create(:user)
          membership = create(:membership, entity: entry, role: 'previewer', user: user)
          new_membership = Membership.new

          pairs = membership_entries_collection(user, membership, new_membership)

          expect(pairs).to eq([])
        end
      end

      describe '#membership_roles_collection' do
        it 'contains exactly the possible Account roles for Account' do
          pairs = membership_roles_collection('Pageflow::Account')

          expect(pairs).to eq([[I18n.t('pageflow.admin.users.roles.member'), :member],
                               [I18n.t('pageflow.admin.users.roles.previewer'), :previewer],
                               [I18n.t('pageflow.admin.users.roles.editor'), :editor],
                               [I18n.t('pageflow.admin.users.roles.publisher'), :publisher],
                               [I18n.t('pageflow.admin.users.roles.manager'), :manager]])
        end

        it 'contains exactly the possible Entry roles for Entry' do
          pairs = membership_roles_collection('Pageflow::Entry')

          expect(pairs).to eq([[I18n.t('pageflow.admin.users.roles.previewer'), :previewer],
                               [I18n.t('pageflow.admin.users.roles.editor'), :editor],
                               [I18n.t('pageflow.admin.users.roles.publisher'), :publisher],
                               [I18n.t('pageflow.admin.users.roles.manager'), :manager]])
        end
      end
    end
  end
end
