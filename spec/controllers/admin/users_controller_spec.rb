require 'spec_helper'

module Pageflow
  describe ::Admin::UsersController do
    describe '#show' do
      render_views

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

    describe '#invite' do
      render_views

      it 'displays quota state description' do
        account = create(:account)

        Pageflow.config.quotas.register(:users, QuotaDouble.available)

        sign_in(create(:user, :manager, on: account))
        get(:new)

        expect(response.body).to have_content('Quota available')
      end
    end

    describe '#create' do
      it 'does not allow account managers to create admins' do
        account = create(:account)

        sign_in(create(:user, :manager, on: account))

        expect do
          post :create, user: attributes_for(:valid_user, admin: true)
        end.not_to change { User.admins.count }
      end

      it 'allows admins to create admins' do
        sign_in(create(:user, :admin))

        expect do
          post :create, user: attributes_for(:valid_user, admin: true)
        end.to change { User.admins.count }
      end

      it 'does not allow account manager to create users for own account' do
        account = create(:account)

        sign_in(create(:user, :manager, on: account))

        expect do
          post :create, user: attributes_for(:valid_user)
        end.to_not change { account.users.count }
      end

      it 'does not create user if quota is exhausted and e-mail is new' do
        account = create(:account)

        Pageflow.config.quotas.register(:users, QuotaDouble.exhausted)
        sign_in(create(:user, :manager, on: account))

        expect do
          request.env['HTTP_REFERER'] = admin_users_path
          post :create, user: attributes_for(:valid_user)
        end.not_to change { User.count }
      end

      it 'creates user via membership in spite of exhausted quota ' \
         'if their e-mail was already in the database' do
        account = create(:account)
        create(:user, email: 'existing_user@example.com')

        Pageflow.config.quotas.register(:users, QuotaDouble.exhausted)
        sign_in(create(:user, :manager, on: account))

        expect do
          request.env['HTTP_REFERER'] = admin_users_path
          post :create,
               user: {email: 'existing_user@example.com',
                      initial_role: :member,
                      initial_account: account}
        end.not_to change { account.users.count }
      end

      it 'creates account membership if e-mail unknown but quota allows it' do
        account = create(:account)

        sign_in(create(:user, :manager, on: account))

        expect do
          request.env['HTTP_REFERER'] = admin_users_path
          post :create,
               user: {email: 'new_user@example.com',
                      first_name: 'Adelheid',
                      last_name: 'Doe',
                      initial_role: :member,
                      initial_account: account}
        end.to change { account.users.count }
      end

      it 'creates invited user if e-mail unknown but quota allows it' do
        account = create(:account)

        sign_in(create(:user, :manager, on: account))

        expect do
          request.env['HTTP_REFERER'] = admin_users_path
          post :create,
               user: {email: 'new_user@example.com',
                      first_name: 'Wiltrud',
                      last_name: 'Doe',
                      initial_role: :member,
                      initial_account: account}
        end.to change { User.count }
      end

      it 'redirects with flash if :users quota is exhausted and e-mail is unknown' do
        account = create(:account)

        Pageflow.config.quotas.register(:users, QuotaDouble.exhausted)

        sign_in(create(:user, :manager, on: account))
        request.env['HTTP_REFERER'] = admin_users_path
        post(:create, user: attributes_for(:valid_user))

        expect(flash[:alert]).to eq(I18n.t('pageflow.quotas.exhausted'))
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
