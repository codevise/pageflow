$:.push File.expand_path('../lib', __FILE__)

require 'pageflow/version'

Gem::Specification.new do |s|
  s.name        = 'pageflow'
  s.version     = Pageflow::VERSION
  s.authors     = ['Codevise Solutions Ltd']
  s.email       = ['info@codevise.de']
  s.homepage    = 'http://www.pageflow.io'
  s.summary     = 'Multimedia story telling for the web.'

  s.files = Dir['{admins,app,config,db,lib,vendor,spec/factories}/**/*', 'MIT-LICENSE', 'Rakefile', 'README.rdoc']
  s.test_files = Dir['test/**/*']

  s.add_dependency 'rails', '>= 4.0.2', '< 4.2'

  s.add_dependency 'activeadmin'

  # Make devise mailers use resque. (Needs to be below active admin entry!)
  s.add_dependency 'devise-async'

  s.add_dependency 'devise', '~> 3.0.2'

  # Resque jobs and queues
  s.add_dependency 'resque'
  s.add_dependency 'resque-scheduler', '~> 2.5.5'
  s.add_dependency 'resque-logger'
  s.add_dependency 'resque_mailer'
  s.add_dependency 'ar_after_transaction'
  s.add_dependency 'redis'
  s.add_dependency 'redis-namespace'
  s.add_dependency 'yajl-ruby'

  # Authorization
  s.add_dependency 'cancan'

  # State machines for active record
  s.add_dependency 'state_machine'

  # Trigger resque jobs with a state machine
  s.add_dependency 'state_machine_job', '~> 0.2'

  # File attachments
  s.add_dependency 'paperclip', '~> 3.5'

  # zencoder
  s.add_dependency 'zencoder', '~> 2.5'

  # Amazon AWS
  s.add_dependency 'aws-sdk'

  # VideoJS for Asset Pipeline, version fixed at 4.1.0
  # Recommendation: Do not change
  s.add_dependency 'videojs_rails', '4.1.0'

  # Use jquery as the JavaScript library
  s.add_dependency 'jquery-rails', '~> 3.0'
  s.add_dependency 'jquery-ui-rails', '~> 5.0'
  s.add_dependency 'jquery-layout-rails', '~> 0.1.0'
  s.add_dependency 'jquery-fileupload-rails', '0.4.1'

  s.add_dependency 'backbone-rails', '~> 1.0.0'

  # Further helpers and conventions on top of Backbone
  s.add_dependency 'marionette-rails', '~> 1.1.0'


  # Templating engine used to render jst tempaltes.
  s.add_dependency 'ejs'

  # Using translations from rails locales in javascript code.
  s.add_dependency 'i18n-js'

  # WYSIWYG editor
  s.add_dependency 'wysihtml5x-rails', '0.4.17'

  s.add_dependency 'bourbon', '~> 3.1.8'

  # Pretty URLs
  s.add_dependency 'friendly_id', '~> 5.0'

  # Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
  s.add_dependency 'jbuilder', '~> 1.5'

  # Used by the dummy rails application
  s.add_development_dependency 'mysql2'

  # Testing framework
  s.add_development_dependency 'rspec-rails', '~> 2.14.0'

  # Browser like integration testing
  s.add_development_dependency 'capybara'

  # Headless browser testing
  s.add_development_dependency 'capybara-webkit'

  # View abstraction fro integration testing
  s.add_development_dependency 'domino'

  # Fixture replacement
  s.add_development_dependency 'factory_girl_rails'

  # Clean database in integration tests
  s.add_development_dependency 'database_cleaner', '~> 1.2'

  # Freeze time in tests
  s.add_development_dependency 'timecop'

  # Early failure output
  s.add_development_dependency 'rspec-instafail'

  # Colorized console output
  s.add_development_dependency 'colorize'

  # Javascript unit testing
  s.add_development_dependency 'teaspoon'

  # Stub HTTP requests in tests
  s.add_development_dependency 'webmock'
end
