module Pageflow
  module WithFileUsageExtension # rubocop:todo Style/Documentation
    def with_usage_id
      select("#{table_name}.*, pageflow_file_usages.id AS usage_id")
    end
  end
end
