require 'spec_helper'

describe Admin::EntriesController do
  render_views

  describe '#index' do
    describe 'account filter' do
      it 'is displayed for account managers' do
        account_manager = create(:user)
        create(:account, with_manager: account_manager)

        sign_in(account_manager, scope: :user)
        get :index

        expect(response.body).to have_selector('#q_account_id')
      end

      it 'is not displayed for account publishers and entry managers' do
        underprivileged_user = create(:user)
        account = create(:account, with_publisher: underprivileged_user)
        create(:entry, with_manager: underprivileged_user, account:)

        sign_in(underprivileged_user, scope: :user)
        get :index

        expect(response.body).not_to have_selector('#q_account_id')
      end
    end

    describe 'entry type filter' do
      it 'is displayed for admin' do
        user = create(:user, :admin)

        sign_in(user, scope: :user)
        get :index

        expect(response.body).to have_selector('#q_type_name')
      end

      it 'is not displayed for other users' do
        user = create(:user)
        create(:account, with_manager: user)

        sign_in(user, scope: :user)
        get :index

        expect(response.body).not_to have_selector('#q_type_name')
      end
    end

    describe 'new entry button' do
      let(:new_button_text) do
        I18n.t('active_admin.new_model',
               model: I18n.t('activerecord.models.entry.one'))
      end

      it 'is visible for account manager' do
        user = create(:user)
        create(:account, with_manager: user)

        sign_in(user, scope: :user)
        get :index

        expect(response.body).to have_text(new_button_text)
      end

      it 'is hidden for account editors' do
        user = create(:user)
        create(:account, with_editor: user)

        sign_in(user, scope: :user)
        get :index

        expect(response.body).not_to have_text(new_button_text)
      end
    end

    describe 'downloads' do
      %w[csv json xml].each do |format|
        describe "with #{format} format" do
          it 'does not include sensitive data' do
            user = create(:user, :admin)
            create(:entry, password_digest: 'secret')

            sign_in(user, scope: :user)
            get(:index, format:)

            expect(response.body).not_to include('secret')
          end
        end
      end
    end
  end

  describe '#all_option' do
    it 'includes only entries visible to user' do
      account = create(:account)
      entry = create(:entry, account:)
      create(:entry, account:)
      create(:entry)
      current_user = create(:user, :previewer, on: entry)

      sign_in(current_user)
      get(:all_options)
      option_texts = json_response(path: ['results', '*', 'text'])

      expect(option_texts).to eq([entry.title])
    end

    it 'allows filtering by site' do
      account = create(:account)
      site = create(:site, account:)
      entry = create(:entry, account:, site:)
      create(:entry, account:)
      current_user = create(:user, :manager, on: account)

      sign_in(current_user)
      get(:all_options, params: {site_id: site})
      option_texts = json_response(path: ['results', '*', 'text'])

      expect(option_texts).to eq([entry.title])
    end
  end

  describe '#eligible_sites_options' do
    it 'can be filtered by account name' do
      current_user = create(:user, :admin)
      account = create(:account, name: 'one')
      create(:account, name: 'two')

      sign_in(current_user)
      get(:eligible_sites_options, params: {account_id: account.id, term: 'one'})
      option_texts = json_response(path: ['results', '*', 'text'])

      expect(option_texts).to include('one')
      expect(option_texts).not_to include('two')
    end
  end

  describe '#show' do
    describe 'built in admin tabs' do
      it 'entry editor sees members and revisions tabs' do
        account = create(:account)
        user = create(:user)
        entry = create(:entry, account:, with_editor: user, title: 'example')

        sign_in(user, scope: :user)
        get(:show, params: {id: entry.id})

        expect(response.body).to have_selector('.admin_tabs_view-tabs .members')
        expect(response.body).to have_selector('.admin_tabs_view-tabs .revisions')
      end

      it 'account manager sees features tab' do
        user = create(:user)
        account = create(:account, with_manager: user)
        entry = create(:entry, account:)

        sign_in(user, scope: :user)
        get(:show, params: {id: entry.id})

        expect(response.body).to have_selector('.admin_tabs_view-tabs .features')
      end

      context 'with config.permissions.only_admins_may_update_features' do
        it 'account manager does not see features tab' do
          pageflow_configure do |config|
            config.permissions.only_admins_may_update_features = true
          end

          user = create(:user)
          account = create(:account, with_manager: user)
          entry = create(:entry, account:)

          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).not_to have_selector('.admin_tabs_view-tabs .features')
        end

        it 'admin sees features tab' do
          pageflow_configure do |config|
            config.permissions.only_admins_may_update_features = true
          end

          user = create(:user, admin: true)
          entry = create(:entry)

          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).to have_selector('.admin_tabs_view-tabs .features')
        end
      end

      it 'account publisher does not see features tab' do
        user = create(:user)
        account = create(:account, with_publisher: user)
        entry = create(:entry, account:)

        sign_in(user, scope: :user)
        get(:show, params: {id: entry.id})

        expect(response.body).not_to have_selector('.admin_tabs_view-tabs .features')
      end

      it 'entry manager does not see features tab' do
        user = create(:user)
        entry = create(:entry, with_manager: user)

        sign_in(user, scope: :user)
        get(:show, params: {id: entry.id})

        expect(response.body).not_to have_selector('.admin_tabs_view-tabs .features')
      end
    end

    describe 'additional admin resource tab' do
      let(:tab_view_component) do
        Class.new(Pageflow::ViewComponent) do
          def build(entry)
            super('data-custom-tab' => entry.title)
          end

          def self.name
            'TabViewComponet'
          end
        end
      end

      let(:tab_view_selector) { '.admin_tabs_view div[data-custom-tab]' }

      context 'with required_role option' do
        it 'is visible if user has required entry role' do
          user = create(:user)
          entry = create(:entry, with_publisher: user)

          Pageflow.config.admin_resource_tabs.register(:entry,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       required_role: :publisher)
          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).to have_selector(tab_view_selector)
        end

        it 'is visible for admin' do
          user = create(:user, :admin)
          entry = create(:entry)

          Pageflow.config.admin_resource_tabs.register(:entry,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       required_role: :publisher)
          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).to have_selector(tab_view_selector)
        end

        it 'is not visible if user does not have required role' do
          user = create(:user)
          entry = create(:entry, with_editor: user)

          Pageflow.config.admin_resource_tabs.register(:entry,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       required_role: :publisher)
          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).not_to have_selector(tab_view_selector)
        end
      end

      context 'with required_account_role option' do
        it 'is visible if user has required account role' do
          user = create(:user)
          account = create(:account, with_manager: user)
          entry = create(:entry, account:)

          Pageflow.config.admin_resource_tabs.register(:entry,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       required_account_role: :manager)
          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).to have_selector(tab_view_selector)
        end

        it 'is visible for admin' do
          user = create(:user, :admin)
          entry = create(:entry)

          Pageflow.config.admin_resource_tabs.register(:entry,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       required_account_role: :manager)
          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).to have_selector(tab_view_selector)
        end

        it 'is not visible if user does not have required account role' do
          user = create(:user)
          account = create(:account, with_publisher: user)
          entry = create(:entry, account:)

          Pageflow.config.admin_resource_tabs.register(:entry,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       required_account_role: :manager)
          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).not_to have_selector(tab_view_selector)
        end

        it 'is not visible if user only has entry role' do
          user = create(:user)
          entry = create(:entry, with_manager: user)

          Pageflow.config.admin_resource_tabs.register(:entry,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       required_account_role: :manager)
          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).not_to have_selector(tab_view_selector)
        end
      end

      context 'with admin_only option' do
        it 'is visible for admin' do
          user = create(:user, :admin)
          entry = create(:entry)

          Pageflow.config.admin_resource_tabs.register(:entry,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       admin_only: true)
          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).to have_selector(tab_view_selector)
        end

        it 'is not visible for non admins' do
          user = create(:user)
          account = create(:account, with_manager: user)
          entry = create(:entry, account:)

          Pageflow.config.admin_resource_tabs.register(:entry,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       admin_only: true)
          sign_in(user, scope: :user)
          get(:show, params: {id: entry.id})

          expect(response.body).not_to have_selector(tab_view_selector)
        end
      end
    end

    describe 'additional attributes table rows' do
      it 'renders additional rows registered for entry' do
        user = create(:user)
        entry = create(:entry, with_previewer: user)

        pageflow_configure do |config|
          config.admin_attributes_table_rows.register(:entry, :custom) { 'custom attribute' }
        end

        sign_in(user, scope: :user)
        get(:show, params: {id: entry.id})

        expect(response.body).to have_text('custom attribute')
      end

      it 'renders additional rows registered for entry in enabled feature' do
        user = create(:user)
        entry = create(:entry,
                       with_previewer: user,
                       with_feature: :custom_entry_attribute)

        pageflow_configure do |config|
          config.features.register('custom_entry_attribute') do |feature_config|
            feature_config.admin_attributes_table_rows.register(:entry, :custom) do
              'custom attribute'
            end
          end
        end

        sign_in(user, scope: :user)
        get(:show, params: {id: entry.id})

        expect(response.body).to have_text('custom attribute')
      end

      it 'does not render additional rows registered for entry in disabled feature' do
        user = create(:user)
        entry = create(:entry,
                       with_previewer: user)

        pageflow_configure do |config|
          config.features.register('custom_entry_attribute') do |feature_config|
            feature_config.admin_attributes_table_rows.register(:entry, :custom) do
              'custom attribute'
            end
          end
        end

        sign_in(user, scope: :user)
        get(:show, params: {id: entry.id})

        expect(response.body).not_to have_text('custom attribute')
      end
    end
  end

  describe '#new' do
    it 'displays additional registered form inputs' do
      user = create(:user)
      create(:account, with_publisher: user)

      pageflow_configure do |config|
        config.admin_form_inputs.register(:entry, :custom_field)
      end

      sign_in(user, scope: :user)
      get :new

      expect(response.body).to have_selector('[name="entry[custom_field]"]')
    end

    it 'displays account select if multiple accounts are available' do
      user = create(:user)
      create(:account, with_publisher: user)
      create(:account, with_manager: user)

      sign_in(user, scope: :user)
      get :new

      expect(response.body).to have_selector('[name="entry[account_id]"]')
    end

    it 'does not display account select if only one account is available' do
      user = create(:user)
      create(:account, with_publisher: user)

      sign_in(user, scope: :user)
      get :new

      expect(response.body).not_to have_selector('[name="entry[account_id]"]')
    end

    it 'renders site select if multiple sites are available for account' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      create(:site, account:)

      sign_in(user, scope: :user)
      get :new

      expect(response.body).to have_selector('[name="entry[site_id]"]')
    end

    it 'renders hidden site select if only one site is available for account' do
      user = create(:user)
      create(:account, with_publisher: user)

      sign_in(user, scope: :user)
      get :new

      expect(response.body).to have_selector('[name="entry[site_id]"]',
                                             visible: :hidden)
    end

    it 'does not display site select even if user is publisher of multiple accounts' do
      user = create(:user)
      create(:account, with_publisher: user)
      create(:account, with_publisher: user)

      sign_in(user, scope: :user)
      get :new

      expect(response.body).not_to have_selector('[name="entry[site_id]"]')
    end

    it 'display site select for admins' do
      user = create(:user, admin: true)
      create(:account)
      create(:account)

      sign_in(user, scope: :user)
      get :new

      expect(response.body).to have_selector('[name="entry[site_id]"]')
    end

    it 'does not display entry type select if only one entry type is available' do
      user = create(:user)
      create(:account, with_publisher: user)

      sign_in(user, scope: :user)
      get :new

      expect(response.body).not_to have_selector('[name="entry[type_name]"]')
    end

    it 'displays entry type select if multiple entry type are available' do
      pageflow_configure { |config| Pageflow::TestEntryType.register(config) }
      user = create(:user)
      create(:account, with_publisher: user)

      sign_in(user, scope: :user)
      get :new

      expect(response.body).to have_selector('[name="entry[type_name]"]')
    end

    it 'allows overriding entry type input partial in host application' do
      stub_template('pageflow/admin/entries/_entry_type_name_input.html.erb' => <<-ERB)
        <%= form.input(:entry_type,
                       as: :radio,
                       collection: entry_type_collection(entry_types)) %>
      ERB

      user = create(:user)
      create(:account, with_publisher: user)

      sign_in(user, scope: :user)
      get :new

      expect(response.body).to have_selector('li input[type="radio"]')
    end

    it 'sets configured default entry type' do
      test_entry_type = Pageflow::TestEntryType.new
      pageflow_configure do |config|
        config.entry_types.register(test_entry_type)

        config.default_entry_type = lambda do |account|
          test_entry_type if account.name == 'test'
        end
      end
      user = create(:user)
      create(:account, with_publisher: user, name: 'test')

      sign_in(user, scope: :user)
      get :new

      expect(response.body)
        .to have_selector('option[value="test"][selected]')
    end

    it 'displays permalink inputs if site has permalink directories' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      permalink_directory = create(
        :permalink_directory,
        path: 'de/',
        site: account.default_site
      )
      create(
        :permalink_directory,
        path: 'en/',
        site: account.default_site
      )

      sign_in(user, scope: :user)
      get :new

      expect(response.body)
        .to have_selector('select[name="entry[permalink_attributes][directory_id]"] '\
                          "option[value='#{permalink_directory.id}']")
      expect(response.body)
        .to have_selector('input[name="entry[permalink_attributes][slug]"]')
    end

    it 'hides permalink directory input if site has only one permalink directory' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      create(
        :permalink_directory,
        path: 'de/',
        site: account.default_site
      )

      sign_in(user, scope: :user)
      get :new

      expect(response.body).to have_selector('.pageflow_permalink.no_directories')
    end

    it 'does not display permalink inputs if site has no permalink directories' do
      user = create(:user)
      create(:account, with_publisher: user)

      sign_in(user, scope: :user)
      get :new

      expect(response.body)
        .not_to have_selector('select[name="entry[permalink_attributes][directory_id]"]')
      expect(response.body)
        .not_to have_selector('input[name="entry[permalink_attributes][slug]"]')
    end

    it 'displays host of site in permalink input' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      account.default_site.update(cname: 'some.example.com')
      create(
        :permalink_directory,
        path: '',
        site: account.default_site
      )

      sign_in(user, scope: :user)
      get :new

      expect(response.body)
        .to have_selector('.permalink_base_url', text: 'some.example.com/')
    end

    it 'prefers cononical entry url prefix in permalink input' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      account.default_site.update(canonical_entry_url_prefix: 'https://some.example.com/foo/')
      create(
        :permalink_directory,
        path: '',
        site: account.default_site
      )

      sign_in(user, scope: :user)
      get :new

      expect(response.body)
        .to have_selector('.permalink_base_url', text: 'some.example.com/foo/')
    end

    it 'lets account manager create root entry' do
      user = create(:user)
      account = create(:account, with_manager: user)
      site = create(:site, account:)
      create(:permalink_directory, site:, path: '')
      create(:permalink_directory, site:, path: 'other/')

      sign_in(user, scope: :user)
      get :new, params: {site_id: site, at: 'root'}

      expect(response.body)
        .not_to have_selector('input[name="entry[permalink_attributes][slug]"]')
      expect(response.body)
        .not_to have_selector('select[name="entry[permalink_attributes][directory_id]"]')
      expect(response.body)
        .to have_selector('input[type=hidden][name=at][value=root]', visible: false)
    end

    it 'ignores at root param if not account manger' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      create(:permalink_directory, site: account.default_site, path: '')
      create(:permalink_directory, site: account.default_site, path: 'other/')

      sign_in(user, scope: :user)
      get :new, params: {site_id: account.default_site, at: 'root'}

      expect(response.body)
        .to have_selector('input[type=text][name="entry[permalink_attributes][slug]"]')
      expect(response.body)
        .to have_selector('select[name="entry[permalink_attributes][directory_id]"]')
    end

    it 'does not allow passing sites of other account' do
      user = create(:user)
      create(:account, :with_permalinks, with_manager: user)
      site_of_other_account = create(:site, :with_root_permalink_directory)

      sign_in(user, scope: :user)

      expect {
        get :new, params: {site_id: site_of_other_account, at: 'root'}
      }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe '#create' do
    it 'does not allow account manager to create entries for other account' do
      user = create(:user)
      create(:account, with_manager: user)
      other_account = create(:account)

      sign_in(user, scope: :user)

      expect {
        post :create, params: {entry: attributes_for(:entry, account_id: other_account)}
      }.not_to(change { other_account.entries.count })
    end

    it 'does not allow account manager to create entries with custom site' do
      site = create(:site)
      create(:entry)

      user = create(:user, :manager, on: create(:account))
      sign_in(user, scope: :user)

      post :create, params: {entry: attributes_for(:entry, site_id: site)}
      entry = Pageflow::Entry.last

      expect(entry.site).to eq(entry.account.default_site)
    end

    it 'allows account publisher to create entries for own account' do
      user = create(:user)
      account = create(:account, with_publisher: user)

      sign_in(user, scope: :user)

      expect {
        post :create, params: {entry: attributes_for(:entry, account:)}
      }.to(change { account.entries.count })
    end

    it 'allows admin to set entry account' do
      account = create(:account)

      sign_in(create(:user, :admin), scope: :user)

      expect {
        post :create, params: {entry: attributes_for(:entry, account_id: account)}
      }.to(change { account.entries.count })
    end

    it 'allows admin to create entries with custom site' do
      site = create(:site)

      sign_in(create(:user, :admin), scope: :user)

      post :create, params: {entry: attributes_for(:entry, site_id: site)}

      entry = Pageflow::Entry.last

      expect(entry.site).to eq(site)
    end

    it 'sets entry site to default site of account' do
      account = create(:account)

      sign_in(create(:user, :admin), scope: :user)
      post :create, params: {entry: attributes_for(:entry, account_id: account)}

      expect(Pageflow::Entry.last.site).to eq(account.default_site)
    end

    it 'allows account publisher to define custom field registered as form input' do
      user = create(:user)
      create(:account, with_publisher: user)

      pageflow_configure do |config|
        config.admin_form_inputs.register(:entry, :custom_field)
      end

      sign_in(user, scope: :user)
      post(:create, params: {entry: {title: 'some_title', custom_field: 'some value'}})

      expect(Pageflow::Entry.last.custom_field).to eq('some value')
    end

    it 'does not allow account publisher to define custom field not registered as form input' do
      user = create(:user)
      create(:account, with_publisher: user)

      sign_in(user, scope: :user)
      post(:create, params: {entry: {title: 'some_title', custom_field: 'some value'}})

      expect(Pageflow::Entry.last.custom_field).to eq(nil)
    end

    it "sets the entry revisions locale to the default locale of the sites's "\
       'first paged entry template' do
      user = create(:user, locale: 'en')
      account = create(:account, with_publisher: user)
      account.default_site.first_paged_entry_template.update(default_locale: user.locale)

      sign_in(user, scope: :user)
      post(:create, params: {entry: {title: 'some_title'}})

      expect(Pageflow::Entry.last.revisions.first.locale).to eq('en')
    end

    it 'allows selecting entry type even if default is configured' do
      pageflow_configure do |config|
        test_entry_type = Pageflow::TestEntryType.register(config)
        config.default_entry_type = ->(_account) { test_entry_type }
      end
      user = create(:user)
      create(:account, with_publisher: user)

      sign_in(user, scope: :user)
      post(:create, params: {entry: {title: 'some title2', type_name: 'paged'}})

      expect(Pageflow::Entry.last.type_name).to eq('paged')
    end

    it 'creates permalink when site has permalink directories' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      permalink_directory = create(
        :permalink_directory,
        site: account.default_site
      )

      sign_in(user, scope: :user)
      post(
        :create,
        params: {
          entry: {
            title: 'some title2',
            permalink_attributes: {
              slug: 'custom-slug',
              directory_id: permalink_directory
            }
          }
        }
      )

      expect(Pageflow::Entry.last.permalink).to have_attributes(slug: 'custom-slug')
    end

    it 'lets account manager create root entry' do
      user = create(:user)
      account = create(:account, :with_permalinks, with_manager: user)

      sign_in(user, scope: :user)
      post(
        :create,
        params: {
          at: 'root',
          entry: {
            title: 'Overview'
          }
        }
      )

      expect(account.default_site.entries.last.permalink).to have_attributes(slug: '')
    end

    it 'does not let account publisher create root entry' do
      user = create(:user)
      account = create(:account, :with_permalinks, with_publisher: user)

      sign_in(user, scope: :user)
      post(
        :create,
        params: {
          entry: {
            at: 'root',
            title: 'Overview',
            permalink_attributes: {
              slug: '',
              directory_id: account.default_site.root_permalink_directory
            }
          }
        }
      )

      expect(account.default_site.entries.last.permalink).to have_attributes(slug: 'overview')
    end

    it 'invokes entry_creared hook' do
      account = create(:account)
      subscriber = double('subscriber', call: nil)
      Pageflow.config.hooks.on(:entry_created, subscriber)

      sign_in(create(:user, :manager, on: account))
      post(:create, params: {entry: {title: 'some_title'}})

      expect(subscriber).to have_received(:call).with(entry: kind_of(Pageflow::Entry))
    end

    it 'does not invoke entry_creared hook if validation fails' do
      account = create(:account)
      subscriber = double('subscriber', call: nil)
      Pageflow.config.hooks.on(:entry_created, subscriber)

      sign_in(create(:user, :manager, on: account))
      expect {
        post(:create, params: {entry: {title: ''}})
      }.not_to(change { Pageflow::Entry.count })

      expect(response.body).to have_selector('.error')
      expect(subscriber).not_to have_received(:call)
    end

    it 'renders validation error if permalink directory belongs to different site' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      create(
        :permalink_directory,
        site: account.default_site
      )
      permalink_directory_of_other_account = create(
        :permalink_directory
      )

      sign_in(user, scope: :user)
      post(
        :create,
        params: {
          entry: {
            title: 'some title2',
            permalink_attributes: {
              slug: 'custom-slug',
              directory_id: permalink_directory_of_other_account
            }
          }
        }
      )

      expect(response.body).to have_selector('.pageflow_permalink.error')
    end

    it 'redirects to entry admin page by default' do
      user = create(:user)
      account = create(:account, with_publisher: user)

      sign_in(user, scope: :user)

      post :create, params: {entry: attributes_for(:entry, account:)}

      expect(request).to redirect_to(admin_entry_path(Pageflow::Entry.last))
    end

    it 'redirects to editor if after_entry_create is set to editor' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      Pageflow.config.after_entry_create_redirect_to = :editor

      sign_in(user, scope: :user)

      post :create, params: {entry: attributes_for(:entry, account:)}

      expect(request).to(
        redirect_to(
          Pageflow::Engine.routes.url_helpers.editor_entry_path(Pageflow::Entry.last)
        )
      )
    end
  end

  describe '#edit' do
    it 'does not display entry type select even if multiple entry type are available' do
      pageflow_configure { |config| Pageflow::TestEntryType.register(config) }
      user = create(:user)
      entry = create(:entry, with_editor: user)

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body).not_to have_selector('[name="entry[type_name]"]')
    end

    it 'displays additional registered form inputs' do
      user = create(:user)
      entry = create(:entry, with_editor: user)

      pageflow_configure do |config|
        config.admin_form_inputs.register(:entry, :custom_field)
      end

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body).to have_selector('[name="entry[custom_field]"]')
    end

    it 'displays additional form inputs registered inside enabled feature' do
      user = create(:user)
      entry = create(:entry,
                     with_editor: user,
                     feature_states: {custom_entry_field: true})

      pageflow_configure do |config|
        config.features.register('custom_entry_field') do |feature_config|
          feature_config.admin_form_inputs.register(:entry, :custom_field)
        end
      end

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body).to have_selector('[name="entry[custom_field]"]')
    end

    it 'does not display additional form inputs registered inside disabled feature' do
      user = create(:user)
      entry = create(:entry,
                     with_editor: user,
                     feature_states: {custom_entry_field: false})

      pageflow_configure do |config|
        config.features.register('custom_entry_field') do |feature_config|
          feature_config.admin_form_inputs.register(:entry, :custom_field)
        end
      end

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body).not_to have_selector('[name="entry[custom_field]"]')
    end

    it 'displays permalink inputs if permalink is present' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      entry = create(
        :entry,
        account:,
        permalink_attributes: {
          directory_path: 'de/',
          slug: 'my-slug'
        }
      )
      create(:permalink_directory,
             site: entry.site,
             path: 'en/')

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body)
        .to have_selector('select[name="entry[permalink_attributes][directory_id]"] '\
                          "option[selected][value='#{entry.permalink.directory.id}']")
      expect(response.body)
        .to have_selector('input[name="entry[permalink_attributes][slug]"]' \
                          '[value=my-slug]')
    end

    it 'displays permalink inputs if site has permalink directories' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      permalink_directory = create(
        :permalink_directory,
        path: 'de/',
        site: account.default_site
      )
      create(
        :permalink_directory,
        path: 'en/',
        site: account.default_site
      )
      entry = create(
        :entry,
        account:
      )

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body)
        .to have_selector('select[name="entry[permalink_attributes][directory_id]"] '\
                          "option[value='#{permalink_directory.id}']")
      expect(response.body)
        .to have_selector('input[name="entry[permalink_attributes][slug]"]')
    end

    it 'hides permalink directory input if site has only one permalink directories' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      create(
        :permalink_directory,
        path: 'de/',
        site: account.default_site
      )
      entry = create(
        :entry,
        account:
      )

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body).to have_selector('.pageflow_permalink.no_directories')
    end

    it 'does not display permalink inputs if site has no permalink directories' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body)
        .not_to have_selector('select[name="entry[permalink_attributes][directory_id]"]')
      expect(response.body)
        .not_to have_selector('input[name="entry[permalink_attributes][slug]"]')
    end

    it 'sets data-root-permalink to false by default' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      entry = create(
        :entry,
        account:
      )

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body)
        .to have_selector('form[data-root-permalink=false]')
    end

    it 'sets data-root-permalink to false if entry has slug' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      entry = create(
        :entry,
        account:,
        permalink_attributes: {
          slug: 'slug'
        }
      )

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body)
        .to have_selector('form[data-root-permalink=false]')
    end

    it 'sets data-root-permalink to true if entry is site root' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      entry = create(
        :entry,
        account:,
        permalink_attributes: {
          directory_path: '',
          slug: '',
          allow_root_path: true
        }
      )

      sign_in(user, scope: :user)
      get :edit, params: {id: entry}

      expect(response.body)
        .to have_selector('form[data-root-permalink=true]')
    end
  end

  describe '#update' do
    it 'does not allow account editor of two accounts to change account of entry they manage' do
      user = create(:user)
      account = create(:account, with_editor: user)
      other_account = create(:account, with_editor: user)
      entry = create(:entry, account:, with_manager: user)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {account_id: other_account}}

      expect(entry.reload.account).to eq(account)
    end

    it 'does not allow account publisher of one account to change account of entry' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      other_account = create(:account)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {account_id: other_account}}

      expect(entry.reload.account).to eq(account)
    end

    it 'allows account publisher of two accounts to change accounts of entry' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      other_account = create(:account, with_publisher: user)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {account_id: other_account}}

      expect(entry.reload.account).to eq(other_account)
    end

    context 'without config.permissions.only_admins_may_update_site' do
      it 'does not change entry site when account publisher moves entry to other account' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_site = false
        end

        user = create(:user)
        account = create(:account, with_publisher: user)
        other_account = create(:account, with_publisher: user)
        entry = create(:entry, account:)

        sign_in(user, scope: :user)
        patch :update, params: {id: entry, entry: {account_id: other_account}}

        expect(entry.reload.site).to eq(account.default_site)
      end
    end

    context 'with config.permissions.only_admins_may_update_site' do
      it 'updates entry site to default site of new account ' \
         ' when account publisher moves entry to other account' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_site = true
        end

        user = create(:user)
        account = create(:account, with_publisher: user)
        other_account = create(:account, with_publisher: user)
        entry = create(:entry, account:)

        sign_in(user, scope: :user)
        patch :update, params: {id: entry, entry: {account_id: other_account}}

        expect(entry.reload.site).to eq(other_account.default_site)
      end

      it 'does not change custom entry site when account publisher updates entry ' \
         'without changing the account' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_site = true
        end

        user = create(:user)
        account = create(:account, with_publisher: user)
        custom_site = create(:site)
        entry = create(:entry, account:, site: custom_site)

        sign_in(user, scope: :user)
        patch :update, params: {id: entry, entry: {title: 'Some new title'}}

        expect(entry.reload.site).to eq(custom_site)
      end

      it 'does not change entry site when admin moves entry to other account' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_site = true
        end

        user = create(:user, :admin)
        account = create(:account)
        other_account = create(:account)
        entry = create(:entry, account:)

        sign_in(user, scope: :user)
        patch :update, params: {id: entry, entry: {account_id: other_account}}

        expect(entry.reload.site).to eq(account.default_site)
      end
    end

    it 'allows admin to change account' do
      account = create(:account)
      other_account = create(:account)

      entry = create(:entry, account:)
      sign_in(create(:user, :admin), scope: :user)
      patch :update, params: {id: entry, entry: {account_id: other_account}}

      expect(entry.reload.account).to eq(other_account)
    end

    it 'does not allow entry manager and account editor to change site' do
      user = create(:user)
      account = create(:account, with_editor: user)
      site = create(:site, account:)
      other_site = create(:site, account:)
      entry = create(:entry, site:, account:, with_manager: user)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {site_id: other_site}}

      expect(entry.reload.site).to eq(site)
    end

    it 'allows account publisher to change site' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      site = create(:site, account:)
      other_site = create(:site, account:)
      entry = create(:entry, site:, account:)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {site_id: other_site}}

      expect(entry.reload.site).to eq(other_site)
    end

    it 'does not allow account publisher to switch to site of other account they manage' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      other_account = create(:account, with_manager: user)
      site = create(:site, account:)
      other_site = create(:site, account: other_account)
      entry = create(:entry, site:, account:)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {site_id: other_site}}

      expect(entry.reload.site).to eq(site)
    end

    it 'allows admin to change site' do
      site = create(:site)
      other_site = create(:site)
      entry = create(:entry, site:)

      sign_in(create(:user, :admin), scope: :user)
      patch :update, params: {id: entry, entry: {site_id: other_site}}

      expect(entry.reload.site).to eq(other_site)
    end

    it 'does not allow entry manager and account editor to change folder' do
      user = create(:user)
      account = create(:account, with_editor: user)
      folder = create(:folder, account:)
      entry = create(:entry, account:, with_manager: user)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {folder_id: folder}}

      expect(entry.reload.folder).to eq(nil)
    end

    it 'allows account publisher to change folder of entry of account they publish on' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      folder = create(:folder, account:)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {folder_id: folder}}

      expect(entry.reload.folder).to eq(folder)
    end

    it 'does not allow account manager to change folder of entry of other account' do
      user_account = create(:account)
      user = create(:user, :manager, on: user_account)
      folder = create(:folder)
      entry = create(:entry, account: folder.account)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {folder_id: folder}}

      expect(entry.reload.folder).to eq(nil)
    end

    it 'allows admin to change folder of entry of any account' do
      user = create(:user, :admin)
      folder = create(:folder)
      entry = create(:entry, account: folder.account)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {folder_id: folder}}

      expect(entry.reload.folder).to eq(folder)
    end

    it 'allows admin to update feature_configuration through feature_states param' do
      user = create(:user, :admin)
      entry = create(:entry)

      sign_in(user, scope: :user)
      patch(:update,
            params: {
              id: entry.id,
              entry: {
                feature_states: {
                  fancy_page_type: 'enabled'
                }
              }
            })

      expect(entry.reload.feature_state('fancy_page_type')).to eq(true)
    end

    it 'allows account manager to update feature_configuration through feature_states param' do
      user = create(:user)
      account = create(:account, with_manager: user)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      patch(:update,
            params: {
              id: entry.id,
              entry: {
                feature_states: {
                  fancy_page_type: 'enabled'
                }
              }
            })

      expect(entry.reload.feature_state('fancy_page_type')).to eq(true)
    end

    context 'with config.permissions.only_admins_may_update_features' do
      it 'allows admin to update feature_configuration through feature_states param' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_features = true
        end

        user = create(:user, :admin)
        entry = create(:entry)

        sign_in(user, scope: :user)
        patch(:update,
              params: {
                id: entry.id,
                entry: {
                  feature_states: {
                    fancy_page_type: 'enabled'
                  }
                }
              })

        expect(entry.reload.feature_state('fancy_page_type')).to eq(true)
      end

      it 'does not allow account manager to update feature_configuration' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_features = true
        end

        user = create(:user)
        account = create(:account, with_manager: user)
        entry = create(:entry, account:)

        sign_in(user, scope: :user)
        patch(:update,
              params: {
                id: entry.id,
                entry: {
                  feature_states: {
                    fancy_page_type: 'enabled'
                  }
                }
              })

        expect(entry.reload.feature_state('fancy_page_type')).not_to eq(true)
      end
    end

    it 'does not allow account publisher and entry manager to update feature_configuration' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      entry = create(:entry, account:, with_manager: user)

      sign_in(user, scope: :user)
      patch(:update,
            params: {
              id: entry.id,
              entry: {
                feature_states: {
                  fancy_page_type: 'enabled'
                }
              }
            })

      expect(entry.reload.feature_state('fancy_page_type')).not_to eq(true)
    end

    it 'allows entry editor to change custom field registered as form input' do
      user = create(:user)
      entry = create(:entry, with_editor: user)

      pageflow_configure do |config|
        config.admin_form_inputs.register(:entry, :custom_field)
      end

      sign_in(user, scope: :user)
      patch(:update, params: {id: entry, entry: {custom_field: 'some value'}})

      expect(entry.reload.custom_field).to eq('some value')
    end

    it 'does not allow entry editor to change custom field not registered as form input' do
      user = create(:user)
      entry = create(:entry, with_editor: user)

      sign_in(user, scope: :user)
      patch(:update, params: {id: entry, entry: {custom_field: 'some value'}})

      expect(entry.reload.custom_field).to eq(nil)
    end

    it 'allows account publisher to update permalink' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      permalink_directory = create(
        :permalink_directory,
        site: account.default_site
      )
      entry = create(
        :entry,
        account:,
        permalink_attributes: {slug: 'old-slug'}
      )

      sign_in(user, scope: :user)
      patch(
        :update,
        params: {
          id: entry,
          entry: {
            permalink_attributes: {
              slug: 'new-slug',
              directory_id: permalink_directory
            }
          }
        }
      )

      expect(entry.permalink.reload).to have_attributes(slug: 'new-slug')
    end

    it 'redirects back to tab' do
      entry = create(:entry)

      sign_in(create(:user, :admin), scope: :user)
      patch(:update,
            params: {
              id: entry.id,
              entry: {},
              tab: 'features'
            })

      expect(response).to redirect_to(admin_entry_path(entry, tab: 'features'))
    end
  end

  describe '#preview' do
    it 'response redirects to draft revision' do
      user = create(:user)
      entry = create(:entry, with_previewer: user)

      sign_in(user, scope: :user)
      get(:preview, params: {id: entry})

      expect(response).to redirect_to("/revisions/#{entry.draft.id}")
    end

    it 'requires the signed in user to be member of the parent entry' do
      user = create(:user)
      entry = create(:entry)

      sign_in(user, scope: :user)
      get(:preview, params: {id: entry})

      expect(response).to redirect_to(admin_root_path)
    end
  end

  describe '#snapshot' do
    it 'does not allow user to snapshot entry they are not member of' do
      account = create(:account)
      entry = create(:entry, account:)

      sign_in(create(:user))

      expect {
        post(:snapshot, params: {id: entry.id})
      }.not_to(change { entry.revisions.count })
    end

    it 'allows account editor to snapshot entries of own account' do
      user = create(:user)
      account = create(:account, with_editor: user)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)
      post(:snapshot, params: {id: entry.id})

      expect {
        post(:snapshot, params: {id: entry.id})
      }.to(change { entry.revisions.count })
    end

    it 'allows admin to snapshot entries of other accounts' do
      entry = create(:entry)

      sign_in(create(:user, :admin), scope: :user)
      post(:snapshot, params: {id: entry.id})

      expect {
        post(:snapshot, params: {id: entry.id})
      }.to(change { entry.revisions.count })
    end

    it 'allows editor to snapshot their entries' do
      user = create(:user)
      entry = create(:entry, with_editor: user)

      sign_in(user, scope: :user)
      post(:snapshot, params: {id: entry.id})

      expect {
        post(:snapshot, params: {id: entry.id})
      }.to(change { entry.revisions.count })
    end
  end

  describe '#duplicate' do
    it 'does not allow account editor to duplicate own entries of own account' do
      user = create(:user)
      account = create(:account, with_editor: user)
      entry = create(:entry, account:, with_editor: user)

      sign_in(user, scope: :user)

      expect {
        post(:duplicate, params: {id: entry.id})
      }.not_to(change { Pageflow::Entry.count })
    end

    it 'allows entry publisher to duplicate entry' do
      user = create(:user)
      entry = create(:entry, with_publisher: user)

      sign_in(user, scope: :user)

      expect {
        post(:duplicate, params: {id: entry.id})
      }.to(change { Pageflow::Entry.count })
    end

    it 'allows admin to duplicate entries of other accounts' do
      create(:account)
      entry = create(:entry)

      sign_in(create(:user, :admin), scope: :user)

      expect {
        post(:duplicate, params: {id: entry.id})
      }.to(change { Pageflow::Entry.count })
    end
  end

  describe '#destroy' do
    it 'allows account manager to destroy entry' do
      user = create(:user)
      account = create(:account, with_manager: user)
      entry = create(:entry, account:)

      sign_in(user, scope: :user)

      expect { delete(:destroy, params: {id: entry}) }.to(change { Pageflow::Entry.count })
    end

    it 'does not allow account publisher and entry manager to destroy entry' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      entry = create(:entry, with_manager: user, account:)

      sign_in(user, scope: :user)

      expect { delete(:destroy, params: {id: entry}) }.not_to(change { Pageflow::Entry.count })
    end

    it 'allows admin to destroy entry' do
      user = create(:user, :admin)
      entry = create(:entry)

      sign_in(user, scope: :user)

      expect { delete(:destroy, params: {id: entry}) }.to(change { Pageflow::Entry.count })
    end
  end

  describe 'get #entry_site_and_type_name_input' do
    render_views

    it 'is allowed for account publisher' do
      account = create(:account)

      sign_in(create(:user, :manager, on: account))
      get(:entry_site_and_type_name_input, params: {account_id: account})

      expect(response.status).to eq(200)
    end

    it 'renders site select if multiple sites are available' do
      account = create(:account)
      create(:site, account:)

      sign_in(create(:user, :manager, on: account))
      get(:entry_site_and_type_name_input, params: {account_id: account})

      expect(response.body).to have_selector('li > select[name="entry[site_id]"]')
      expect(response.body).to have_selector('select[name="entry[site_id]"] option[selected]')
    end

    it 'selects default site of account' do
      account = create(:account)
      create(:site, account:)

      sign_in(create(:user, :manager, on: account))
      get(:entry_site_and_type_name_input, params: {account_id: account})

      expect(response.body)
        .to have_selector("select[name='entry[site_id]'] " \
                          "option[selected][value=#{account.default_site.id}]")
    end

    it 'renders invisible site select if only one site is available' do
      account = create(:account)

      sign_in(create(:user, :manager, on: account))
      get(:entry_site_and_type_name_input, params: {account_id: account})

      expect(response.body).to have_selector('li > select[name="entry[site_id]"]',
                                             visible: :hidden)
    end

    it 'renders type select without layout if multiple entry types are available' do
      pageflow_configure { |config| Pageflow::TestEntryType.register(config) }
      account = create(:account)

      sign_in(create(:user, :manager, on: account))
      get(:entry_site_and_type_name_input, params: {account_id: account})

      expect(response.body).not_to have_selector('body.active_admin')
      expect(response.body).to have_selector('li > select[name="entry[type_name]"]')
    end

    it 'renders invisible type select if only one entry type is available' do
      account = create(:account)

      sign_in(create(:user, :manager, on: account))
      get(:entry_site_and_type_name_input, params: {account_id: account})

      expect(response.body).to have_selector('li > select[name="entry[type_name]"]',
                                             visible: :hidden)
    end

    it 'allows passing in selected entry type name' do
      pageflow_configure { |config| Pageflow::TestEntryType.register(config) }
      account = create(:account)

      sign_in(create(:user, :manager, on: account))
      get(:entry_site_and_type_name_input, params: {
            account_id: account,
            entry_type_name: 'test'
          })

      expect(response.body)
        .to have_selector('select[name="entry[type_name]"] option[value=test][selected]')
    end

    it 'is forbidden for account editor' do
      account = create(:account)

      sign_in(create(:user, :editor, on: account))
      get(:entry_site_and_type_name_input, params: {account_id: account})

      expect(response.status).to eq(403)
    end
  end

  describe 'get #permalinks_inputs' do
    render_views

    it 'is allowed for account publisher' do
      account = create(:account)

      sign_in(create(:user, :publisher, on: account))
      get(:permalink_inputs, params: {entry: {account_id: account}})

      expect(response.status).to eq(200)
    end

    it 'is forbidden for other account' do
      account = create(:account)
      other_account = create(:account)

      sign_in(create(:user, :manager, on: account))
      get(:permalink_inputs, params: {entry: {account_id: other_account}})

      expect(response.status).to eq(403)
    end

    it 'renders inputs without layout if site has permalink directories' do
      account = create(:account)
      create(:permalink_directory, site: account.default_site, path: 'en/')
      create(:permalink_directory, site: account.default_site, path: 'de/')

      sign_in(create(:user, :publisher, on: account))
      get(:permalink_inputs, params: {entry: {account_id: account}})

      expect(response.body).not_to have_selector('body.active_admin')
      expect(response.body)
        .to have_selector('#entry_permalink_attributes_permalink_input')
      expect(response.body)
        .to have_selector('select[name="entry[permalink_attributes][directory_id]"]')
    end

    it 'allows passing site' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      other_account = create(:account, with_publisher: user)
      create(:permalink_directory, site: other_account.default_site, path: 'en/')
      create(:permalink_directory, site: other_account.default_site, path: 'de/')

      sign_in(user)
      get(:permalink_inputs,
          params: {
            entry: {
              account_id: account,
              site_id: other_account.default_site
            }
          })

      expect(response.body)
        .to have_selector('select[name="entry[permalink_attributes][directory_id]"]')
    end

    it 'prefills slug based on passed title' do
      account = create(:account)
      create(:permalink_directory, site: account.default_site)

      sign_in(create(:user, :publisher, on: account))
      get(:permalink_inputs,
          params: {
            entry: {
              account_id: account,
              title: 'Some Title'
            }
          })

      expect(response.body)
        .to have_selector('input[name="entry[permalink_attributes][slug]"]' \
                         '[data-placeholder="some-title"]')
    end

    it 'renders hidden permalink field without inputs if no permalink directories' do
      account = create(:account)

      sign_in(create(:user, :manager, on: account))
      get(:permalink_inputs, params: {entry: {account_id: account}})

      expect(response.body)
        .to have_selector('#entry_permalink_attributes_permalink_input',
                          visible: false)
      expect(response.body)
        .not_to have_selector('input[name="entry[permalink_attributes][slug]"]',
                              visible: false)
    end

    it 'is forbidden for account editor' do
      account = create(:account)

      sign_in(create(:user, :editor, on: account))
      get(:permalink_inputs, params: {entry: {account_id: account}})

      expect(response.status).to eq(403)
    end
  end
end
