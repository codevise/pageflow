source "https://rubygems.org"

gemspec

require File.expand_path('lib/pageflow/rails_version', File.dirname(__FILE__))
gem 'rails', Pageflow::RailsVersion.detect

gem 'ammeter', '~> 1.1', require: false

gem 'pageflow-support', path: 'spec/support'

gem 'spring-commands-rspec', group: :development

# Early failure output
gem 'rspec-instafail', '~> 0.4.0', require: false

gem 'bootsnap', require: false

group :development do
  gem 'listen'
end

# Required for XML serialization in Active Admin
gem 'activemodel-serializers-xml'

# Make shakapacker available in specs. Host applications that want to
# use shakapacker need to add it to their Gemfile themselves. Requiring
# shakapacker in an engine file (like we normally do) would force all
# host application to install shakapacker.
gem 'shakapacker', '~> 7.0'

# Make tests fail on JS errors
gem 'capybara-chromedriver-logger', git: 'https://github.com/codevise/capybara-chromedriver-logger', branch: 'fix-selenium-4-deprecation', require: false

# See https://github.com/charkost/prosopite/pull/79
gem 'prosopite', git: 'https://github.com/tf/prosopite', branch: 'location-backtrace-cleaner'

# Fixes for Chrome that removed DOMNodeRemoved event
gem 'wysihtml-rails', git: 'https://github.com/codevise/wysihtml-rails', branch: '0-5-5-dom-node-removed-fix'
