require 'pageflow/version'
require 'pageflow/dummy/exit_on_failure_patch'

module Pageflow
  module Dummy
    class App
      def generate
        ENV['RAILS_ROOT'] = File.expand_path(directory)

        if File.exist?(directory)
          puts("Dummy directory #{directory} exists.")
        else
          system("bundle exec rails new #{directory} --skip-spring " \
                 "--template #{template_path} #{rails_new_options}") ||
            raise('Error generating dummy app.')
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
        result = '--skip-test-unit --skip-bundle --database=mysql'
        result << ' --skip-javascript' if Pageflow::RailsVersion.experimental?
        result
      end
    end
  end
end
