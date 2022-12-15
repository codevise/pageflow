module Pageflow
  module Admin
    # @api private
    module PermalinksHelper
      def collection_for_permalink_directories(site, permalink)
        options_from_collection_for_select(
          site.permalink_directories,
          'id',
          'path',
          permalink.directory_id
        )
      end
    end
  end
end
