require 'spec_helper'

module Admin
  describe AccountsController do
    describe '#index' do
      describe 'downloads' do
        render_views

        %w(csv json xml).each do |format|
          describe "with #{format} format" do
            it 'does not include sensitive data' do
              user = create(:user, :admin)
              create(:account, features_configuration: {some_feature: true})

              sign_in(user, scope: :user)
              get(:index, format: format)

              expect(response.body).not_to include('some_feature')
            end
          end
        end
      end
    end

    describe '#show' do
      render_views

      describe 'built in admin tabs' do
        it 'account manager sees features tab' do
          user = create(:user)
          account = create(:account, with_manager: user)

          sign_in(user, scope: :user)
          get(:show, params: {id: account.id})

          expect(response.body).to have_selector('.admin_tabs_view-tabs .features')
        end

        context 'with config.permissions.only_admins_may_update_features' do
          it 'account manager does not see features tab' do
            pageflow_configure do |config|
              config.permissions.only_admins_may_update_features = true
            end

            user = create(:user)
            account = create(:account, with_manager: user)

            sign_in(user, scope: :user)
            get(:show, params: {id: account.id})

            expect(response.body).not_to have_selector('.admin_tabs_view-tabs .features')
          end

          it 'admin sees features tab' do
            pageflow_configure do |config|
              config.permissions.only_admins_may_update_features = true
            end

            user = create(:user, admin: true)
            entry = create(:account)

            sign_in(user, scope: :user)
            get(:show, params: {id: entry.id})

            expect(response.body).to have_selector('.admin_tabs_view-tabs .features')
          end
        end

        it 'account publisher does not see features tab' do
          user = create(:user)
          account = create(:account, with_publisher: user)

          sign_in(user, scope: :user)
          get(:show, params: {id: account.id})

          expect(response.body).not_to have_selector('.admin_tabs_view-tabs .features')
        end
      end

      describe 'additional admin resource tab' do
        let(:tab_view_component) do
          Class.new(Pageflow::ViewComponent) do
            def build(account)
              super('data-custom-tab' => account.name)
            end

            def self.name
              'TabViewComponet'
            end
          end
        end

        let(:tab_view_selector) { '.admin_tabs_view div[data-custom-tab]' }

        it 'is visible for managers' do
          user = create(:user)
          account = create(:account, with_manager: user)

          Pageflow.config.admin_resource_tabs.register(:theming,
                                                       name: :some_tab,
                                                       component: tab_view_component,
                                                       required_account_role: :manager)
          sign_in(user, scope: :user)
          get(:show, params: {id: account.id})

          expect(response.body).to have_selector(tab_view_selector)
        end

        context 'with admin_only option' do
          it 'is visible for admin' do
            user = create(:user, :admin)
            account = create(:account)

            Pageflow.config.admin_resource_tabs.register(:theming,
                                                         name: :some_tab,
                                                         component: tab_view_component,
                                                         admin_only: true)
            sign_in(user, scope: :user)
            get(:show, params: {id: account.id})

            expect(response.body).to have_selector(tab_view_selector)
          end

          it 'is not visible for non admins' do
            user = create(:user)
            account = create(:account, with_manager: user)

            Pageflow.config.admin_resource_tabs.register(:theming,
                                                         name: :some_tab,
                                                         component: tab_view_component,
                                                         admin_only: true)
            sign_in(user, scope: :user)
            get(:show, params: {id: account.id})

            expect(response.body).not_to have_selector(tab_view_selector)
          end
        end
      end

      describe 'additional attributes table rows' do
        it 'renders additional rows registered for account' do
          user = create(:user)
          account = create(:account, with_manager: user)

          pageflow_configure do |config|
            config.admin_attributes_table_rows.register(:account, :custom) { 'custom attribute' }
          end

          sign_in(user, scope: :user)
          get(:show, params: {id: account.id})

          expect(response.body).to have_text('custom attribute')
        end

        it 'renders additional rows registered for account in enabled feature' do
          user = create(:user)
          account = create(:account,
                           with_manager: user,
                           with_feature: :custom_account_attribute)

          pageflow_configure do |config|
            config.features.register('custom_account_attribute') do |feature_config|
              feature_config.admin_attributes_table_rows.register(:account, :custom) do
                'custom attribute'
              end
            end
          end

          sign_in(user, scope: :user)
          get(:show, params: {id: account.id})

          expect(response.body).to have_text('custom attribute')
        end

        it 'does not render additional rows registered for account in disabled feature' do
          user = create(:user)
          account = create(:account,
                           with_manager: user)

          pageflow_configure do |config|
            config.features.register('custom_account_attribute') do |feature_config|
              feature_config.admin_attributes_table_rows.register(:account, :custom) do
                'custom attribute'
              end
            end
          end

          sign_in(user, scope: :user)
          get(:show, params: {id: account.id})

          expect(response.body).not_to have_text('custom attribute')
        end

        it 'renders additional rows registered for theming' do
          user = create(:user)
          account = create(:account, with_manager: user)

          pageflow_configure do |config|
            config.admin_attributes_table_rows.register(:theming, :custom) { 'custom attribute' }
          end

          sign_in(user, scope: :user)
          get(:show, params: {id: account.id})

          expect(response.body).to have_text('custom attribute')
        end

        it 'renders additional rows registered for theming in enabled feature' do
          user = create(:user)
          account = create(:account,
                           with_manager: user,
                           with_feature: :custom_theming_attribute)

          pageflow_configure do |config|
            config.features.register('custom_theming_attribute') do |feature_config|
              feature_config.admin_attributes_table_rows.register(:theming, :custom) do
                'custom attribute'
              end
            end
          end

          sign_in(user, scope: :user)
          get(:show, params: {id: account.id})

          expect(response.body).to have_text('custom attribute')
        end

        it 'does not render additional rows registered for account in disabled feature' do
          user = create(:user)
          account = create(:account,
                           with_manager: user)

          pageflow_configure do |config|
            config.features.register('custom_theming_attribute') do |feature_config|
              feature_config.admin_attributes_table_rows.register(:theming, :custom) do
                'custom attribute'
              end
            end
          end

          sign_in(user, scope: :user)
          get(:show, params: {id: account.id})

          expect(response.body).not_to have_text('custom attribute')
        end
      end
    end

    describe '#create' do
      render_views

      it 'creates nested default_theming' do
        sign_in(create(:user, :admin), scope: :user)
        post(:create,
             params: {
               account: {
                 default_theming_attributes: {
                   imprint_link_url: 'http://example.com/new'
                 }
               }
             })

        expect(Pageflow::Theming.last.imprint_link_url)
          .to eq('http://example.com/new')
      end

      it 'creates no paged entry template' do
        pageflow_configure do |config|
          config.themes.register(:red)
        end

        sign_in(create(:user, :admin), scope: :user)
        post(:create,
             params: {
               account: {
                 paged_entry_template_attributes: {
                   theme_name: 'red'
                 }
               }
             })
        entry_templates_count = Pageflow::EntryTemplate.all.count

        expect(entry_templates_count).to eq(0)
      end
    end

    describe '#edit' do
      render_views

      it 'displays additional registered account form inputs' do
        account = create(:account)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:account, :custom_field)
        end

        sign_in(create(:user, :admin), scope: :user)
        get :edit, params: {id: account}

        expect(response.body).to have_selector('[name="account[custom_field]"]')
      end

      it 'displays additional registered theming form inputs' do
        account = create(:account)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:theming, :custom_field)
        end

        sign_in(create(:user, :admin), scope: :user)
        get :edit, params: {id: account}

        expect(response.body)
          .to have_selector('[name="account[default_theming_attributes][custom_field]"]')
      end
    end

    describe '#update' do
      render_views

      it 'updates nested default_theming' do
        pageflow_configure do |config|
          config.themes.register(:custom)
        end
        theming = create(:theming)
        account = create(:account, default_theming: theming)

        sign_in(create(:user, :admin), scope: :user)
        put(:update, params: {id: account.id, account: {
              default_theming_attributes: {
                imprint_link_url: 'http://example.com/new'
              },
              paged_entry_template_attributes: {
                theme_name: 'custom'
              }
            }})

        expect(theming.reload.imprint_link_url).to eq('http://example.com/new')
      end

      it 'allows admin to update feature_configuration through feature_states param' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                id: account.id,
                account: {
                  feature_states: {
                    fancy_page_type: 'enabled'
                  }
                }
              })

        expect(account.reload.feature_state('fancy_page_type')).to eq(true)
      end

      it 'allows account manager to update feature_configuration through feature_states param' do
        user = create(:user)
        account = create(:account, with_manager: user)

        sign_in(user, scope: :user)
        patch(:update,
              params: {
                id: account.id,
                account: {
                  feature_states: {
                    fancy_page_type: 'enabled'
                  }
                }
              })

        expect(account.reload.feature_state('fancy_page_type')).to eq(true)
      end

      it 'does not allows account publisher to update feature_configuration' do
        user = create(:user)
        account = create(:account, with_publisher: user)

        sign_in(user, scope: :user)
        patch(:update,
              params: {
                id: account.id,
                account: {
                  feature_states: {
                    fancy_page_type: 'enabled'
                  }
                }
              })

        expect(account.reload.feature_state('fancy_page_type')).not_to eq(true)
      end

      context 'with config.permissions.only_admins_may_update_features' do
        it 'allows admin to update feature_configuration through feature_states param' do
          pageflow_configure do |config|
            config.permissions.only_admins_may_update_features = true
          end

          account = create(:account)

          sign_in(create(:user, :admin), scope: :user)
          patch(:update,
                params: {
                  id: account.id,
                  account: {
                    feature_states: {
                      fancy_page_type: 'enabled'
                    }
                  }
                })

          expect(account.reload.feature_state('fancy_page_type')).to eq(true)
        end

        it 'does not allow account manager to update feature_configuration' do
          pageflow_configure do |config|
            config.permissions.only_admins_may_update_features = true
          end

          user = create(:user)
          account = create(:account, with_manager: user)

          sign_in(user, scope: :user)
          patch(:update,
                params: {
                  id: account.id,
                  account: {
                    feature_states: {
                      fancy_page_type: 'enabled'
                    }
                  }
                })

          expect(account.reload.feature_state('fancy_page_type')).not_to eq(true)
        end
      end

      it 'updates custom account field registered as form input' do
        account = create(:account)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:account, :custom_field)
        end

        sign_in(create(:user, :admin), scope: :user)
        patch(:update, params: {id: account, account: {custom_field: 'some value'}})

        expect(account.reload.custom_field).to eq('some value')
      end

      it 'does not update account custom field not registered as form input' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update, params: {id: account, account: {custom_field: 'some value'}})

        expect(account.reload.custom_field).to eq(nil)
      end

      it 'updates custom field of nested theming registered as form input' do
        account = create(:account)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:theming, :custom_field)
        end

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                id: account,
                account: {
                  default_theming_attributes: {
                    custom_field: 'some value'
                  }
                }
              })

        expect(account.default_theming.reload.custom_field).to eq('some value')
      end

      it 'does not update custom field of nested theming not registered as form input' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                id: account,
                account: {
                  default_theming_attributes: {
                    custom_field: 'some value'
                  }
                }
              })

        expect(account.default_theming.custom_field).to eq(nil)
      end

      it 'redirects back to tab' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                id: account.id,
                account: {},
                tab: 'features'
              })

        expect(response).to redirect_to(admin_account_path(tab: 'features'))
      end
    end

    describe '#destroy' do
      it 'allows to destroy empty account' do
        account = create(:account)

        sign_in(create(:user, :admin), scope: :user)

        expect { delete :destroy, params: {id: account} }.to change { Pageflow::Account.count }
      end

      it 'does not allow to destroy account with user' do
        account = create(:account)
        create(:user, :member, on: account)

        sign_in(create(:user, :admin), scope: :user)

        expect { delete :destroy, params: {id: account} }.not_to change { Pageflow::Account.count }
      end

      it 'does not allow to destroy account with entry' do
        account = create(:account)
        create(:entry, account: account)

        sign_in(create(:user, :admin), scope: :user)

        expect { delete :destroy, params: {id: account} }.not_to change { Pageflow::Account.count }
      end
    end
  end
end
