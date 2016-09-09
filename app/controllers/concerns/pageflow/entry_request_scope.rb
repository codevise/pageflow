module Pageflow
  module EntryRequestScope
    protected

    def entry_request_scope
      Pageflow.config.public_entry_request_scope.call(Entry, request)
    end
  end
end
