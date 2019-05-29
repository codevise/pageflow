source "https://rubygems.org"

gemspec

require File.expand_path('spec/support/pageflow/rails_version', File.dirname(__FILE__))
gem 'rails', Pageflow::RailsVersion.detect

gem 'pageflow-support', path: 'spec/support'

# Ensure that teaspoon is required via Bundler.require inside the
# dummy app. Otherwise teaspoon fails to initialize correctly.
gem 'teaspoon-mocha', git: 'https://github.com/codevise/teaspoon', branch: 'pageflow'

gem 'spring-commands-rspec', group: :development
gem 'spring-commands-teaspoon', group: :development

gem 'pageflow-theme-doc-publisher', git: 'https://github.com/tf/pageflow-theme-doc-publisher'

gem 'coveralls', require: false

# Early failure output
gem 'rspec-instafail', '~> 0.4.0', require: false

gem 'bootsnap', require: false

group :development do
  gem 'listen'
end

# Required to make imports in Active Admin stylesheet work
gem 'sassc-rails', '~> 1.0'

# Required for XML serialization in Active Admin
gem 'activemodel-serializers-xml'

# Make tests fail on JS errors
gem 'capybara-chromedriver-logger', git: 'https://github.com/codevise/capybara-chromedriver-logger', branch: 'do-not-raise-on-filtered-errors', require: false
