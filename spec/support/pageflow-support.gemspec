$:.push File.expand_path('../../../lib', __FILE__)

require 'pageflow/version'

Gem::Specification.new do |s|
  s.name        = 'pageflow-support'
  s.version     = Pageflow::VERSION
  s.authors     = ['Codevise Solutions Ltd']
  s.email       = ['info@codevise.de']
  s.homepage    = 'http://www.pageflow.io'
  s.summary     = 'Spec support for Pageflow extensions.'

  s.files = Dir['pageflow/**/*']
  s.test_files = []

  s.require_paths = ['.']

  s.add_runtime_dependency 'mysql2'
end
