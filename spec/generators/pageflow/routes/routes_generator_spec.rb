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

      it 'adds the Pageflow routes' do
        run_generator
        routes = file('config/routes.rb')
        expect(routes).to contain("  Pageflow.routes(self)\n")
      end
    end
  end
end
