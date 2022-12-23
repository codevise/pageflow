require 'spec_helper'

module Admin
  describe SitesController do
    render_views

    describe '#index' do
      it 'redirects to account page' do
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)
        site = create(:site)

        get(:index,
            params: {
              account_id: site.account
            })

        expect(response)
          .to redirect_to(admin_account_path(id: site.account, tab: 'sites'))
      end
    end

    describe '#show' do
      it 'requires manager role on account' do
        site = create(:site)
        user = create(:user, :publisher, on: site.account)

        sign_in(user, scope: :user)
        get(:show, params: {account_id: site.account, id: site})

        expect(flash[:error]).to be_present
        expect(response).to redirect_to(admin_root_path)
      end

      describe 'built in admin tabs' do
        it 'displays entry templates tab' do
          site = create(:site)
          user = create(:user, :manager, on: site.account)

          sign_in(user, scope: :user)
          get(:show, params: {account_id: site.account, id: site})

          expect(response.body).to have_selector('.admin_tabs_view-tabs .entry_templates')
        end
      end

      describe 'additional admin resource tab' do
        let(:tab_view_component) do
          Class.new(Pageflow::ViewComponent) do
            def build(site)
              super('data-custom-tab' => site.cname)
            end

            def self.name
              'TabViewComponet'
            end
          end
        end

        it 'is visible for managers' do
          site = create(:site, cname: 'my.example.com')
          user = create(:user, :manager, on: site.account)

          Pageflow.config.admin_resource_tabs.register(:site,
                                                       name: :some_tab,
                                                       component: tab_view_component)
          sign_in(user, scope: :user)
          get(:show, params: {account_id: site.account, id: site})

          expect(response.body)
            .to have_selector('[data-custom-tab="my.example.com"]')
        end

        context 'with admin_only option' do
          it 'is visible for admin' do
            site = create(:site, cname: 'my.example.com')
            user = create(:user, :admin)

            Pageflow.config.admin_resource_tabs.register(:site,
                                                         name: :some_tab,
                                                         component: tab_view_component,
                                                         admin_only: true)
            sign_in(user, scope: :user)
            get(:show, params: {account_id: site.account, id: site})

            expect(response.body).to have_selector('[data-custom-tab]')
          end

          it 'is not visible for non admins' do
            site = create(:site, cname: 'my.example.com')
            user = create(:user, :manager, on: site.account)

            Pageflow.config.admin_resource_tabs.register(:site,
                                                         name: :some_tab,
                                                         component: tab_view_component,
                                                         admin_only: true)
            sign_in(user, scope: :user)
            get(:show, params: {account_id: site.account, id: site})

            expect(response.body).not_to have_selector('[data-custom-tab]')
          end
        end
      end

      describe 'additional attributes table rows' do
        it 'renders additional rows registered for site' do
          site = create(:site)
          user = create(:user, :manager, on: site.account)

          pageflow_configure do |config|
            config.admin_attributes_table_rows.register(:site, :custom) { 'custom attribute' }
          end

          sign_in(user, scope: :user)
          get(:show, params: {account_id: site.account, id: site})

          expect(response.body).to have_text('custom attribute')
        end

        it 'renders additional rows registered for site in enabled feature' do
          user = create(:user)
          account = create(:account,
                           with_manager: user,
                           with_feature: :custom_site_attribute)
          site = create(:site, account: account)

          pageflow_configure do |config|
            config.features.register('custom_site_attribute') do |feature_config|
              feature_config.admin_attributes_table_rows.register(:site, :custom) do
                'custom attribute'
              end
            end
          end

          sign_in(user, scope: :user)
          get(:show, params: {account_id: site.account, id: site})

          expect(response.body).to have_text('custom attribute')
        end

        it 'does not render additional rows registered for account in disabled feature' do
          user = create(:user)
          account = create(:account,
                           with_manager: user)
          site = create(:site, account: account)

          pageflow_configure do |config|
            config.features.register('custom_site_attribute') do |feature_config|
              feature_config.admin_attributes_table_rows.register(:site, :custom) do
                'custom attribute'
              end
            end
          end

          sign_in(user, scope: :user)
          get(:show, params: {account_id: site.account, id: site})

          expect(response.body).not_to have_text('custom attribute')
        end
      end
    end

    describe '#new' do
      it 'displays name input' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        get(:new, params: {account_id: account})

        expect(response.body).to have_selector('[name="site[name]"]')
      end

      it 'displays additional registered site form inputs' do
        account = create(:account)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:site, :custom_field)
        end

        sign_in(create(:user, :admin), scope: :user)
        get(:new, params: {account_id: account})

        expect(response.body).to have_selector('[name="site[custom_field]"]')
      end
    end

    describe '#edit' do
      it 'does not display inputs for all fields' do
        site = create(:site)

        sign_in(create(:user, :admin), scope: :user)
        get(:edit, params: {account_id: site.account, id: site})

        expect(response.body).not_to have_selector('[name="site[account_id]"]')
      end

      it 'displays additional registered site form inputs' do
        site = create(:site)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:site, :custom_field)
        end

        sign_in(create(:user, :admin), scope: :user)
        get(:edit, params: {account_id: site.account, id: site})

        expect(response.body).to have_selector('[name="site[custom_field]"]')
      end
    end

    describe '#create' do
      it 'sets attributes' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        post(:create,
             params: {
               account_id: account,
               site: {
                 name: 'second',
                 imprint_link_url: 'http://example.com/new'
               }
             })

        site = account.sites.last
        expect(site.imprint_link_url).to eq('http://example.com/new')
        expect(site.name).to eq('second')
      end

      it 'does not allow managers to create sites ' do
        account = create(:account)

        sign_in(create(:user, :manager, on: account), scope: :user)

        expect {
          post(:create,
               params: {
                 account_id: account,
                 site: {
                   name: 'second',
                   imprint_link_url: 'http://example.com/new'
                 }
               })
        }.not_to(change { account.sites.count })

        expect(flash[:error]).to be_present
      end

      it 'sets custom field registered as form input' do
        account = create(:account)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:site, :custom_field)
        end

        sign_in(create(:user, :admin), scope: :user)
        post(:create,
             params: {
               account_id: account,
               site: {
                 name: 'second',
                 custom_field: 'some value'
               }
             })

        expect(account.sites.last.custom_field).to eq('some value')
      end

      it 'does not set custom field not registered as form input' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        post(:create,
             params: {
               account_id: account,
               site: {
                 name: 'second',
                 custom_field: 'some value'
               }
             })

        expect(account.sites.last.custom_field).to eq(nil)
      end
    end

    describe '#update' do
      it 'updates attributes' do
        site = create(:site)

        sign_in(create(:user, :admin), scope: :user)
        put(:update,
            params: {
              account_id: site.account,
              id: site.id,
              site: {
                name: 'new name',
                imprint_link_url: 'http://example.com/new'
              }
            })

        expect(site.reload.imprint_link_url).to eq('http://example.com/new')
        expect(site.name).to eq('new name')
      end

      it 'does not update sites with insufficient privileges ' do
        site = create(:site, imprint_link_url: 'http://example.com/old')

        sign_in(create(:user, :manager, on: create(:account)), scope: :user)
        put(:update,
            params: {
              account_id: site.account,
              id: site.id,
              site: {
                imprint_link_url: 'http://example.com/new'
              }
            })

        expect(flash[:error]).to be_present
        expect(site.reload.imprint_link_url).to eq('http://example.com/old')
      end

      it 'does not allow updating account' do
        site = create(:site)
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        put(:update,
            params: {
              account_id: site.account,
              id: site.id,
              site: {
                account_id: account.id
              }
            })

        expect(site.reload.account).not_to eq(account)
      end

      it 'updates custom field registered as form input' do
        site = create(:site)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:site, :custom_field)
        end

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                account_id: site.account,
                id: site,
                site: {
                  custom_field: 'some value'
                }
              })

        expect(site.reload.custom_field).to eq('some value')
      end

      it 'does not update custom field not registered as form input' do
        site = create(:site)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                account_id: site.account,
                id: site,
                site: {
                  custom_field: 'some value'
                }
              })

        expect(site.reload.custom_field).to eq(nil)
      end
    end
  end
end
