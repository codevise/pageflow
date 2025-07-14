module Pageflow
  module Generators
    class InstallGenerator < Rails::Generators::Base
      desc 'Installs Pageflow and generates the necessary migrations.'

      def generate_all
        generate 'active_admin:install User --skip-users'
        generate 'active_admin:devise User --no-default-user'
        generate 'friendly_id'

        invoke 'pageflow:cancan'
        invoke 'pageflow:resque'

        invoke 'pageflow:assets'
        invoke 'pageflow:initializer'
        invoke 'pageflow:procfile'
        invoke 'pageflow:routes'
        invoke 'pageflow:user'
        invoke 'pageflow:seeds'
        invoke 'pageflow:active_admin_initializer'
        invoke 'pageflow:error_pages'

        rake 'pageflow:install:migrations'
      end
    end
  end
end
