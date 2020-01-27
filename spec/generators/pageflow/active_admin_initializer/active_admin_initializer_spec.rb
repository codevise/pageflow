require 'spec_helper'
require 'support/shared_contexts/generator'
require 'fileutils'

require 'generators/pageflow/active_admin_initializer/active_admin_initializer_generator'

module Pageflow
  module Generators
    describe ActiveAdminInitializerGenerator, type: :generator do
      before do
        FileUtils.mkdir_p "#{destination_root}/config/initializers"

        FileUtils.touch "#{destination_root}/config/initializers/active_admin.rb"
      end

      it 'adds Pageflow load path to active_admin load path' do
        run_generator
        initializer = file('config/initializers/active_admin.rb')
        expect(initializer)
          .to contain("ActiveAdmin.application.load_paths += [Pageflow.active_admin_load_path]\n\n")
      end
    end
  end
end
