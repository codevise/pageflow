module Pageflow
  class ApplicationQuery
    class Scope
      protected

      # @api protected
      def sanitize_sql(sql, interpolations)
        ActiveRecord::Base.send(:sanitize_sql_array, [sql, interpolations])
      end
    end
  end
end
