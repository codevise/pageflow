$:.push File.expand_path('../../lib', __dir__)

require 'pageflow/version'
require 'pageflow/rails_version'

Gem::Specification.new do |s|
  s.name        = 'pageflow-support'
  s.version     = Pageflow::VERSION
  s.authors     = ['Codevise Solutions Ltd']
  s.email       = ['info@codevise.de']
  s.homepage    = 'https://pageflow.io'
  s.summary     = 'Spec support for Pageflow extensions.'

  s.files = Dir['pageflow/**/*']
  s.test_files = []

  s.require_paths = ['.']

  s.required_ruby_version = '>= 3.2'

  s.add_runtime_dependency 'mysql2', '~> 0.5.2'
  s.add_runtime_dependency 'pageflow', Pageflow::VERSION

  s.add_runtime_dependency 'domino', '~> 0.7.0'
  s.add_runtime_dependency 'factory_bot_rails', '~> 4.8'

  s.add_runtime_dependency 'bootsnap', '~> 1.0'
  s.add_runtime_dependency 'listen', '~> 3.0'

  s.add_runtime_dependency 'resque', '~> 2.6'
  s.add_runtime_dependency 'resque-scheduler', '~> 4.10'

  s.add_runtime_dependency 'ar_after_transaction', '~> 0.10.0'

  s.add_runtime_dependency 'redis', '~> 3.0'
  s.add_runtime_dependency 'redis-namespace', '~> 1.5'

  s.add_runtime_dependency 'sassc-rails', '~> 2.1'
end
