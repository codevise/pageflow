Pageflow.configure do |config|
  config.admin_resource_tabs.register(:entry, name: :members, component: Pageflow::Admin::MembersTab)
  config.admin_resource_tabs.register(:entry, name: :revisions, component: Pageflow::Admin::RevisionsTab)

  config.admin_resource_tabs.register(:user, name: :accounts, component: Pageflow::Admin::UserAccountsTab)
  config.admin_resource_tabs.register(:user, name: :entries, component: Pageflow::Admin::UserEntriesTab)

  config.admin_resource_tabs.register(:theming, name: :entries, component: Pageflow::Admin::EntriesTab)
  config.admin_resource_tabs.register(:theming, name: :users, component: Pageflow::Admin::UsersTab)
  config.admin_resource_tabs.register(
    :theming,
    name: :entry_templates,
    component: Pageflow::Admin::EntryTemplatesTab
  )
end

Pageflow.after_configure do |config|
  features_tab_permissions =
    if config.permissions.only_admins_may_update_features
      {admin_only: true}
    else
      {required_account_role: :manager}
    end

  config.admin_resource_tabs.register(:entry,
                                      name: :features,
                                      component: Pageflow::Admin::FeaturesTab,
                                      **features_tab_permissions)

  config.admin_resource_tabs.register(:theming,
                                      name: :features,
                                      component: Pageflow::Admin::FeaturesTab,
                                      **features_tab_permissions)
end
