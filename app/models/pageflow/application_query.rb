module Pageflow
  # Abstraction layer for Pageflow's query interface
  class ApplicationQuery
    class Scope
      protected

      # @api private
      def sanitize_sql(sql, interpolations)
        ActiveRecord::Base.send(:sanitize_sql_array, [sql, interpolations])
      end
    end
  end
end
