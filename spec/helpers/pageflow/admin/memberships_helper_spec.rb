require 'spec_helper'

module Pageflow
  module Admin
    describe MembershipsHelper do
      describe '#membership_users_collection' do
        context 'via Entries#index' do
          it 'returns pairs of formal name and id for new membership' do
            user = create(:user, first_name: 'Randolph', last_name: 'Doe')
            account = create(:account)
            create(:membership, entity: account, role: :member, user: user)
            new_membership = Membership.new
            entry = create(:entry, account: account)
            expect(helper).to receive(:current_user).and_return(user)

            pairs = helper.membership_users_collection(entry, new_membership)

            expect(pairs).to eq([['Doe, Randolph', user.id]])
          end

          it 'returns only membership user if membership not new' do
            user = create(:user, first_name: 'Rudolf', last_name: 'Doe')
            account = create(:account)
            membership = create(:membership, entity: account, role: :member, user: user)
            create(:membership, entity: account, role: :member, user: create(:user))
            entry = create(:entry, account: account)

            pairs = membership_users_collection(entry, membership)

            expect(pairs).to eq([['Doe, Rudolf', user.id]])
          end

          it 'filters users that are already members of parent' do
            account = create(:account)
            user = create(:user, first_name: 'John', last_name: 'Doe')
            entry = create(:entry, account: account)
            create(:membership, entity: entry, role: :previewer, user: user)
            new_membership = Membership.new
            expect(helper).to receive(:current_user).and_return(user)

            pairs = helper.membership_users_collection(entry, new_membership)

            expect(pairs).to eq([])
          end
        end

        context 'via Users#index' do
          it 'returns pair of formal name and id for new membership' do
            user = create(:user, first_name: 'Randolph', last_name: 'Doe')
            account = create(:account)
            create(:membership, entity: account, role: :member, user: user)
            new_membership = Membership.new
            create(:entry, account: account)
            expect(helper).to receive(:current_user).and_return(user)

            pairs = helper.membership_users_collection(user, new_membership)

            expect(pairs).to eq([['Doe, Randolph', user.id]])
          end

          it 'returns membership user if membership not new' do
            user = create(:user, first_name: 'Rudolf', last_name: 'Doe')
            account = create(:account)
            membership = create(:membership, entity: account, role: :member, user: user)
            create(:membership, entity: account, role: :member, user: create(:user))
            create(:entry, account: account)

            pairs = membership_users_collection(user, membership)

            expect(pairs).to eq([['Doe, Rudolf', user.id]])
          end
        end

        context 'for Accounts#index' do
          it 'returns pairs of formal name and id for new membership' do
            user = create(:user, first_name: 'Randolph', last_name: 'Doe')
            account_manager = create(:user)
            account = create(:account, with_manager: account_manager)
            create(:account, with_member: user, with_manager: account_manager)
            new_membership = Membership.new
            create(:entry, account: account)
            expect(helper).to receive(:current_user).and_return(account_manager)

            pairs = helper.membership_users_collection(account, new_membership)

            expect(pairs).to eq([['Doe, Randolph', user.id]])
          end

          it 'returns only membership user if membership not new' do
            user = create(:user, first_name: 'Rudolf', last_name: 'Doe')
            account = create(:account)
            membership = create(:membership, entity: account, role: :member, user: user)
            create(:membership, entity: account, role: :member, user: create(:user))
            create(:entry, account: account)

            pairs = membership_users_collection(account, membership)

            expect(pairs).to eq([['Doe, Rudolf', user.id]])
          end

          it 'filters users that are already members of parent' do
            account = create(:account)
            user = create(:user, first_name: 'John', last_name: 'Doe')
            entry = create(:entry, account: account)
            create(:membership, entity: entry, role: :previewer, user: user)
            new_membership = Membership.new
            expect(helper).to receive(:current_user).and_return(user)

            pairs = helper.membership_users_collection(account, new_membership)

            expect(pairs).to eq([])
          end
        end
      end

      describe '#membership_accounts_collection' do
        context 'via user' do
          it 'returns pairs of name and id for new membership' do
            user = create(:user)
            account_manager = create(:user)
            account = create(:account, name: 'TVcorp', with_manager: account_manager)
            new_membership = Membership.new
            expect(helper).to receive(:current_user).and_return(account_manager)

            pairs = helper.membership_accounts_collection(user, new_membership)

            expect(pairs).to eq([['TVcorp', account.id]])
          end

          it 'returns only membership account if membership not new' do
            user = create(:user)
            account_manager = create(:user)
            account = create(:account, name: 'Radiocorp', with_manager: account_manager)
            create(:account, with_manager: account_manager)
            membership = create(:membership, entity: account)

            pairs = helper.membership_accounts_collection(user, membership)

            expect(pairs).to eq([['Radiocorp', account.id]])
          end

          it 'filters accounts that are already members of parent' do
            user = create(:user)
            account_manager = create(:user)
            account = create(:account, name: 'Mediacorp', with_manager: account_manager)
            create(:membership, entity: account, role: :member, user: user)
            new_membership = Membership.new
            expect(helper).to receive(:current_user).and_return(account_manager)

            pairs = helper.membership_accounts_collection(user, new_membership)

            expect(pairs).to eq([])
          end
        end

        context 'via account' do
          it 'returns pair of name and id for new membership' do
            create(:user)
            account_manager = create(:user)
            account = create(:account, name: 'TVcorp', with_manager: account_manager)
            new_membership = Membership.new

            pairs = helper.membership_accounts_collection(account, new_membership)

            expect(pairs).to eq([['TVcorp', account.id]])
          end

          it 'returns membership account if membership not new' do
            create(:user)
            account_manager = create(:user)
            account = create(:account, name: 'Radiocorp', with_manager: account_manager)
            create(:account, with_manager: account_manager)
            membership = create(:membership, entity: account)

            pairs = helper.membership_accounts_collection(account, membership)

            expect(pairs).to eq([['Radiocorp', account.id]])
          end
        end
      end

      describe '#membership_entries_collection' do
        it 'returns pairs of title and id of only membership entry ' \
           'with Entry as parent for new membership' do
          account = create(:account)
          entry = create(:entry, account: account, title: 'My Pageflow')
          new_membership = Membership.new

          pairs = membership_entries_collection(entry, new_membership)

          expect(pairs).to eq([['My Pageflow', entry.id]])
        end

        it 'returns selection including account and entry referrer ' \
           'with User as parent for new membership' do
          account = create(:account, name: 'Codevise Ltd.')
          create(:entry, account: account, title: 'My Pageflow')
          user = create(:user, :member, on: account)
          new_membership = Membership.new
          expect(helper).to receive(:current_user).and_return(create(:user, :manager, on: account))

          collection = helper.membership_entries_collection(user, new_membership)

          expect(collection).to include('Codevise Ltd.')
          expect(collection).to include('My Pageflow')
        end

        it 'returns selection including account and entry referrer of only membership entry ' \
           'with User as parent for new membership' do
          account = create(:account, name: 'Codevise Ltd.')
          user = create(:user)
          entry = create(:entry, account: account, title: 'My Pageflow')
          create(:entry, title: 'Raucous title', with_previewer: user)
          membership = create(:membership, user: user, role: :previewer, entity: entry)

          pairs = helper.membership_entries_collection(user, membership)

          expect(pairs).to eq([['My Pageflow', entry.id]])
        end

        it 'filters entries that the user is already member of' do
          account = create(:account, name: 'Pageflowcorp')
          entry = create(:entry, account: account, title: 'My Pageflow')
          create(:entry, account: account, title: 'Not mine')
          user = create(:user)
          create(:membership, entity: entry, role: :previewer, user: user)
          new_membership = Membership.new
          expect(helper).to receive(:current_user).and_return(create(:user, :manager, on: account))

          pairs = helper.membership_entries_collection(user, new_membership)

          expect(pairs).not_to include('My Pageflow')
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
