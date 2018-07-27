require 'spec_helper'
require 'support/shared_contexts/generator'
require 'generators/pageflow/resque/resque_generator'

module Pageflow
  module Generators
    describe ResqueGenerator, type: :generator do
      before do
        FileUtils.mkdir_p "#{destination_root}/config"

        File.write("#{destination_root}/config/application.rb", <<-RUBY)
          class Application < Rails::Application
            config.load_defaults 5.2
          end
        RUBY
      end

      it 'generates initializers' do
        run_generator
        expect(file('config/initializers/resque.rb')).to exist
        expect(file('config/initializers/resque_enqueue_after_commit_patch.rb')).to exist
        expect(file('config/application.rb')).to contain("queue_adapter = :resque")
      end

      it "generates 'lib/tasks/resque.rake'" do
        run_generator
        expect(file('lib/tasks/resque.rake')).to exist
      end
    end
  end
end
