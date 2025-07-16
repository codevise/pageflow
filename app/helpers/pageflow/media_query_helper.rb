module Pageflow
  module MediaQueryHelper # rubocop:todo Style/Documentation
    def media_query(condition, &)
      content = capture(&)

      if condition == :default
        content
      else
        "@media screen and (#{condition}) {\n#{content}}".html_safe
      end
    end
  end
end
