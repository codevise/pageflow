def source_paths
  [File.join(File.expand_path(File.dirname(__FILE__)), 'templates')]
end

# The Gemfile is not required. We'll use the one from the project root instead.

run 'rm Gemfile'

# Setup database.yml to use credentials from env variable.

copy_file('database.yml', 'config/database.yml', force: true)

rails_version_string = Rails::VERSION::STRING.tr!('.', '_')

engine_name = ENV.fetch('PAGEFLOW_PLUGIN_ENGINE', 'pageflow')
database_prefix = "#{engine_name}-rails-#{rails_version_string}"

gsub_file('config/database.yml',
          /^  database: /,
          "  database: #{database_prefix}-")

append_to_file('config/application.rb', <<-END)
  if ENV['PAGEFLOW_DB_HOST'].present?
    ActiveRecord::Tasks::DatabaseTasks::LOCAL_HOSTS << ENV['PAGEFLOW_DB_HOST']
  end
END

# Ensure pageflow is required even if it is not listed in plugin Gemfile does
inject_into_file('config/application.rb',
                 "require 'pageflow'\n",
                 after: "Bundler.require(*Rails.groups)\n")

# Remove requires to missing gems (i.e. turbolinks)
gsub_file('app/assets/javascripts/application.js', %r'//=.*', '')

# Recreate db. Ignore if it does not exist.

in_root { run('rake db:environment:set db:drop:all', capture: true, abort_on_failure: false) }
rake 'db:create:all'

# Install pageflow and the tested engine via their generators.

generate 'pageflow:install', '--force'
generate "#{ENV['PAGEFLOW_PLUGIN_ENGINE']}:install", '--force' if ENV['PAGEFLOW_PLUGIN_ENGINE']

# Devise needs default_url_options for generating mails.

inject_into_file('config/environments/test.rb',
                 "  config.action_mailer.default_url_options = {host: 'test.host'}\n",
                 after: "config.action_mailer.delivery_method = :test\n")

# ActiveAdmin does not look for admin definitions inside dummy apps by default.

prepend_to_file('config/initializers/pageflow.rb', <<-END)
  ActiveAdmin.application.load_paths.unshift(Dir[Rails.root.join('app/admin')].first)\n
END

# Add required files for test theme

copy_file('test_theme.scss',
          'app/assets/stylesheets/pageflow/themes/test_theme.scss')
copy_file('test_theme_preview.png',
          'app/assets/images/pageflow/themes/test_theme/preview.png')
copy_file('test_theme_preview.png',
          'app/assets/images/pageflow/themes/test_theme/preview_thumbnail.png')

# Normally theme stylesheets are added to the precompile list
# automatically. Since the test_theme is not yet registered when the
# environment is loaded, we need to add its stylesheet manually.

append_to_file('config/initializers/assets.rb', <<-END)
  Rails.application.config.assets.precompile += %w( pageflow/themes/test_theme.css )
END

# Create database tables for fake hosted files and revision components.

copy_file('create_test_uploadable_file.rb',
          'db/migrate/00000000000000_create_test_uploadable_file.rb')
copy_file('create_test_multi_attachment_file.rb',
          'db/migrate/00000000000001_create_test_multi_attachment_file.rb')
copy_file('create_test_revision_component.rb',
          'db/migrate/00000000000002_create_test_revision_component.rb')
copy_file('add_custom_fields.rb',
          'db/migrate/99990000000000_add_custom_fields.rb')

rake 'db:migrate db:test:load', env: 'development'
