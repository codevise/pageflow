module Pageflow
  module TextDirectionHelper # rubocop:todo Style/Documentation
    def text_direction(locale)
      PublicI18n.text_direction(locale)
    end
  end
end
