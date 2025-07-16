module Pageflow
  # @api private
  class ApplicationPolicy
    # @api private
    class Scope
      protected

      def sanitize_sql_array(array)
        ActiveRecord::Base.send(:sanitize_sql_array, array)
      end
    end

    protected

    def permissions_config
      Pageflow.config.permissions
    end
  end
end
