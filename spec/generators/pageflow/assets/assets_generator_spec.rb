require 'spec_helper'
require 'support/shared_contexts/generator'
require 'fileutils'

require 'generators/pageflow/assets/assets_generator'

module Pageflow
  module Generators
    describe AssetsGenerator, type: :generator do
      before do
        FileUtils.mkdir_p "#{destination_root}/app/assets/javascripts"
        FileUtils.mkdir_p "#{destination_root}/app/assets/stylesheets"
        FileUtils.mkdir_p "#{destination_root}/config"

        FileUtils.touch "#{destination_root}/app/assets/javascripts/active_admin.js"
        FileUtils.touch "#{destination_root}/app/assets/stylesheets/active_admin.scss"
        FileUtils.touch "#{destination_root}/config/application.rb"
      end

      it 'generates editor assets' do
        run_generator
        expect(file('app/assets/javascripts/pageflow/editor.js')).to exist
        expect(file('app/assets/stylesheets/pageflow/editor.scss')).to exist
      end

      it 'generates application assets' do
        run_generator
        expect(file('app/assets/javascripts/pageflow/application.js')).to exist
        expect(file('app/assets/stylesheets/pageflow/application.scss')).to exist
      end

      it 'requires pageflow in active_admin JavaScript' do
        run_generator
        asset = file('app/assets/javascripts/active_admin.js')
        expect(asset).to contain("//= require pageflow/admin\n")
      end

      it 'requires pageflow in active_admin SCSS' do
        run_generator
        asset = file('app/assets/stylesheets/active_admin.scss')
        expect(asset).to contain("@import \"pageflow/admin\";\n")
      end
    end
  end
end
