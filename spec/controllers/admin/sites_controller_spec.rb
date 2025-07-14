require 'spec_helper'
require 'pageflow/shared_contexts/fake_translations'

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
          site = create(:site, account:)

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
          site = create(:site, account:)

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
      include_context 'fake translations'

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

      it 'does not display cutoff mode select by default' do
        pageflow_configure do |config|
          config.features.register('test_cutoff_mode') do |entry_type_config|
            entry_type_config.cutoff_modes.register(:some_cutoff, proc { true })
          end
        end
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        get(:new, params: {account_id: account})

        expect(response.body).not_to have_select('Cutoff mode')
      end

      it 'displays cutoff modes enabled for account' do
        translation(I18n.locale,
                    'pageflow.cutoff_modes.some_cutoff',
                    'Some Cutoff Mode')
        pageflow_configure do |config|
          config.features.register('test_cutoff_mode') do |entry_type_config|
            entry_type_config.cutoff_modes.register(:some_cutoff, proc { true })
          end
        end
        account = create(:account, with_feature: 'test_cutoff_mode')

        sign_in(create(:user, :admin), scope: :user)
        get(:new, params: {account_id: account})

        expect(response.body).to have_select('Cutoff mode', options: ['(None)', 'Some Cutoff Mode'])
      end

      it 'does not render root entry hint' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        get(:new, params: {account_id: account})

        expect(response.body).not_to have_selector('a[href*="/admin/site_root_entry/choose"]')
      end

      it 'displays empty custom 404 entry select for new sites' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        get(:new, params: {account_id: account})

        expect(response.body).to have_select('Custom 404 page', options: ['(Use default 404 page)'])
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

      it 'renders root entry hint if site does not have root entry' do
        site = create(:site)

        sign_in(create(:user, :admin), scope: :user)
        get(:edit, params: {account_id: site.account, id: site})

        expect(response.body)
          .to have_selector("a[href='/admin/site_root_entry/choose?site_id=#{site.id}']")
        expect(response.body)
          .to have_selector("a[href='/admin/entries/new?at=root&site_id=#{site.id}']")
      end

      it 'disabled home url field and renders link to root entry if present' do
        site = create(:site)
        entry = create(
          :entry,
          site:,
          account: site.account,
          permalink_attributes: {
            slug: '',
            allow_root_path: true
          }
        )

        sign_in(create(:user, :admin), scope: :user)
        get(:edit, params: {account_id: site.account, id: site})

        expect(response.body)
          .to have_selector("a[href='#{admin_entry_path(entry)}']")
      end

      it 'displays custom 404 entry select for existing sites' do
        site = create(:site)
        entry = create(:entry, :published, site:)

        sign_in(create(:user, :admin), scope: :user)
        get(:edit, params: {account_id: site.account, id: site})

        expect(response.body).to have_select('Custom 404 page')
      end

      it 'displays only published entries without password protection in custom 404 entry select' do
        site = create(:site)
        published_entry = create(:entry, :published, site:, title: 'Published Entry')
        unpublished_entry = create(:entry, site:, title: 'Unpublished Entry')
        password_protected_entry = create(:entry, :published_with_password, site:,
                                                                            password: 'secret', title: 'Protected Entry')

        sign_in(create(:user, :admin), scope: :user)
        get(:edit, params: {account_id: site.account, id: site})

        expect(response.body).to have_select('Custom 404 page',
                                             options: ['(Use default 404 page)', 'Published Entry'])
      end
    end

    describe '#create' do
      it 'sets attributes' do
        pageflow_configure do |config|
          config.cutoff_modes.register(:some_cutoff, proc { true })
        end
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        post(:create,
             params: {
               account_id: account,
               site: {
                 name: 'second',
                 title: 'Second Site',
                 sitemap_enabled: true,
                 feeds_enabled: true,
                 imprint_link_url: 'http://example.com/new',
                 cutoff_mode_name: 'some_cutoff'
               }
             })

        site = account.sites.last
        expect(site.imprint_link_url).to eq('http://example.com/new')
        expect(site.name).to eq('second')
        expect(site.title).to eq('Second Site')
        expect(site.sitemap_enabled?).to eq(true)
        expect(site.feeds_enabled?).to eq(true)
        expect(site.cutoff_mode_name).to eq('some_cutoff')
      end

      it 'creates root permalink directory' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        post(:create,
             params: {
               account_id: account,
               site: {
                 name: 'second'
               }
             })

        site = account.sites.last
        expect(site.permalink_directories.map(&:path)).to eq([''])
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

      it 'sets custom_404_entry_id when provided' do
        site = create(:site)
        entry = create(:entry, :published, site:)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                account_id: site.account,
                id: site,
                site: {
                  custom_404_entry_id: entry.id
                }
              })

        expect(site.reload.custom_404_entry_id).to eq(entry.id)
      end

      it 'allows nil custom_404_entry_id' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        post(:create,
             params: {
               account_id: account,
               site: {
                 name: 'test site',
                 custom_404_entry_id: ''
               }
             })

        site = account.sites.last
        expect(site.custom_404_entry_id).to be_nil
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
                title: 'New Title',
                sitemap_enabled: true,
                feeds_enabled: true,
                imprint_link_url: 'http://example.com/new'
              }
            })

        expect(site.reload.imprint_link_url).to eq('http://example.com/new')
        expect(site.name).to eq('new name')
        expect(site.title).to eq('New Title')
        expect(site.sitemap_enabled?).to eq(true)
        expect(site.feeds_enabled?).to eq(true)
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

      it 'updates custom_404_entry_id when provided' do
        site = create(:site)
        entry = create(:entry, :published, site:)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                account_id: site.account,
                id: site,
                site: {
                  custom_404_entry_id: entry.id
                }
              })

        expect(site.reload.custom_404_entry_id).to eq(entry.id)
      end

      it 'clears custom_404_entry_id when set to blank' do
        site = create(:site)
        entry = create(:entry, :published, site:)
        site.update!(custom_404_entry: entry)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                account_id: site.account,
                id: site,
                site: {
                  custom_404_entry_id: ''
                }
              })

        expect(site.reload.custom_404_entry_id).to be_nil
      end
    end
  end
end
