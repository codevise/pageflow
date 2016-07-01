source "https://rubygems.org"

gemspec

require File.expand_path('spec/support/pageflow/rails_version', File.dirname(__FILE__))
gem 'rails', Pageflow::RailsVersion.detect

gem 'pageflow-support', path: 'spec/support'

gem 'state_machine', git: 'https://github.com/codevise/state_machine.git', branch: 'master'

# Ensure that teaspoon is required via Bundler.require inside the
# dummy app. Otherwise teaspoon fails to initialize correctly.
gem 'teaspoon-mocha', '~> 2.3'

gem 'spring-commands-rspec', group: :development
gem 'spring-commands-teaspoon', group: :development

gem 'pageflow-theme-doc-publisher', git: 'https://github.com/tf/pageflow-theme-doc-publisher'

gem 'coveralls', require: false

# Early failure output
gem 'rspec-instafail', '~> 0.4.0', require: false
