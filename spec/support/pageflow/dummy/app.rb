require 'pageflow/version'

module Pageflow
  module Dummy
    class App
      def generate
        ENV['RAILS_ROOT'] = File.expand_path(directory)

        if File.exist?(directory)
          puts("Dummy directory #{directory} exists.")
        else
          system("bundle exec rails new #{directory} " \
                 "--template #{template_path} #{rails_new_options}")
        end

        require(File.join(ENV['RAILS_ROOT'], 'config', 'environment'))
        require('pageflow/dummy/config/pageflow')
      end

      def directory
        require 'rails/version'
        File.join('spec', 'dummy', "rails-#{Rails::VERSION::STRING}-pageflow-#{Pageflow::VERSION}")
      end

      def template_path
        File.expand_path(File.join('..', 'rails_template.rb'), __FILE__)
      end

      def rails_new_options
        '--skip-test-unit --skip-bundle --database=mysql'
      end
    end
  end
end
