module Pageflow
  class ApplicationPolicy
    class Scope
      protected

      def permissions_config
        Pageflow.config.permissions
      end

      def sanitize_sql_array(array)
        ActiveRecord::Base.send(:sanitize_sql_array, array)
      end
    end
  end
end
