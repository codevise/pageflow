module Pageflow
  module TextDirectionHelper
    def text_direction(locale)
      PublicI18n.text_direction(locale)
    end
  end
end
