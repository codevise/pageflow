source "https://rubygems.org"

gemspec

require File.expand_path('spec/support/pageflow/rails_version', File.dirname(__FILE__))
gem 'rails', Pageflow::RailsVersion.detect

gem 'pageflow-support', path: 'spec/support'

gem 'spring-commands-rspec', group: :development

gem 'coveralls', require: false

# Early failure output
gem 'rspec-instafail', '~> 0.4.0', require: false

gem 'bootsnap', require: false

group :development do
  gem 'listen'
end

# Required for XML serialization in Active Admin
gem 'activemodel-serializers-xml'

# Make webpacker available in specs. Host applications that want to
# use webpacker need to add it to their Gemfile themselves. Requiring
# webpacker in an engine file (like we normally do) would force all
# host application to install webpacker.
gem 'webpacker'

# Make tests fail on JS errors
gem 'capybara-chromedriver-logger', git: 'https://github.com/codevise/capybara-chromedriver-logger', branch: 'do-not-raise-on-filtered-errors', require: false
