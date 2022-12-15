module Pageflow
  class CnameSiteRequestScope
    def call(sites, request)
      sites.where(<<-SQL, host: request.host)
        cname = :host OR
        FIND_IN_SET(
          :host,
          REPLACE(additional_cnames, SPACE(1), "")
        )
      SQL
    end
  end
end
