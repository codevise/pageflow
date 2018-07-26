require 'spec_helper'

describe Admin::MembershipsController do
  describe '#potential_entries_for_user_options' do
    describe 'as member of single account' do
      it 'includes entry account name in texts' do
        account = create(:account, name: 'Account')
        current_user = create(:user, :manager, on: account)
        managed_user = create(:user, :member, on: account)
        create(:entry, account: account, title: 'Some title')

        sign_in(current_user, scope: :user)
        get(:potential_entries_for_user_options, params: {parent_id: managed_user.id})
        option_texts = json_response(path: ['results', '*', 'text'])

        expect(option_texts).to include('Some title')
      end
    end

    describe 'as member of multiple accounts' do
      it 'includes entry account name in texts' do
        entry_account = create(:account, name: 'Entry account')
        current_user = create(:user, :member, on: entry_account)
        managed_user = create(:user, :member, on: entry_account)
        create(:account,
               with_manager: current_user,
               with_member: managed_user,
               name: 'Managed Account')
        create(:entry,
               account: entry_account,
               with_manager: current_user,
               title: 'Some title')

        sign_in(current_user, scope: :user)
        get(:potential_entries_for_user_options, params: {parent_id: managed_user.id})
        option_texts = json_response(path: ['results', '*', 'text'])

        expect(option_texts).to include('Entry account / Some title')
      end
    end
  end

  describe '#create' do
    describe 'as admin' do
      it 'allows to add user to account' do
        user = create(:user)
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          post :create, params: {account_id: account, membership: {user_id: user, role: :manager}}
        end.to change { account.users.count }
      end

      it 'allows to add account to user' do
        user = create(:user)
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          post :create, params: {
            user_id: user,
            membership: {
              entity_id: account.id,
              entity_type: 'Pageflow::Account',
              role: :manager
            }
          }
        end.to change { user.accounts.count }
      end

      it 'does not allow to add user of other account to entry' do
        user = create(:user)
        entry = create(:entry)
        create(:account, with_manager: user)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          post :create,
               params: {
                 entry_id: entry.id,
                 membership: {user_id: user, role: :previewer}
               }
        end.not_to change { entry.users.count }
      end

      it 'does not allow to add entry of other account to user' do
        user = create(:user)
        entry = create(:entry)
        create(:account, with_manager: user)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          post :create,
               params: {
                 user_id: user,
                 membership: {entity_id: entry.id, entity_type: 'Pageflow::Entry', role: :previewer}
               }
        end.not_to change { user.entries.count }
      end

      it 'allows to add entry of member account to user' do
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          post :create, params: {
            user_id: user,
            membership: {
              entity_id: entry.id,
              entity_type: 'Pageflow::Entry',
              role: :manager
            }
          }
        end.to change { user.entries.count }
      end

      it 'allows to add user of member account to entry' do
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          post :create,
               params: {
                 entry_id: entry.id,
                 membership: {user_id: user, role: :manager}
               }
        end.to change { entry.users.count }
      end
    end

    describe 'as account admin' do
      it 'allows to add user to correct account' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        user = create(:user)

        sign_in(account_admin, scope: :user)

        expect do
          post :create, params: {account_id: account, membership: {user_id: user, role: :manager}}
        end.to change { account.users.count }
      end

      it 'allows to add correct account to user' do
        account_admin = create(:user)
        account = create(:account, with_manager: account_admin)
        user = create(:user)

        sign_in(account_admin, scope: :user)

        expect do
          post :create, params: {
            user_id: user,
            membership: {
              entity_id: account.id,
              entity_type: 'Pageflow::Account',
              role: :manager
            }
          }
        end.to change { user.accounts.count }
      end

      it 'does not allow to add user to off-limits account' do
        account_admin = create(:user)
        create(:account, with_manager: account_admin)
        off_limits_account = create(:account)
        user = create(:user)

        sign_in(account_admin, scope: :user)

        expect do
          post :create, params: {
            account_id: off_limits_account.id,
            membership: {
              user_id: user,
              role: :manager
            }
          }
        end.not_to change { off_limits_account.users.count }
      end

      it 'does not allow to add off-limits account to user' do
        account_admin = create(:user)
        create(:account, with_manager: account_admin)
        off_limits_account = create(:account)
        user = create(:user)

        sign_in(account_admin, scope: :user)

        expect do
          post :create,
               params: {
                 user_id: user,
                 membership: {entity_id: off_limits_account.id,
                              entity_type: 'Pageflow::Account',
                              role: :manager}
               }
        end.not_to change { user.accounts.count }
      end
    end

    describe 'as account publisher' do
      it 'does not allow to add user to account' do
        account_publisher = create(:user)
        account = create(:account, with_publisher: account_publisher)
        user = create(:user)

        sign_in(account_publisher, scope: :user)

        expect do
          post :create, params: {account_id: account, membership: {user_id: user, role: :manager}}
        end.not_to change { account.users.count }
      end

      it 'does not allow to add account to user' do
        account_publisher = create(:user)
        account = create(:account, with_publisher: account_publisher)
        user = create(:user)

        sign_in(account_publisher, scope: :user)

        expect do
          post :create, params: {user_id: user, membership: {account_id: account.id,
                                                             account_type: 'Pageflow::Account',
                                                             role: :manager}}
        end.not_to change { user.accounts.count }
      end
    end

    describe 'as entry admin' do
      it 'does not allow to add user to entry in other account' do
        entry_admin = create(:user)
        account = create(:account, with_manager: entry_admin)
        other_account = create(:account, with_manager: entry_admin)
        user = create(:user, :manager, on: account)
        entry = create(:entry, account: other_account, with_manager: entry_admin)

        sign_in(entry_admin, scope: :user)

        expect do
          post :create, params: {entry_id: entry, membership: {user_id: user, role: :previewer}}
        end.not_to change { entry.users.count }
      end

      it 'does not allow to add entry to user in other account' do
        entry_admin = create(:user)
        account = create(:account, with_manager: entry_admin)
        other_account = create(:account, with_manager: entry_admin)
        user = create(:user, :manager, on: account)
        entry = create(:entry, account: other_account, with_manager: entry_admin)

        sign_in(entry_admin, scope: :user)

        expect do
          post :create, params: {user_id: user, membership: {entity_id: entry.id,
                                                             entity_type: 'Pageflow::Entry',
                                                             role: :previewer}}
        end.not_to change { user.entries.count }
      end

      it 'does not allow to add user to entry for entry admin on other entry' do
        entry_admin = create(:user)
        account = create(:account)
        create(:entry, with_manager: entry_admin)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account)

        sign_in(entry_admin, scope: :user)

        expect do
          post :create, params: {entry_id: entry, membership: {user_id: user, role: :previewer}}
        end.not_to change { entry.users.count }
      end

      it 'does not allow to add entry to user for entry admin on other entry' do
        entry_admin = create(:user)
        account = create(:account)
        create(:entry, with_manager: entry_admin)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account)

        sign_in(entry_admin, scope: :user)

        expect do
          post :create, params: {user_id: user, membership: {entity_id: entry.id,
                                                             entity_type: 'Pageflow::Entry',
                                                             role: :previewer}}
        end.not_to change { user.entries.count }
      end

      it 'allows to add user to entry in correct account' do
        entry_admin = create(:user)
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account, with_manager: entry_admin)

        sign_in(entry_admin, scope: :user)

        expect do
          post :create, params: {entry_id: entry, membership: {user_id: user, role: :manager}}
        end.to change { entry.users.count }
      end

      it 'allows to add entry to user in correct account' do
        entry_admin = create(:user)
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account, with_manager: entry_admin)

        sign_in(entry_admin, scope: :user)

        expect do
          post :create, params: {user_id: user, membership: {entity_id: entry.id,
                                                             entity_type: 'Pageflow::Entry',
                                                             role: :manager}}
        end.to change { user.entries.count }
      end
    end

    describe 'as entry publisher' do
      it 'does not allow to add user to entry in correct account' do
        entry_publisher = create(:user)
        account = create(:account)
        user = create(:user, :manager, on: account)
        entry = create(:entry, account: account, with_publisher: entry_publisher)

        sign_in(entry_publisher, scope: :user)

        expect do
          post :create, params: {entry_id: entry, membership: {user_id: user, role: :manager}}
        end.not_to change { entry.users.count }
      end

      it 'does not allow to add entry to user in correct account' do
        entry_publisher = create(:user)
        account = create(:account)
        user = create(:user, :manager, on: account)
        entry = create(:entry, account: account, with_publisher: entry_publisher)

        sign_in(entry_publisher, scope: :user)

        expect do
          post :create, params: {user_id: user, membership: {entity_id: entry.id,
                                                             entity_type: 'Pageflow::Entry',
                                                             role: :manager}}
        end.not_to change { user.entries.count }
      end
    end
  end

  describe '#edit' do
    describe 'as admin' do
      it 'allows to edit user role on account' do
        user = create(:user)
        account = create(:account)
        membership = create(:membership, entity: account, user: user, role: :manager)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          patch(:update, params: {account_id: account, id: membership, membership: {role: :publisher}})
        end.to change { membership.reload.role }
      end

      it 'allows to edit account role on user' do
        user = create(:user)
        account = create(:account)
        membership = create(:membership, entity: account, user: user, role: :manager)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          patch(:update, params: {user_id: user, id: membership, membership: {role: :publisher}})
        end.to change { membership.reload.role }
      end

      it 'allows to edit entry role via user' do
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account)
        membership = create(:membership, entity: entry, user: user, role: :manager)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          patch :update, params: {user_id: user, id: membership, membership: {role: :publisher}}
        end.to change { membership.reload.role }
      end

      it 'allows to edit entry role via entry' do
        account = create(:account)
        user = create(:user, :member, on: account)
        entry = create(:entry, account: account)
        membership = create(:membership, entity: entry, user: user, role: :manager)

        sign_in(create(:user, :admin), scope: :user)

        expect do
          patch :update, params: {entry_id: entry, id: membership, membership: {role: :publisher}}
        end.to change { membership.reload.role }
      end

      describe 'as account admin' do
        it 'allows to edit user role on own account' do
          account_admin = create(:user)
          account = create(:account, with_manager: account_admin)
          user = create(:user)
          membership = create(:membership, user: user, entity: account, role: :manager)

          sign_in(account_admin, scope: :user)

          expect do
            patch :update, params: {account_id: account, id: membership, membership: {role: :publisher}}
          end.to change { membership.reload.role }
        end

        it 'allows to edit role relating to own account on user' do
          account_admin = create(:user)
          account = create(:account, with_manager: account_admin)
          user = create(:user)
          membership = create(:membership, user: user, entity: account, role: :manager)

          sign_in(account_admin, scope: :user)

          expect do
            patch :update, params: {user_id: user, id: membership, membership: {role: :publisher}}
          end.to change { membership.reload.role }
        end

        it 'does not allow to edit user role on off-limits account' do
          account_admin = create(:user)
          create(:account, with_manager: account_admin)
          off_limits_account = create(:account)
          user = create(:user)
          membership = create(:membership, user: user, entity: off_limits_account, role: :manager)

          sign_in(account_admin, scope: :user)

          expect do
            patch :update,
                  params: {
                    account_id: off_limits_account,
                    id: membership,
                    membership: {role: :previewer}
                  }
          end.not_to change { membership.reload.role }
        end

        it 'does not allow to edit off-limits account role on user' do
          account_admin = create(:user)
          create(:account, with_manager: account_admin)
          off_limits_account = create(:account)
          user = create(:user)
          membership = create(:membership, user: user, entity: off_limits_account, role: :manager)

          sign_in(account_admin, scope: :user)

          expect do
            patch :update, params: {user_id: user, id: membership, membership: {role: :previewer}}
          end.not_to change { membership.reload.role }
        end
      end

      describe 'as account publisher' do
        it 'does not allow to edit user role on own account' do
          account_publisher = create(:user)
          account = create(:account, with_publisher: account_publisher)
          user = create(:user)
          membership = create(:membership, user: user, entity: account, role: :manager)

          sign_in(account_publisher, scope: :user)

          expect do
            patch :update, params: {account_id: account, id: membership, membership: {role: :previewer}}
          end.not_to change { membership.reload.role }
        end

        it 'does not allow to edit account role relating to own account on user' do
          account_publisher = create(:user)
          account = create(:account, with_publisher: account_publisher)
          user = create(:user)
          membership = create(:membership, user: user, entity: account, role: :manager)

          sign_in(account_publisher, scope: :user)

          expect do
            patch :update, params: {user_id: user, id: membership, membership: {role: :previewer}}
          end.not_to change { membership.reload.role }
        end
      end

      describe 'as entry admin' do
        it 'does not allow to edit user role on entry in other account' do
          user = create(:user)
          entry_manager = create(:user)
          create(:account, with_member: user, with_manager: entry_manager)
          create(:entry, with_manager: entry_manager)
          membership = create(:membership, entity: create(:entry), user: user, role: :previewer)

          sign_in(entry_manager, scope: :user)

          expect do
            patch :update, params: {user_id: user, id: membership, membership: {role: :editor}}
          end.not_to change { membership.reload.role }
        end

        it 'does not allow to edit entry role on user in other account' do
          user = create(:user)
          entry_manager = create(:user)
          create(:account, with_member: user, with_manager: entry_manager)
          entry = create(:entry)
          membership = create(:membership, entity: entry, user: user, role: :previewer)

          sign_in(entry_manager, scope: :user)

          expect do
            patch :update, params: {entry_id: entry, id: membership, membership: {role: :editor}}
          end.not_to change { membership.reload.role }
        end

        it 'allows to edit role of member of account on entry' do
          user = create(:user)
          account = create(:account, with_manager: user)
          entry_manager = create(:user)
          entry = create(:entry, account: account, with_manager: entry_manager)
          membership = create(:membership, entity: entry, user: user, role: :manager)

          sign_in(entry_manager, scope: :user)

          expect do
            patch :update, params: {entry_id: entry, id: membership, membership: {role: :publisher}}
          end.to change { membership.reload.role }
        end

        it 'allows to edit role relating to entry of user account on user' do
          user = create(:user)
          account = create(:account, with_manager: user)
          entry_manager = create(:user)
          entry = create(:entry, account: account, with_manager: entry_manager)
          membership = create(:membership, entity: entry, user: user, role: :manager)

          sign_in(entry_manager, scope: :user)

          expect do
            patch :update, params: {user_id: user, id: membership, membership: {role: :publisher}}
          end.to change { membership.reload.role }
        end
      end

      describe 'as entry publisher' do
        it 'does not allow to edit role of member of entry account on entry' do
          user = create(:user)
          account = create(:account, with_member: user)
          entry_publisher = create(:user)
          entry = create(:entry, account: account, with_publisher: entry_publisher)
          membership = create(:membership, entity: entry, user: user, role: :previewer)

          sign_in(entry_publisher, scope: :user)

          expect do
            patch :update, params: {entry_id: entry, id: membership, membership: {role: :editor}}
          end.not_to change { membership.reload.role }
        end

        it 'does not allow to edit role relating to entry of user account on user' do
          user = create(:user)
          account = create(:account, with_member: user)
          entry_publisher = create(:user)
          entry = create(:entry, account: account, with_publisher: entry_publisher)
          membership = create(:membership, entity: entry, user: user, role: :previewer)

          sign_in(entry_publisher, scope: :user)

          expect do
            patch :update, params: {user_id: user, id: membership, membership: {role: :editor}}
          end.not_to change { membership.reload.role }
        end
      end
    end

    describe '#destroy' do
      describe 'as admin' do
        it 'allows to delete user from account' do
          user = create(:user)
          account = create(:account)
          membership = create(:membership, entity: account, user: user, role: :manager)

          sign_in(create(:user, :admin), scope: :user)

          expect do
            delete(:destroy, params: {account_id: account, id: membership})
          end.to change { account.users.count }
        end

        it 'allows to delete account from user' do
          user = create(:user)
          account = create(:account)
          membership = create(:membership, entity: account, user: user, role: :manager)

          sign_in(create(:user, :admin), scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: membership})
          end.to change { user.accounts.count }
        end

        it 'allows to delete user from entry' do
          user = create(:user)
          account = create(:account, with_member: user)
          entry = create(:entry, account: account)
          membership = create(:membership, entity: entry, user: user, role: :manager)

          sign_in(create(:user, :admin), scope: :user)

          expect do
            delete(:destroy, params: {entry_id: entry, id: membership})
          end.to change { entry.users.count }
        end

        it 'allows to delete entry from user' do
          user = create(:user)
          account = create(:account, with_member: user)
          entry = create(:entry, account: account)
          membership = create(:membership, entity: entry, user: user, role: :manager)

          sign_in(create(:user, :admin), scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: membership})
          end.to change { user.entries.count }
        end
      end

      describe 'as account admin' do
        it 'allows to delete user from own account' do
          account_admin = create(:user)
          account = create(:account, with_manager: account_admin)
          user = create(:user)
          membership = create(:membership, user: user, entity: account, role: :manager)

          sign_in(account_admin, scope: :user)

          expect do
            delete(:destroy, params: {account_id: account, id: membership})
          end.to change { account.users.count }
        end

        it 'allows to delete own account from user' do
          account_admin = create(:user)
          account = create(:account, with_manager: account_admin)
          user = create(:user)
          membership = create(:membership, user: user, entity: account, role: :manager)

          sign_in(account_admin, scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: membership})
          end.to change { user.accounts.count }
        end

        it 'deletes entry membership from user along with account membership' do
          account_admin = create(:user)
          account = create(:account, with_manager: account_admin)
          entry = create(:entry, account: account)
          user = create(:user)
          account_membership = create(:membership, user: user, entity: account, role: :manager)
          create(:membership, user: user, entity: entry)

          sign_in(account_admin, scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: account_membership})
          end.to change { user.entries.count }
        end

        it 'does not delete entry membership from other user along with account membership' do
          account_admin = create(:user)
          account = create(:account, with_manager: account_admin)
          entry = create(:entry, account: account)
          user = create(:user)
          other_user = create(:user)
          account_membership = create(:membership, user: user, entity: account, role: :manager)
          create(:membership, user: other_user, entity: entry)

          sign_in(account_admin, scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: account_membership})
          end.not_to change { user.entries.count }
        end

        it 'does not delete entry membership of other account along with account membership' do
          account_admin = create(:user)
          account = create(:account, with_manager: account_admin)
          entry = create(:entry)
          user = create(:user)
          account_membership = create(:membership, user: user, entity: account, role: :manager)
          create(:membership, user: user, entity: entry)

          sign_in(account_admin, scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: account_membership})
          end.not_to change { user.entries.count }
        end

        it 'does not delete account membership along with other account membership' do
          account_admin = create(:user)
          other_account = create(:account)
          account = create(:account, with_manager: account_admin)
          entry = create(:entry, account: account)
          user = create(:user)
          create(:membership, user: user, entity: other_account)
          account_membership = create(:membership, user: user, entity: account, role: :manager)
          create(:membership, user: user, entity: entry)

          sign_in(account_admin, scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: account_membership})
          end.not_to change { other_account.users.count }
        end

        it 'does not allow to delete user from off-limits account' do
          account_admin = create(:user)
          create(:account, with_manager: account_admin)
          off_limits_account = create(:account)
          user = create(:user)
          membership = create(:membership, user: user, entity: off_limits_account, role: :manager)

          sign_in(account_admin, scope: :user)

          expect do
            delete(:destroy, params: {account_id: off_limits_account, id: membership})
          end.not_to change { off_limits_account.users.count }
        end

        it 'does not allow to delete off-limits account from user' do
          account_admin = create(:user)
          create(:account, with_manager: account_admin)
          off_limits_account = create(:account)
          user = create(:user)
          membership = create(:membership, user: user, entity: off_limits_account, role: :manager)

          sign_in(account_admin, scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: membership})
          end.not_to change { user.accounts.count }
        end
      end

      describe 'as account publisher' do
        it 'does not allow to delete user from own account' do
          account_publisher = create(:user)
          account = create(:account, with_publisher: account_publisher)
          user = create(:user)
          membership = create(:membership, user: user, entity: account, role: :manager)

          sign_in(account_publisher, scope: :user)

          expect do
            delete(:destroy, params: {account_id: account, id: membership})
          end.not_to change { account.users.count }
        end

        it 'does not allow to delete own account from user' do
          account_publisher = create(:user)
          account = create(:account, with_publisher: account_publisher)
          user = create(:user)
          membership = create(:membership, user: user, entity: account, role: :manager)

          sign_in(account_publisher, scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: membership})
          end.not_to change { user.accounts.count }
        end
      end

      describe 'as entry admin' do
        it 'does not allow to delete user from entry in other account' do
          user = create(:user)
          entry_manager = create(:user)
          create(:account, with_member: user, with_manager: entry_manager)
          create(:entry, with_manager: entry_manager)
          membership = create(:membership, entity: create(:entry), user: user, role: :previewer)

          sign_in(entry_manager, scope: :user)

          expect {
            delete(:destroy, params: {user_id: user, id: membership})
          }.not_to change { user.entries.count }
        end

        it 'does not allow to delete entry from user in other account' do
          user = create(:user)
          entry_manager = create(:user)
          create(:account, with_member: user, with_manager: entry_manager)
          entry = create(:entry)
          membership = create(:membership, entity: entry, user: user, role: :previewer)

          sign_in(entry_manager, scope: :user)

          expect do
            delete(:destroy, params: {entry_id: entry, id: membership})
          end.not_to change { entry.users.count }
        end

        it 'allows to delete member of entry account from entry' do
          user = create(:user)
          account = create(:account, with_manager: user)
          entry_manager = create(:user)
          entry = create(:entry, account: account, with_manager: entry_manager)
          membership = create(:membership, entity: entry, user: user, role: :manager)

          sign_in(entry_manager, scope: :user)

          expect do
            delete(:destroy, params: {entry_id: entry, id: membership})
          end.to change { entry.users.count }
        end

        it 'allows to delete entry of user account from user' do
          user = create(:user)
          account = create(:account, with_manager: user)
          entry_manager = create(:user)
          entry = create(:entry, account: account, with_manager: entry_manager)
          membership = create(:membership, entity: entry, user: user, role: :manager)

          sign_in(entry_manager, scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: membership})
          end.to change { user.entries.count }
        end
      end

      describe 'as entry publisher' do
        it 'does not allow to delete member of entry account from entry' do
          user = create(:user)
          account = create(:account, with_member: user)
          entry_publisher = create(:user)
          entry = create(:entry, account: account, with_publisher: entry_publisher)
          membership = create(:membership, entity: entry, user: user, role: :previewer)

          sign_in(entry_publisher, scope: :user)

          expect do
            delete(:destroy, params: {entry_id: entry, id: membership})
          end.not_to change { entry.users.count }
        end

        it 'does not allow to delete entry of user account from user' do
          user = create(:user)
          account = create(:account, with_member: user)
          entry_publisher = create(:user)
          entry = create(:entry, account: account, with_publisher: entry_publisher)
          membership = create(:membership, entity: entry, user: user, role: :previewer)

          sign_in(entry_publisher, scope: :user)

          expect do
            delete(:destroy, params: {user_id: user, id: membership})
          end.not_to change { user.entries.count }
        end
      end
    end
  end
end
