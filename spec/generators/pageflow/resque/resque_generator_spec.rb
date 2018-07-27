require 'spec_helper'
require 'support/shared_contexts/generator'
require 'generators/pageflow/resque/resque_generator'

module Pageflow
  module Generators
    describe ResqueGenerator, type: :generator do
      it 'generates initializers' do
        run_generator
        expect(file('config/initializers/resque.rb')).to exist
        expect(file('config/initializers/resque_mailer.rb')).to exist
        expect(file('config/initializers/resque_logger.rb')).to exist
        expect(file('config/initializers/resque_enqueue_after_commit_patch.rb')).to exist
      end

      it "generates 'lib/tasks/resque.rake'" do
        run_generator
        expect(file('lib/tasks/resque.rake')).to exist
      end
    end
  end
end
