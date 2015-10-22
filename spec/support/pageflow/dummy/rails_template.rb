def source_paths
  [File.join(File.expand_path(File.dirname(__FILE__)), 'templates')]
end

# The Gemfile is not required. We'll use the one from the project root instead.

run 'rm Gemfile'

# Setup database.yml to use credentials from env variable.

gsub_file('config/database.yml',
          /^  database: /,
          "  database: #{ENV.fetch('PAGEFLOW_PLUGIN_ENGINE', 'pageflow')}-")

gsub_file('config/database.yml',
          /^  username:.*\n/,
          "  username: \"<%= ENV.fetch('PAGEFLOW_DB_USER', 'root') %>\"\n")

gsub_file('config/database.yml',
          /^  password:.*\n/,
          "  password: \"<%= ENV.fetch('PAGEFLOW_DB_PASSWORD', '') %>\"\n")

# Recreate db. Ignore if it does not exist.

log :rake, 'db:drop:all'
in_root { run('rake db:drop:all 2> /dev/null', verbose: false) }

rake 'db:create:all'

# Install pageflow and the tested engine via their generators.

generate 'pageflow:install', '--force'
generate "#{ENV['PAGEFLOW_PLUGIN_ENGINE']}:install", '--force' if ENV['PAGEFLOW_PLUGIN_ENGINE']

run 'rm -r spec'

# Devise needs default_url_options for generating mails.

inject_into_file('config/environments/test.rb',
                 "  config.action_mailer.default_url_options = {host: 'test.host'}\n",
                 after: "config.action_mailer.delivery_method = :test\n")

# ActiveAdmin does not look for admin definitions inside dummy apps by default.

prepend_to_file('config/initializers/pageflow.rb',
                 "ActiveAdmin.application.load_paths.unshift(Dir[Rails.root.join('app/admin')])\n")

# Create database tables for fake hosted files and revision components.

copy_file('create_test_hosted_file.rb', 'db/migrate/00000000000000_create_test_hosted_file.rb')
copy_file('create_test_revision_component.rb', 'db/migrate/00000000000001_create_test_revision_component.rb')
copy_file('add_custom_fields.rb', 'db/migrate/99990000000000_add_custom_fields.rb')

# Devise bug fix: rename migrations without file extension

Dir.glob('db/migrate/*').each do |file_name|
  run("mv #{file_name} #{file_name}.rb") if File.extname(file_name).blank?
end

rake 'db:migrate db:test:load', env: 'development'
