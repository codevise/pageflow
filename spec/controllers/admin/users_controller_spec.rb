require 'spec_helper'

module Pageflow
  describe ::Admin::UsersController do
    describe '#show' do
      render_views

      it 'shows admin boolean for account managers' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_see_admin_boolean = false
        end

        user = create(:user, :manager, on: create(:account))

        sign_in(user)
        get(:show, id: user.id)

        expect(response.body)
          .to have_css('.status_tag_row th',
                       text: ::User.human_attribute_name(:admin))
      end

      context 'with config.permissions.only_admins_may_see_admin_boolean' do
        it 'shows admin boolean for admin' do
          pageflow_configure do |config|
            config.permissions.only_admins_may_see_admin_boolean = true
          end

          user = create(:user, :admin)

          sign_in(user)
          get(:show, id: user.id)

          expect(response.body).to have_css('.status_tag_row th',
                                            text: ::User.human_attribute_name(:admin))
        end

        it 'does not show admin boolean for account manager' do
          pageflow_configure do |config|
            config.permissions.only_admins_may_see_admin_boolean = true
          end

          user = create(:user, :manager, on: create(:account))

          sign_in(user)
          get(:show, id: user.id)

          expect(response.body).not_to have_css('.status_tag_row th',
                                                text: ::User.human_attribute_name(:admin))
        end
      end

      describe 'additional admin resource tab' do
        let(:tab_view_component) do
          Class.new(Pageflow::ViewComponent) do
            def build(user)
              super('data-custom-tab' => user.full_name)
            end

            def self.name
              'TabViewComponet'
            end
          end
        end

        let(:tab_view_selector) { '.admin_tabs_view div[data-custom-tab]' }

        it 'is visible for managers' do
          user = create(:user)
          create(:account, with_manager: user)

          Pageflow.config.admin_resource_tabs.register(:user,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       required_account_role: :manager)
          sign_in(user)
          get(:show, id: user.id)

          expect(response.body).to have_selector(tab_view_selector)
        end

        context 'with admin_only option' do
          it 'is visible for admin' do
            user = create(:user, :admin)

            Pageflow.config.admin_resource_tabs.register(:user,
                                                         name: :some_tab,
                                                         component: tab_view_component,
                                                         admin_only: true)
            sign_in(user)
            get(:show, id: user.id)

            expect(response.body).to have_selector(tab_view_selector)
          end

          it 'is not visible for non admins' do
            user = create(:user)
            create(:account, with_manager: user)

            Pageflow.config.admin_resource_tabs.register(:user,
                                                         name: :some_tab,
                                                         component: tab_view_component,
                                                         admin_only: true)
            sign_in(user)
            get(:show, id: user.id)

            expect(response.body).not_to have_selector(tab_view_selector)
          end
        end
      end
    end

    describe 'get #invitation' do
      render_views

      it 'displays quota state description' do
        account = create(:account)

        Pageflow.config.quotas.register(:users, QuotaDouble.available)

        sign_in(create(:user, :manager, on: account))
        get(:invitation)

        expect(response.body).to have_content(QuotaDouble::AVAILABLE_DESCRIPTION)
      end
    end

    describe 'post #invitation' do
      render_views

      it 'allows account managers to create user' do
        account = create(:account)

        sign_in(create(:user, :manager, on: account))

        expect {
          post(:invitation,
               invitation_form: {
                 user: attributes_for(:valid_user),
                 membership: {
                   entity_id: account.id,
                   role: 'member'
                 }
               })
        }.to change { User.count }
      end

      it 'allows account managers to create user in account with manager role' do
        account = create(:account)
        account_members = AccountMemberQuery::Scope.new(account)

        sign_in(create(:user, :manager, on: account))

        expect {
          post(:invitation,
               invitation_form: {
                 user: attributes_for(:valid_user),
                 membership: {
                   entity_id: account.id,
                   role: 'manager'
                 }
               })
        }.to change { account_members.with_role_at_least(:manager).count }
      end

      it 'create membership in account if user with email already exisits' do
        account = create(:account)
        user = create(:user, email: 'existing_user@example.com')

        sign_in(create(:user, :manager, on: account))

        expect {
          post(:invitation,
               invitation_form: {
                 user: attributes_for(:valid_user,
                                      email: user.email),
                 membership: {
                   entity_id: account.id,
                   role: 'member'
                 }
               })
        }.to change { account.users.count }
      end

      it 'responds with unprocessable entity if user is already member of account' do
        account = create(:account)
        existing_user = create(:user, :member, on: account)

        sign_in(create(:user, :manager, on: account))

        expect {
          post(:invitation,
               invitation_form: {
                 user: attributes_for(:valid_user,
                                      email: existing_user.email),
                 membership: {
                   entity_id: account.id,
                   role: 'manager'
                 }
               })
        }.not_to change { Membership.count }

        expect(response).to have_http_status(422)
        expect(response.body).to include(I18n.t('pageflow.admin.users.member_exists'))
      end

      it 'responds with unprocessable entity if initial role is invalid' do
        account = create(:account)

        sign_in(create(:user, :manager, on: account))

        expect {
          post(:invitation,
               invitation_form: {
                 user: attributes_for(:valid_user),
                 membership: {
                   entity_id: account.id,
                   role: 'superman'
                 }
               })
        }.not_to change { User.count }

        expect(response).to have_http_status(422)
      end

      it 'responds with unprocessable entity if initial account is invalid' do
        account = create(:account)

        sign_in(create(:user, :manager, on: account))

        expect {
          post(:invitation,
               invitation_form: {
                 user: attributes_for(:valid_user),
                 membership: {
                   entity_id: -1,
                   role: 'member'
                 }
               })
        }.not_to change { User.count }

        expect(response).to have_http_status(422)
      end

      it 'does not allow account managers to create admins' do
        account = create(:account)

        sign_in(create(:user, :manager, on: account))

        expect {
          post(:invitation,
               invitation_form: {
                 user: attributes_for(:valid_user,
                                      admin: true),
                 membership: {
                   entity_id: account.id,
                   role: 'member'
                 }
               })
        }.not_to change { User.admins.count }
      end

      it 'allows admins to create admins' do
        account = create(:account)

        sign_in(create(:user, :admin))

        expect {
          post(:invitation,
               invitation_form: {
                 user: attributes_for(:valid_user,
                                      admin: true),
                 membership: {
                   entity_id: account.id,
                   role: 'member'
                 }
               })
        }.to change { User.admins.count }
      end

      it 'does not allow account manager to create users for off-limits account' do
        account = create(:account)
        other_account = create(:account)

        sign_in(create(:user, :manager, on: account))

        expect {
          post(:invitation,
               invitation_form: {
                 user: attributes_for(:valid_user),
                 membership: {
                   entity_id: other_account.id,
                   role: 'member'
                 }
               })
        }.to_not change { other_account.users.count }
      end

      context 'when users quota is exhausted' do
        it 'does not create new user' do
          account = create(:account)

          Pageflow.config.quotas.register(:users, QuotaDouble.exhausted)
          sign_in(create(:user, :manager, on: account))

          expect {
            request.env['HTTP_REFERER'] = admin_users_path
            post(:invitation,
                 invitation_form: {
                   user: attributes_for(:valid_user),
                   membership: {
                     entity_id: account.id,
                     role: 'member'
                   }
                 })
          }.not_to change { User.count }
        end

        it 'does not create membership for existing user' do
          account = create(:account)
          user = create(:user)

          Pageflow.config.quotas.register(:users, QuotaDouble.exhausted)
          sign_in(create(:user, :manager, on: account))

          expect {
            request.env['HTTP_REFERER'] = admin_users_path
            post(:invitation,
                 invitation_form: {
                   user: attributes_for(:valid_user,
                                        email: user.email),
                   membership: {
                     entity_id: account.id,
                     role: 'member'
                   }
                 })
          }.not_to change { account.users.count }
        end

        it 'redirects with flash' do
          account = create(:account)

          Pageflow.config.quotas.register(:users, QuotaDouble.exhausted)
          sign_in(create(:user, :manager, on: account))

          request.env['HTTP_REFERER'] = admin_users_path
          post(:invitation,
               invitation_form: {
                 user: attributes_for(:valid_user),
                 membership: {
                   entity_id: account.id,
                   role: 'member'
                 }
               })

          expect(flash[:alert]).to eq(I18n.t('pageflow.quotas.exhausted'))
        end
      end

      context 'when config.allow_multiaccount_users is false' do
        it 'allows create new user' do
          account = create(:account)

          pageflow_configure do |config|
            config.allow_multiaccount_users = false
          end

          sign_in(create(:user, :manager, on: account))

          expect {
            post(:invitation,
                 invitation_form: {
                   user: attributes_for(:valid_user),
                   membership: {
                     entity_id: account.id,
                     role: 'manager'
                   }
                 })
          }.to change { account.users.count }
        end

        it 'does not allow to add existing users to another account' do
          account = create(:account)
          user = create(:user, email: 'existing_user@example.com')

          pageflow_configure do |config|
            config.allow_multiaccount_users = false
          end

          sign_in(create(:user, :manager, on: account))

          expect {
            post(:invitation,
                 invitation_form: {
                   user: attributes_for(:valid_user,
                                        email: user.email),
                   membership: {
                     entity_id: account.id,
                     role: 'member'
                   }
                 })
          }.not_to change { account.users.count }

          expect(response).to have_http_status(422)
        end
      end
    end

    describe '#update' do
      it 'does not allow account managers to make users admin' do
        account = create(:account)
        user = create(:user, :manager, on: account)

        sign_in(create(:user, :manager, on: account))
        patch :update, id: user, user: {admin: true}

        expect(user.reload).not_to be_admin
      end

      it 'allows admin to make users admin' do
        user = create(:user)

        sign_in(create(:user, :admin))
        patch :update, id: user, user: {admin: true}

        expect(user.reload).to be_admin
      end
    end

    describe '#me' do
      render_views

      it 'allows users to update their profile' do
        user = create(:user,
                      first_name: 'Tom',
                      last_name: 'Tomson',
                      locale: 'de')

        sign_in(user)
        patch(:me, user: {
                first_name: 'Thom',
                last_name: 'Thomson',
                locale: 'en'
              })

        expect(user.reload).to have_attributes(first_name: 'Thom',
                                               last_name: 'Thomson',
                                               locale: 'en')
      end

      it 'allows users to update their password when passing current password and confirmation' do
        user = create(:user, password: 'some!123pass')

        sign_in(user)
        patch(:me, user: {
                current_password: 'some!123pass',
                password: 'new!123pass',
                password_confirmation: 'new!123pass'
              })

        expect(user.reload.valid_password?('new!123pass')).to eq(true)
      end

      it 'does not update password when current password is not correct' do
        user = create(:user, password: 'some!123pass')

        sign_in(user)
        patch(:me, user: {
                current_password: 'wrong!123pass',
                password: 'new!123pass',
                password_confirmation: 'new!123pass'
              })

        expect(user.reload.valid_password?('some!123pass')).to eq(true)
      end

      it 'does not update password when password confirmation does not match' do
        user = create(:user, password: 'some!123pass')

        sign_in(user)
        patch(:me, user: {
                current_password: 'some!123pass',
                password: 'new!123pass',
                password_confirmation: 'other!123pass'
              })

        expect(user.reload.valid_password?('some!123pass')).to eq(true)
      end

      it 'does not allow users to make themselves admin' do
        account = create(:account)
        user = create(:user, :manager, on: account)

        sign_in(user)
        patch(:me, user: {admin: true})

        expect(user.reload).not_to be_admin
      end

      it 'does not change user name in navigation when validation fails' do
        user = create(:user,
                      first_name: 'Tom',
                      last_name: 'Thomson')

        sign_in(user)
        patch(:me, user: {
                first_name: ''
              })

        expect(response.body).to have_selector('#current_user > a', text: 'Tom Thomson')
      end
    end

    describe '#delete_me' do
      it 'allows to destroy the user by default' do
        sign_in(create(:user, password: '@qwert123'))

        expect do
          delete(:delete_me, user: {current_password: '@qwert123'})
        end.to change { User.count }
      end

      it 'does not allow to destroy the user when authorize_user_deletion non-true' do
        user = create(:user, password: '@qwert123')
        create(:membership, user: user, entity: create(:account))
        sign_in(user)
        Pageflow.config.authorize_user_deletion =
          lambda do |user_to_delete|
            if user_to_delete.accounts.all? { |account| account.users.length > 1 }
              true
            else
              'Last user on account. Permission denied'
            end
          end

        expect do
          delete(:delete_me, user: {current_password: '@qwert123'})
        end.not_to change { User.count }
      end
    end
  end
end
