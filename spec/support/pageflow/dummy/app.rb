module Pageflow
  module Dummy
    class App
      def generate
        ENV['RAILS_ROOT'] = File.expand_path(directory)

        if File.exists?(directory)
          puts("Dummy directory #{directory} exists.")
        else
          system("bundle exec rails new #{directory} --template #{template_path} #{rails_new_options}")
        end

        require(File.join(ENV['RAILS_ROOT'], 'config', 'environment'))
      end

      def directory
        require 'rails/version'
        File.join('spec', 'dummy', "rails-#{Rails::VERSION::STRING}")
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
