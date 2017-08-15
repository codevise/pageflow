Pageflow.configure do |config|
  config.admin_resource_tabs.register(:entry, name: :members, component: Pageflow::Admin::MembersTab)
  config.admin_resource_tabs.register(:entry, name: :revisions, component: Pageflow::Admin::RevisionsTab)


  config.admin_resource_tabs.register(:user, name: :accounts, component: Pageflow::Admin::UserAccountsTab)
  config.admin_resource_tabs.register(:user, name: :entries, component: Pageflow::Admin::UserEntriesTab)

  config.admin_resource_tabs.register(:theming, name: :entries, component: Pageflow::Admin::EntriesTab)
  config.admin_resource_tabs.register(:theming, name: :users, component: Pageflow::Admin::UsersTab)
  config.admin_resource_tabs.register(:theming, name: :features, component: Pageflow::Admin::FeaturesTab)
end

Pageflow.after_configure do |config|
  if config.permissions.show_entry_features_to_non_admin
    config.admin_resource_tabs.register(:entry,
                                        name: :features,
                                        component: Pageflow::Admin::FeaturesTab,
                                        required_account_role: :manager)
  else
    config.admin_resource_tabs.register(:entry,
                                        name: :features,
                                        component: Pageflow::Admin::FeaturesTab,
                                        admin_only: true)
  end
end
