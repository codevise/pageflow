module Pageflow
  module OverviewHelper
    def overview_page_description(page)
      if page.configuration['description'].present?
        raw(page.configuration['description'])
      else
        page.title
      end
    end
  end
end
