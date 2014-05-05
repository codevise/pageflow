module Pageflow
  module Admin
    module RevisionsHelper
      def revision_css_class(revision)
        css_classes = []
        css_classes << 'published' if revision.published?
        css_classes.join(' ')
      end
    end
  end
end
