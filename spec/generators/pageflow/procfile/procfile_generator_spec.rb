require 'spec_helper'
require 'support/shared_contexts/generator'
require 'generators/pageflow/procfile/procfile_generator'

module Pageflow
  module Generators
    describe ProcfileGenerator, type: :generator do
      let(:procfile) { file('Procfile') }

      it "generates '/Procfile'" do
        run_generator

        expect(procfile).to exist
        expect(procfile).to contain "web: bundle exec rails server"
        expect(procfile).to contain "worker: bundle exec rake resque:work QUEUE=*"
        expect(procfile).to contain "scheduler: bundle exec rake resque:scheduler QUEUE=*"
      end
    end
  end
end
