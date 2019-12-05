begin
  require 'bundler/setup'
rescue LoadError
  puts 'You must `gem install bundler` and `bundle install` to run rake tasks'
end

require 'rdoc/task'

RDoc::Task.new(:rdoc) do |rdoc|
  rdoc.rdoc_dir = 'rdoc'
  rdoc.title    = 'Pageflow'
  rdoc.options << '--line-numbers'
  rdoc.rdoc_files.include('README.rdoc')
  rdoc.rdoc_files.include('lib/**/*.rb')
end

task 'release' do
  Rake.application['pageflow:release:pageflow_support'].invoke
end

require 'semmy'
Semmy::Tasks.install do |config|
  config.github_repository = 'codevise/pageflow'
  config.source_files_with_docs_tags = '{app,lib,packages/*/src,spec/support/pageflow}/**/*.{js,jsx,rb,scss}'
end

require File.expand_path('spec/support/pageflow/dummy/app', File.dirname(__FILE__))
APP_RAKEFILE = File.expand_path("../#{Pageflow::Dummy::App.new.directory}/Rakefile", __FILE__)

load 'rails/tasks/engine.rake' if File.exists?(APP_RAKEFILE)
load File.expand_path('lib/tasks/pageflow_tasks.rake', File.dirname(__FILE__))

Bundler::GemHelper.install_tasks

task 'release:prepare' => 'pageflow:packages:build'
