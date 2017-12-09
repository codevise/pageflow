module Pageflow
  class CnameThemingRequestScope
    def call(themings, request)
      themings
        .includes(:domains)
        .where(pageflow_domains: { name: request.host })
    end
  end
end
