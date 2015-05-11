source "https://rubygems.org"

gemspec

require File.expand_path('spec/support/pageflow/rails_version', File.dirname(__FILE__))
gem 'rails', Pageflow::RailsVersion.detect

gem 'pageflow-support', path: 'spec/support'

# Admin interface engine (Rails 4 compatibility: https://github.com/gregbell/active_admin/pull/2326)
gem 'state_machine', git: 'https://github.com/tf/state_machine.git', branch: 'master'
gem 'activeadmin', git: 'https://github.com/codevise/active_admin.git', branch: 'rails4'
gem 'ransack'
gem 'inherited_resources', '1.4.1'
gem 'formtastic', '2.3.0'

# Ensure that teaspoon is required via Bundler.require inside the
# dummy app. Otherwise teaspoon fails to initialize correctly.
gem 'teaspoon', '~> 0.9.0'

gem 'spring-commands-rspec', group: :development
gem 'spring-commands-teaspoon', group: :development
