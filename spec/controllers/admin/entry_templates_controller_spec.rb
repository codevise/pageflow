require 'spec_helper'

module Admin
  describe EntryTemplatesController do
    render_views

    describe '#new' do
      it 'displays only themes that are registered for the entry type' do
        pageflow_configure do |config|
          ironed = Pageflow::TestEntryType.register(config, name: 'ironed')
          steeled = Pageflow::TestEntryType.register(config, name: 'steeled')
          config.for_entry_type(ironed) do |entry_type_config|
            entry_type_config.themes.register(:iron_ore)
          end
          config.for_entry_type(steeled) do |entry_type_config|
            entry_type_config.themes.register(:iron_ore)
            entry_type_config.themes.register(:carbon)
          end
        end
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        get(:new,
            params: {
              account_id: admin.accounts.first.id,
              entry_type_name: 'ironed'
            })

        expect(response.body).to have_text('iron_ore')
        expect(response.body).not_to have_text('carbon')
      end

      it 'displays only widget types that are registered for the entry type' do
        pageflow_configure do |config|
          ironed = Pageflow::TestEntryType.register(config, name: 'ironed')
          steeled = Pageflow::TestEntryType.register(config, name: 'steeled')
          iron_ore = Pageflow::TestWidgetType.new(name: 'iron_ore', roles: ['stuff'])
          carbon = Pageflow::TestWidgetType.new(name: 'carbon', roles: ['stuff'])
          config.for_entry_type(ironed) do |entry_type_config|
            entry_type_config.widget_types.register(iron_ore)
          end
          config.for_entry_type(steeled) do |entry_type_config|
            entry_type_config.widget_types.register(iron_ore)
            entry_type_config.widget_types.register(carbon)
          end
        end
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        get(:new,
            params: {
              account_id: admin.accounts.first.id,
              entry_type_name: 'ironed'
            })

        expect(response.body).to have_text('iron_ore')
        expect(response.body).not_to have_text('carbon')
      end

      it 'displays only themes/widget_types whose features are enabled for account' do
        pageflow_configure do |config|
          ore_mine = Pageflow::TestWidgetType.new(name: 'ore_mine', roles: ['stuff'])
          hay_stack = Pageflow::TestWidgetType.new(name: 'hay_stack', roles: ['stuff'])
          config.features.register 'iron_combo' do |feature_config|
            feature_config.themes.register(:iron_ore)
            feature_config.widget_types.register(ore_mine)
          end
          config.features.register 'carbon_combo' do |feature_config|
            feature_config.themes.register(:carbon)
            feature_config.widget_types.register(hay_stack)
          end
        end
        account = create(
          :account,
          with_feature: 'iron_combo',
          without_feature: 'carbon_combo'
        )
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        get(:new,
            params: {
              account_id: account.id,
              entry_type_name: 'paged'
            })

        expect(response.body).to have_text('iron_ore')
        expect(response.body).to have_text('ore_mine')
        expect(response.body).not_to have_text('carbon')
        expect(response.body).not_to have_text('hay_stack')
      end
    end

    describe '#create' do
      it 'still displays form after submit attempt if data is invalid' do
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        post(:create,
             params: {
               account_id: admin.accounts.first.id,
               entry_template: {
                 entry_type_name: 'paged',
                 theme_name: 'unregistered'
               }
             })

        expect(response.body).to have_selector(
          '.input.error#entry_template_theme_name_input'
        )
      end

      it 'creates entry template if theme is valid' do
        pageflow_configure do |config|
          config.themes.register(:custom)
        end

        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        post(:create,
             params: {
               account_id: admin.accounts.first.id,
               entry_template: {
                 entry_type_name: 'paged',
                 theme_name: 'custom'
               }
             })

        expect(Pageflow::EntryTemplate.last.theme_name).to eq('custom')
      end

      it 'batch updates widgets of first paged entry template' do
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        post(:create,
             params: {
               account_id: admin.accounts.first.id,
               entry_template: {
                 entry_type_name: 'paged'
               },
               widgets: {
                 navigation: 'some_widget'
               }
             })

        expect(Pageflow::EntryTemplate.last.widgets)
          .to include_record_with(role: 'navigation', type_name: 'some_widget')
      end

      it 'does not create widgets if entry template is invalid' do
        existing_entry_template = create(:entry_template, entry_type_name: 'scrolled')
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        expect {
          post(:create,
               params: {
                 account_id: existing_entry_template.account.id,
                 entry_template: {
                   entry_type_name: 'scrolled'
                 },
                 widgets: {
                   navigation: 'some_widget'
                 }
               })
        }.not_to(change { Pageflow::Widget.count })
      end

      it 'sets share providers' do
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        post(:create,
             params: {
               account_id: admin.accounts.first.id,
               entry_template: {
                 entry_type_name: 'paged',
                 share_providers: {
                   insta: 'true',
                   tiktok: 'false'
                 }
               }
             })

        expect(Pageflow::EntryTemplate.last.share_providers)
          .to eq(
            'insta' => true,
            'tiktok' => false
          )
      end

      it 'converts 0 and 1 string values in config to numbers' do
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        post(:create,
             params: {
               account_id: admin.accounts.first.id,
               entry_template: {
                 entry_type_name: 'paged',
                 configuration: {
                   number: '1'
                 }
               }
             })

        expect(Pageflow::EntryTemplate.last.configuration['number'])
          .to eq(1)
      end

      it "doesn't create an entry template with insufficient privileges" do
        account = create(:account)
        other_account = create(:account)
        editor = create(:user, :editor, on: account)
        create(:membership, entity: other_account, user: editor, role: :manager)
        sign_in(editor, scope: :user)

        expect {
          post(:create,
               params: {
                 account_id: editor.accounts.first.id,
                 entry_template: {
                   entry_type_name: 'paged'
                 }
               })
        }.not_to(change { Pageflow::EntryTemplate.count })
      end
    end

    describe '#edit' do
      it 'still displays form after submit attempt if data is invalid' do
        entry_template = create(:entry_template)
        sign_in(create(:user, :admin), scope: :user)

        patch(:update,
              params: {
                account_id: entry_template.account.id,
                id: entry_template.id,
                entry_template: {
                  theme_name: 'unregistered'
                }
              })

        expect(response.body).to have_selector(
          '.input.error#entry_template_theme_name_input'
        )
      end

      it 'updates theme name' do
        pageflow_configure do |config|
          config.themes.register(:green)
        end
        entry_template = create(:entry_template)

        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        patch(
          :update,
          params: {
            id: entry_template.id,
            account_id: entry_template.account.id,
            entry_template: {
              entry_type_name: 'paged',
              theme_name: 'green'
            }
          }
        )

        expect(entry_template.reload.theme_name).to eq('green')
      end

      it 'does not update widgets if entry template validation fails' do
        entry_template = create(:entry_template, entry_type_name: 'paged')
        create(:entry_template, entry_type_name: 'scrolled', account: entry_template.account)

        admin = create(:user, :admin)
        sign_in(admin, scope: :user)

        expect {
          patch(:update,
                params: {
                  id: entry_template.id,
                  account_id: entry_template.account.id,
                  entry_template: {
                    entry_type_name: 'scrolled'
                  },
                  widgets: {
                    navigation: 'some_widget'
                  }
                })
        }.not_to(change { Pageflow::Widget.count })
      end

      it 'batch updates widgets of first paged entry template' do
        entry_template = create(:entry_template)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                id: entry_template.id,
                account_id: entry_template.account.id,
                entry_template: {
                  entry_type_name: 'paged'
                },
                widgets: {
                  navigation: 'some_widget'
                }
              })

        expect(entry_template.reload.widgets).to include_record_with(
          role: 'navigation',
          type_name: 'some_widget'
        )
      end

      it 'updates share providers' do
        entry_template = create(:entry_template)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                id: entry_template.id,
                account_id: entry_template.account.id,
                entry_template: {
                  entry_type_name: 'paged',
                  share_providers: {
                    insta: 'true',
                    tiktok: 'false'
                  }
                }
              })

        expect(entry_template.reload.share_providers)
          .to eq(
            'insta' => true,
            'tiktok' => false
          )
      end

      it 'converts 0 and 1 string values in config to numbers' do
        entry_template = create(:entry_template)

        sign_in(create(:user, :admin), scope: :user)
        patch(:update,
              params: {
                id: entry_template.id,
                account_id: entry_template.account.id,
                entry_template: {
                  entry_type_name: 'paged',
                  configuration: {
                    project: '0'
                  }
                }
              })

        expect(entry_template.reload.configuration['project'])
          .to eq(0)
      end

      it "doesn't update an entry template with insufficient privileges" do
        account = create(:account)
        other_account = create(:account)
        editor = create(:user, :editor, on: account)
        create(:membership, entity: other_account, user: editor, role: :manager)
        entry_template = create(
          :entry_template,
          account: account,
          share_providers: {
            signal: true
          }
        )
        sign_in(editor, scope: :user)

        patch(:update,
              params: {
                id: entry_template.id,
                account_id: entry_template.account.id,
                entry_template: {
                  entry_type_name: 'paged',
                  share_providers: {
                    insta: 'true',
                    tiktok: 'false'
                  }
                }
              })

        expect(entry_template.reload.share_providers)
          .to eq('signal' => true)
      end
    end

    describe '#index' do
      it 'redirects to account page' do
        admin = create(:user, :admin)
        sign_in(admin, scope: :user)
        account_id = admin.accounts.first.id

        get(:index,
            params: {
              account_id: account_id
            })

        expect(response).to redirect_to admin_account_path(
          id: account_id, tab: 'entry_templates'
        )
      end
    end
  end
end
