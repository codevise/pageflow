# Create entry templates, which hold template data for new
# entries. Data can be entry type-specific
class CreatePageflowEntryTemplates < ActiveRecord::Migration[5.2]
  def up
    create_table :pageflow_entry_templates do |t|
      t.references :account
      t.string :entry_type
      t.string :theme_name, default: 'default'
      t.string :default_author
      t.string :default_publisher
      t.string :default_keywords
      t.string :default_locale, default: 'de'
      t.text :default_share_providers
      t.text :configuration
    end

    execute('INSERT INTO pageflow_entry_templates '\
              '(account_id, entry_type, theme_name, default_author, default_publisher, '\
              'default_keywords, default_locale, default_share_providers, configuration) '\
            "SELECT account_id, 'paged', theme_name, default_author, default_publisher, "\
              'default_keywords, default_locale, default_share_providers, '\
              "CONCAT('{\"home_button_enabled\":', "\
              "home_button_enabled_by_default, '}') "\
            'FROM pageflow_themings;')

    execute('UPDATE pageflow_widgets w, pageflow_entry_templates et, pageflow_themings t '\
            "SET w.subject_type='Pageflow::EntryTemplate', w.subject_id = et.id "\
            "WHERE et.account_id = t.account_id and et.entry_type = 'paged' "\
              "and w.subject_id = t.id and w.subject_type = 'Pageflow::Theming';")

    remove_column :pageflow_themings, :theme_name
    remove_column :pageflow_themings, :default_author
    remove_column :pageflow_themings, :default_publisher
    remove_column :pageflow_themings, :default_keywords
    remove_column :pageflow_themings, :default_locale
    remove_column :pageflow_themings, :default_share_providers
    remove_column :pageflow_themings, :home_button_enabled_by_default
  end

  def down
    add_column :pageflow_themings, :theme_name, :string
    add_column :pageflow_themings, :default_author, :string
    add_column :pageflow_themings, :default_publisher, :string
    add_column :pageflow_themings, :default_keywords, :string
    add_column :pageflow_themings, :default_locale, :string, default: 'de'
    add_column :pageflow_themings, :default_share_providers, :text
    add_column :pageflow_themings, :home_button_enabled_by_default, :boolean, default: true

    execute('UPDATE pageflow_themings t, pageflow_entry_templates et '\
            'SET t.theme_name = et.theme_name, t.default_author = et.default_author, '\
              't.default_publisher = et.default_publisher, '\
              't.default_keywords = et.default_keywords, '\
              't.default_locale = et.default_locale, '\
              't.default_share_providers = et.default_share_providers, '\
              't.home_button_enabled_by_default = et.configuration '\
                "REGEXP 'home_button_enabled\":1' "\
                "WHERE et.entry_type='paged' and t.account_id = et.account_id;")

    execute('UPDATE pageflow_themings SET home_button_enabled_by_default = 0 '\
            'WHERE home_button_enabled_by_default IS NULL;')

    change_column :pageflow_themings,
                  :home_button_enabled_by_default,
                  :boolean,
                  null: false,
                  default: true

    execute('UPDATE pageflow_widgets w, pageflow_entry_templates et, pageflow_themings t '\
            "SET w.subject_type='Pageflow::Theming', w.subject_id = t.id "\
            "WHERE et.account_id = t.account_id and et.entry_type = 'paged' "\
              "and w.subject_id = et.id and w.subject_type = 'Pageflow::EntryTemplate';")

    drop_table :pageflow_entry_templates
  end
end
