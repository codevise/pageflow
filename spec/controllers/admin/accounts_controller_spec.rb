require 'spec_helper'

module Admin
  describe AccountsController do
    describe '#create' do
      it 'creates nested default_theming' do
        pageflow_configure do |config|
          config.themes.register(:custom)
        end

        sign_in(create(:user, :admin))
        post(:create, :account => {
               :default_theming_attributes => {
                 :theme_name => 'custom',
                 :imprint_link_url => 'http://example.com/new'
               }
             })

        expect(Pageflow::Account.last.default_theming.theme_name).to eq('custom')
      end

      it 'batch updates widgets of default theming' do
        pageflow_configure do |config|
          config.themes.register(:custom)
        end

        sign_in(create(:user, :admin))
        post(:create,
             account: {
               default_theming_attributes: {
                 theme_name: 'custom'
               }
             },
             widgets: {
               navigation: 'some_widget'
             })

        expect(Pageflow::Account.last.default_theming.widgets).to include_record_with(role: 'navigation', type_name: 'some_widget')
      end

      it 'does not create widgets if account cannot be saved' do
        pageflow_configure do |config|
          config.themes.register(:custom)
        end

        sign_in(create(:user, :admin))

        expect {
          post(:create,
               account: {},
               widgets: {
                 navigation: 'some_widget'
               })
        }.not_to change { Pageflow::Widget.count }
      end
    end

    describe '#edit' do
      render_views

      it 'displays additional registered account form inputs' do
        account = create(:account)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:account, :custom_field)
        end

        sign_in(create(:user, :admin))
        get :edit, id: account

        expect(response.body).to have_selector('[name="account[custom_field]"]')
      end

      it 'displays additional registered theming form inputs' do
        account = create(:account)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:theming, :custom_field)
        end

        sign_in(create(:user, :admin))
        get :edit, id: account

        expect(response.body).to have_selector('[name="account[default_theming_attributes][custom_field]"]')
      end
    end

    describe '#update' do
      it 'updates nested default_theming' do
        pageflow_configure do |config|
          config.themes.register(:custom)
        end
        theming = create(:theming)
        account = create(:account, :default_theming => theming)

        sign_in(create(:user, :admin))
        put(:update, :id => account.id, :account => {
              :default_theming_attributes => {
                :theme_name => 'custom',
                :imprint_link_url => 'http://example.com/new'
              }
            })

        expect(theming.reload.theme_name).to eq('custom')
        expect(theming.imprint_link_url).to eq('http://example.com/new')
      end

      it 'batch updates widgets of default theming' do
        theming = create(:theming)
        account = create(:account, default_theming: theming)

        sign_in(create(:user, :admin))
        patch(:update,
              id: account.id,
              widgets: {
                navigation: 'some_widget'
              })

        expect(theming.widgets).to include_record_with(role: 'navigation', type_name: 'some_widget')
      end

      it 'does not update widgets if theming validation fails' do
        theming = create(:theming)
        account = create(:account, default_theming: theming)

        sign_in(create(:user, :admin))
        expect {
          patch(:update,
                id: account.id,
                account: {
                  default_theming_attributes: {
                    theme_name: 'invalid'
                  }
                },
                widgets: {
                  navigation: 'some_widget'
                })
        }.not_to change { Pageflow::Widget.count }
      end

      it 'updates feature_configuration through feature_states param' do
        account = create(:account)

        sign_in(create(:user, :admin))
        patch(:update,
              id: account.id,
              account: {
                feature_states: {
                  fancy_page_type: 'enabled'
                }
              })

        expect(account.reload.feature_state('fancy_page_type')).to eq(true)
      end

      it 'updates custom account field registered as form input' do
        account = create(:account)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:account, :custom_field)
        end

        sign_in(create(:user, :admin))
        patch(:update, id: account, account: {custom_field: 'some value'})

        expect(account.reload.custom_field).to eq('some value')
      end

      it 'does not update account custom field not registered as form input' do
        account = create(:account)

        sign_in(create(:user, :admin))
        patch(:update, id: account, account: {custom_field: 'some value'})

        expect(account.reload.custom_field).to eq(nil)
      end

      it 'updates custom field of nested theming registered as form input' do
        account = create(:account)

        pageflow_configure do |config|
          config.admin_form_inputs.register(:theming, :custom_field)
        end

        sign_in(create(:user, :admin))
        patch(:update,
              id: account,
              account: {
                default_theming_attributes: {
                  custom_field: 'some value'
                }
              })

        expect(account.default_theming.reload.custom_field).to eq('some value')
      end

      it 'does not update custom field of nested theming not registered as form input' do
        account = create(:account)

        sign_in(create(:user, :admin))
        patch(:update,
              id: account,
              account: {
                default_theming_attributes: {
                  custom_field: 'some value'
                }
              })

        expect(account.default_theming.custom_field).to eq(nil)
      end

      it 'redirects back to tab' do
        account = create(:account)

        sign_in(create(:user, :admin))
        patch(:update,
              id: account.id,
              account: {},
              tab: 'features')

        expect(response).to redirect_to(admin_account_path(tab: 'features'))
      end
    end

    describe '#destroy' do
      it 'allows to destroy empty account' do
        account = create(:account)

        sign_in(create(:user, :admin))

        expect {
          delete :destroy, :id => account
        }.to change { Pageflow::Account.count }
      end

      it 'does not allow to destroy account with user' do
        account = create(:account)
        create(:user, :account => account)

        sign_in(create(:user, :admin))

        expect {
          delete :destroy, :id => account
        }.not_to change { Pageflow::Account.count }
      end

      it 'does not allow to destroy account with entry' do
        account = create(:account)
        create(:entry, :account => account)

        sign_in(create(:user, :admin))

        expect {
          delete :destroy, :id => account
        }.not_to change { Pageflow::Account.count }
      end
    end
  end
end
