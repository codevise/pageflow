require 'rails/generators'

module Pageflow
  module Generators
    class ProcfileGenerator < Rails::Generators::Base
      desc 'Generate a Procfile in Rails root.'

      source_root File.expand_path('templates', __dir__)

      def generate_procfile
        copy_file 'Procfile', 'Procfile'
      end
    end
  end
end
