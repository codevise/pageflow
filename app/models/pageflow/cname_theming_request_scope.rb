module Pageflow
  class CnameThemingRequestScope
    def call(themings, request)
      themings.where(cname: request.host)
    end
  end
end
