module Pageflow
  class ApplicationPolicy
    class Scope
      protected

      def sanitize_sql_array(array)
        ActiveRecord::Base.send(:sanitize_sql_array, array)
      end
    end
  end
end
