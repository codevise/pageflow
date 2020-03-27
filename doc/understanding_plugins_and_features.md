# @title Understanding Plugins and Features

Pageflow can be extended in a couple of ways: adding page types,
widget types, file types, help entries, admin tabs. Often it makes
sense to package up a couple of such extensions together in a gem.

## Defining Plugins

Plugins allow to keep the configuration code required to register
multiple components in a single place. A plugin looks like this:

    class MyPlugin < Pageflow::Plugin
      def configure(config)
        # Anything that could go in the pageflow initializer
      end
    end

In the host application a plugin is used the following way:

    # config/initializer/pageflow.rb

    Pageflow.configure do |config|
      config.plugin(MyPlugin.new)
    end

Plugins help limit duplication and make configuration changes easy
without having to edit code in the host application.

## Defining Features

Sometimes it might be desirable to selectively enable certain
funtionality only for certain accounts or entries. To achieve this,
instead of registering i.e. a page type directly it can be wrapped in
a feature:

    class MyPlugin < Pageflow::Plugin
      def configure(config)
        config.features.register("my_feature") do |feature_config|
          feature_config.page_types.register(MyPageType.new)
        end
      end
    end

Only a subset of the configuration API is supported inside feature
blocks (see `Pageflow::Configuration::FeatureLevelConfiguration`). For
each registed feature, a toggle will be displayed on the features tab
of the entry and account admin pages. The following translation key
is used as display name:

    pageflow:
      my_feature:
        feature_name: "Name to display in admin"

Whenever the feature has been enabled for an entry or its account the
corresponding configuration block will be executed to build the used
configuration.
