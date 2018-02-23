module Pageflow
  class ApplicationRecord < ActiveRecord::Base
    self.abstract_class = true

    # We turn "people/5-20071224150000" into "people/1220-20071224150000"
    # Where 1220 is the Pageflow::VERSION with periods removed.
    # A Pageflow version change warrants expiry of all caches.
    # TODO on Rails 5.2 move this code into the `version`.
    def cache_key
      super.sub(/\d+/, Pageflow::VERSION.delete('.'))
    end
  end
end
