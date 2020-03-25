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
        create(:entry, with_manager: underprivileged_user, account: account)

        sign_in(underprivileged_user, scope: :user)
        get :index

        expect(response.body).not_to have_selector('#q_account_id')
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
      %w(csv json xml).each do |format|
        describe "with #{format} format" do
          it 'does not include sensitive data' do
            user = create(:user, :admin)
            create(:entry, password_digest: 'secret')

            sign_in(user, scope: :user)
            get(:index, format: format)

            expect(response.body).not_to include('secret')
          end
        end
      end
    end
  end

  describe '#eligible_themings_options' do
    it 'can be filtered by account name' do
      current_user = create(:user, :admin)
      account = create(:account, name: 'one')
      create(:account, name: 'two')
      entry = create(:entry, account: account)

      sign_in(current_user)
      get(:eligible_themings_options, params: {entry_id: entry.id, term: 'one'})
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
        entry = create(:entry, account: account, with_editor: user, title: 'example')

        sign_in(user, scope: :user)
        get(:show, params: {id: entry.id})

        expect(response.body).to have_selector('.admin_tabs_view-tabs .members')
        expect(response.body).to have_selector('.admin_tabs_view-tabs .revisions')
      end

      it 'account manager sees features tab' do
        user = create(:user)
        account = create(:account, with_manager: user)
        entry = create(:entry, account: account)

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
          entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

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
          entry = create(:entry, account: account)

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
          entry = create(:entry, account: account)

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
          entry = create(:entry, account: account)

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
  end

  describe '#create' do
    it 'does not allow account manager to create entries for other account' do
      user = create(:user)
      create(:account, with_manager: user)
      other_account = create(:account)

      sign_in(user, scope: :user)

      expect do
        post :create, params: {entry: attributes_for(:entry, account_id: other_account)}
      end.not_to change { other_account.entries.count }
    end

    it 'does not allow account manager to create entries with custom theming' do
      theming = create(:theming)
      create(:entry)

      user = create(:user, :manager, on: create(:account))
      sign_in(user, scope: :user)

      post :create, params: {entry: attributes_for(:entry, theming_id: theming)}
      entry = Pageflow::Entry.last

      expect(entry.theming).to eq(entry.account.default_theming)
    end

    it 'allows account publisher to create entries for own account' do
      user = create(:user)
      account = create(:account, with_publisher: user)

      sign_in(user, scope: :user)

      expect do
        post :create, params: {entry: attributes_for(:entry, account: account)}
      end.to change { account.entries.count }
    end

    it 'allows admin to set entry account' do
      account = create(:account)

      sign_in(create(:user, :admin), scope: :user)

      expect do
        post :create, params: {entry: attributes_for(:entry, account_id: account)}
      end.to change { account.entries.count }
    end

    it 'allows admin to create entries with custom theming' do
      theming = create(:theming)

      sign_in(create(:user, :admin), scope: :user)

      post :create, params: {entry: attributes_for(:entry, theming_id: theming)}

      entry = Pageflow::Entry.last

      expect(entry.theming).to eq(theming)
    end

    it 'sets entry theming to default theming of account' do
      account = create(:account)

      sign_in(create(:user, :admin), scope: :user)
      post :create, params: {entry: attributes_for(:entry, account_id: account)}

      expect(Pageflow::Entry.last.theming).to eq(account.default_theming)
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

    it "sets the entry revisions locale to the default locale of the account's "\
       'first paged entry template' do
      user = create(:user, locale: 'en')
      account = create(:account, with_publisher: user)
      account.first_paged_entry_template.update(default_locale: user.locale)

      sign_in(user, scope: :user)
      post(:create, params: {entry: {title: 'some_title'}})

      expect(Pageflow::Entry.last.revisions.first.locale).to eq('en')
    end
  end

  describe '#edit' do
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
  end

  describe '#update' do
    it 'does not allow account editor of two accounts to change account of entry they manage' do
      user = create(:user)
      account = create(:account, with_editor: user)
      other_account = create(:account, with_editor: user)
      entry = create(:entry, account: account, with_manager: user)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {account_id: other_account}}

      expect(entry.reload.account).to eq(account)
    end

    it 'does not allow account publisher of one account to change account of entry' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      other_account = create(:account)
      entry = create(:entry, account: account)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {account_id: other_account}}

      expect(entry.reload.account).to eq(account)
    end

    it 'allows account publisher of two accounts to change accounts of entry' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      other_account = create(:account, with_publisher: user)
      entry = create(:entry, account: account)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {account_id: other_account}}

      expect(entry.reload.account).to eq(other_account)
    end

    context 'without config.permissions.only_admins_may_update_theming' do
      it 'does not change entry theming when account publisher moves entry to other account' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_theming = false
        end

        user = create(:user)
        account = create(:account, with_publisher: user)
        other_account = create(:account, with_publisher: user)
        entry = create(:entry, account: account)

        sign_in(user, scope: :user)
        patch :update, params: {id: entry, entry: {account_id: other_account}}

        expect(entry.reload.theming).to eq(account.default_theming)
      end
    end

    context 'with config.permissions.only_admins_may_update_theming' do
      it 'updates entry theming to default theming of new account ' \
         ' when account publisher moves entry to other account' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_theming = true
        end

        user = create(:user)
        account = create(:account, with_publisher: user)
        other_account = create(:account, with_publisher: user)
        entry = create(:entry, account: account)

        sign_in(user, scope: :user)
        patch :update, params: {id: entry, entry: {account_id: other_account}}

        expect(entry.reload.theming).to eq(other_account.default_theming)
      end

      it 'does not change custom entry theming when account publisher updates entry ' \
         'without changing the account' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_theming = true
        end

        user = create(:user)
        account = create(:account, with_publisher: user)
        custom_theming = create(:theming)
        entry = create(:entry, account: account, theming: custom_theming)

        sign_in(user, scope: :user)
        patch :update, params: {id: entry, entry: {title: 'Some new title'}}

        expect(entry.reload.theming).to eq(custom_theming)
      end

      it 'does not change entry theming when admin moves entry to other account' do
        pageflow_configure do |config|
          config.permissions.only_admins_may_update_theming = true
        end

        user = create(:user, :admin)
        account = create(:account)
        other_account = create(:account)
        entry = create(:entry, account: account)

        sign_in(user, scope: :user)
        patch :update, params: {id: entry, entry: {account_id: other_account}}

        expect(entry.reload.theming).to eq(account.default_theming)
      end
    end

    it 'allows admin to change account' do
      account = create(:account)
      other_account = create(:account)

      entry = create(:entry, account: account)
      sign_in(create(:user, :admin), scope: :user)
      patch :update, params: {id: entry, entry: {account_id: other_account}}

      expect(entry.reload.account).to eq(other_account)
    end

    it 'does not allow entry manager and account editor to change theming' do
      user = create(:user)
      account = create(:account, with_editor: user)
      theming = create(:theming, account: account)
      other_theming = create(:theming, account: account)
      entry = create(:entry, theming: theming, account: account, with_manager: user)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {theming_id: other_theming}}

      expect(entry.reload.theming).to eq(theming)
    end

    it 'allows account publisher to change theming' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      theming = create(:theming, account: account)
      other_theming = create(:theming, account: account)
      entry = create(:entry, theming: theming, account: account)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {theming_id: other_theming}}

      expect(entry.reload.theming).to eq(other_theming)
    end

    it 'does not allow account publisher to switch to theming of other account they manage' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      other_account = create(:account, with_manager: user)
      theming = create(:theming, account: account)
      other_theming = create(:theming, account: other_account)
      entry = create(:entry, theming: theming, account: account)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {theming_id: other_theming}}

      expect(entry.reload.theming).to eq(theming)
    end

    it 'allows admin to change theming' do
      theming = create(:theming)
      other_theming = create(:theming)
      entry = create(:entry, theming: theming)

      sign_in(create(:user, :admin), scope: :user)
      patch :update, params: {id: entry, entry: {theming_id: other_theming}}

      expect(entry.reload.theming).to eq(other_theming)
    end

    it 'does not allow entry manager and account editor to change folder' do
      user = create(:user)
      account = create(:account, with_editor: user)
      folder = create(:folder, account: account)
      entry = create(:entry, account: account, with_manager: user)

      sign_in(user, scope: :user)
      patch :update, params: {id: entry, entry: {folder_id: folder}}

      expect(entry.reload.folder).to eq(nil)
    end

    it 'allows account publisher to change folder of entry of account they publish on' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      folder = create(:folder, account: account)
      entry = create(:entry, account: account)

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
      entry = create(:entry, account: account)

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
        entry = create(:entry, account: account)

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
      entry = create(:entry, account: account, with_manager: user)

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
      entry = create(:entry, account: account)

      sign_in(create(:user))

      expect do
        post(:snapshot, params: {id: entry.id})
      end.not_to change { entry.revisions.count }
    end

    it 'allows account editor to snapshot entries of own account' do
      user = create(:user)
      account = create(:account, with_editor: user)
      entry = create(:entry, account: account)

      sign_in(user, scope: :user)
      post(:snapshot, params: {id: entry.id})

      expect do
        post(:snapshot, params: {id: entry.id})
      end.to change { entry.revisions.count }
    end

    it 'allows admin to snapshot entries of other accounts' do
      entry = create(:entry)

      sign_in(create(:user, :admin), scope: :user)
      post(:snapshot, params: {id: entry.id})

      expect do
        post(:snapshot, params: {id: entry.id})
      end.to change { entry.revisions.count }
    end

    it 'allows editor to snapshot their entries' do
      user = create(:user)
      entry = create(:entry, with_editor: user)

      sign_in(user, scope: :user)
      post(:snapshot, params: {id: entry.id})

      expect do
        post(:snapshot, params: {id: entry.id})
      end.to change { entry.revisions.count }
    end
  end

  describe '#duplicate' do
    it 'does not allow account editor to duplicate own entries of own account' do
      user = create(:user)
      account = create(:account, with_editor: user)
      entry = create(:entry, account: account, with_editor: user)

      sign_in(user, scope: :user)

      expect do
        post(:duplicate, params: {id: entry.id})
      end.not_to change { Pageflow::Entry.count }
    end

    it 'allows entry publisher to duplicate entry' do
      user = create(:user)
      entry = create(:entry, with_publisher: user)

      sign_in(user, scope: :user)

      expect do
        post(:duplicate, params: {id: entry.id})
      end.to change { Pageflow::Entry.count }
    end

    it 'allows admin to duplicate entries of other accounts' do
      create(:account)
      entry = create(:entry)

      sign_in(create(:user, :admin), scope: :user)

      expect do
        post(:duplicate, params: {id: entry.id})
      end.to change { Pageflow::Entry.count }
    end
  end

  describe '#destroy' do
    it 'allows account manager to destroy entry' do
      user = create(:user)
      account = create(:account, with_manager: user)
      entry = create(:entry, account: account)

      sign_in(user, scope: :user)

      expect { delete(:destroy, params: {id: entry}) }.to change { Pageflow::Entry.count }
    end

    it 'does not allow account publisher and entry manager to destroy entry' do
      user = create(:user)
      account = create(:account, with_publisher: user)
      entry = create(:entry, with_manager: user, account: account)

      sign_in(user, scope: :user)

      expect { delete(:destroy, params: {id: entry}) }.not_to change { Pageflow::Entry.count }
    end

    it 'allows admin to destroy entry' do
      user = create(:user, :admin)
      entry = create(:entry)

      sign_in(user, scope: :user)

      expect { delete(:destroy, params: {id: entry}) }.to change { Pageflow::Entry.count }
    end
  end

  describe 'get #entry_types' do
    render_views

    it 'allows to display entry types for account publisher' do
      account = create(:account)

      sign_in(create(:user, :manager, on: account))
      get(:entry_types, params: {account_id: account}, format: 'json')

      expect(response.status).to eq(200)
    end

    it 'does not render layout' do
      account = create(:account)

      sign_in(create(:user, :publisher, on: account))
      get(:entry_types, params: {account_id: account}, format: 'json')

      expect(response.body).not_to have_selector('body.active_admin')
    end

    it 'is forbidden for account editor' do
      account = create(:account)

      sign_in(create(:user, :editor, on: account))
      get(:entry_types, params: {account_id: account}, format: 'json')

      expect(response.status).to eq(403)
    end
  end
end
