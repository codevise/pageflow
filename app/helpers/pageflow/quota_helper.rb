module Pageflow
  module QuotaHelper
    def quota_state_description(name, account)
      description = Pageflow.config.quotas.get(:users, account).state_description

      if description
        content_tag(:p, description, :class => 'quota_state')
      end
    end
  end
end
