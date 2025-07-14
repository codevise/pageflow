require 'spec_helper'
require 'support/shared_contexts/generator'
require 'generators/pageflow/routes/routes_generator'

module Pageflow
  module Generators
    describe RoutesGenerator, type: :generator do
      before do
        FileUtils.mkdir_p "#{destination_root}/config"

        File.write "#{destination_root}/config/routes.rb",
                   "Rails.application.routes.draw do\n  ActiveAdmin.routes(self)\nend"
      end

      let(:routes) { file('config/routes.rb') }

      it 'adds the Pageflow routes' do
        run_generator

        expect(routes).to contain("  Pageflow.routes(self)\n")
      end

      it 'adds Resque::Server' do
        run_generator

        expect(routes).to contain('Resque::Server')
      end

      it 'requires resque/server' do
        run_generator

        expect(routes).to contain("require 'resque/server'")
      end

      it 'requires resque/scheduler/server' do
        run_generator

        expect(routes).to contain("require 'resque/scheduler/server'")
      end
    end
  end
end
