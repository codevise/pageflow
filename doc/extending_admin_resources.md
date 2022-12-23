# Extending Admin Resources

Pageflow plugins can add additional elements to the admin pages of
entries and accounts. This can be used to allow displaying and editing
custom entry or account attributes.

As an example, we create an imaginary plugin that stores ISSN
information with entries and accounts.

First, we create a migration to add the new fields:

```ruby
# rainbow/db/migrate/xxx_add_attributes_to_entries_and_accounts.rb
class AddAttributesToEntriesAndAccounts < ActiveRecord::Migration
  def change
    add_column(:pageflow_accounts, :issn, :string)
    add_column(:pageflow_entries, :issn, :string)
  end
end
```

## Adding Fields to Edit Forms

To let the user edit the new fields, we add fields to the entry and
account forms:

```ruby
# rainbow/lib/rainbow/plugin.rb
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.admin_form_inputs.register(:entry, :issn, as: :string)
      config.admin_form_inputs.register(:account, :issn, as: :string)
    end
  end
end
```

All options supported by Formtastic can be used in the third
parameter. To use localized strings, the options need to be generated
in the request cycle. We can pass a proc instead:

```ruby
def configure(config)
  config.admin_form_inputs.register(:entry, :issn, -> {
    { as: :string, hint: I18n.t('some.key') }
  })
end
```

Follow ActiveRecord's conventions to define translations for human
attribute names.

### Writing Integration Tests

Pageflow provides [Dominos](https://github.com/ngauthier/domino) to
test that fields are integrated correctly:

```ruby
describe 'rainbow plugin', type: :feature do
  it 'adds fields to entry edit form' do
    entry = create(:entry)

    Pageflow::Dom::Admin.sign_in_as(:admin)
    form = Pageflow::Dom::Admin::EntryEditForm.for(entry)

    expect(form).to have_input_for_attribute(:issn)
  end
end
```

## Adding Rows to Attributes Tables

We can display the value of the new attributes inside the resources'
attributes tables:

```ruby
# rainbow/lib/rainbow/plugin.rb
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.admin_attributes_table_rows.register(:entry, :issn, after: :title)
      config.admin_attributes_table_rows.register(:account, :issn, before: :updated_at)
    end
  end
end
```

Apart from the `before` and `after` options, all options are passed to
the `row` method of the `ActiveAdmin::Views::AttributesTable`:

```ruby
def configure(config)
  config.admin_attributes_table_rows.register(:entry, :issn, class: 'custom_class')
end
```

To use custom Arbre rendering logic, we can pass a block:

```ruby
def configure(config)
  config.admin_attributes_table_rows.register(:entry, :issn, after: :title) do |entry|
    span(entry.issn, class: 'some_custom_class')
  end
end
```

### Writing Integration Tests

Again we can test the correct display:

```ruby
describe 'rainbow plugin', type: :feature do
  it 'adds row to entry attributes table do
    entry = create(:entry, issn: '123')

    Pageflow::Dom::Admin.sign_in_as(:admin)
    table = Pageflow::Dom::Admin::AttributesTable.for(entry)

    expect(table.contents_of_row(:issn)).to have_text: '123'
  end
end
```

## Guarding Admin Extensions behind a Feature Flag

Both form inputs and attributes table rows can be wrapped in a
feature:

```ruby
# rainbow/lib/rainbow/plugin.rb
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.features.register('rainbow.issn') do |feature_config|
        feature_config.admin_form_inputs.register(:entry, :issn)
        feature_config.admin_attributes_table_rows.register(:entry, :issn)
      end
    end
  end
end
```

In tests, we can enable the feature for an entry or account via the
`with_feature` trait:

```ruby
create(:entry, with_feature: 'rainbow.issn')
```

## Adding Tabs

By default the entry's admin page contains tabs listing members and
revisions. The account's admin page provides tabs with user and entry
lists. Plugins can add custom tabs which are implemented via Arbre
components:

```ruby
# rainbow/lib/rainbow/plugin.rb
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.admin_resource_tabs.register(:entry,
                                          name: :my_custom_tab,
                                          component: SomeTab)
    end
  end

  class SomeTab < Arbre::Component
    def build(entry)
      span 'Arbre code to render tab contents'
    end
  end
end
```

To display a tab on the account's page it needs to be registered for
sites:

```ruby
# rainbow/lib/rainbow/plugin.rb
module Rainbow
  class Plugin < Pageflow::Plugin
    def configure(config)
      config.admin_resource_tabs.register(:site,
                                          name: :my_custom_tab,
                                          component: SomeTab)
    end
  end

  class SomeTab < Arbre::Component
    def build(site)
      # Use site.account to access the account
    end
  end
end
```

See documentation of `Pageflow::Admin::Tabs#register` for
authorization options to display tabs only to users with certain
roles and rights.
